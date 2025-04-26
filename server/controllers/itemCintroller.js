const Item = require('../models/Item');
const fs = require('fs');
const csv = require('csv-parser');
const { logChange } = require('../logger'); //Connect to logger for history feature
const fetch = require('node-fetch'); //for email sending
const path = require('path'); //Moved up to top for email system
const dotenv = require('dotenv');
dotenv.config();

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  const { name, quantity, price, category, tags = [], userEmail } = req.body; //Added 'userEmail' as to track the user that added the item
  const item = new Item({ name, quantity, price, category, tags });
  try {
    const savedItem = await item.save();

    //For History Tracking (To tell what user modified the database)
    logChange('Add', userEmail || 'unknown@example.com', savedItem.name);

    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (!item.history) item.history = [];
    item.history.push({
      quantity: item.quantity,
      timestamp: new Date(),
      email: req.body.userEmail || 'unknown@example.com'
    });

    item.name = req.body.name;
    item.quantity = req.body.quantity;
    item.price = req.body.price;
    item.category = req.body.category;
    item.tags = req.body.tags;

    const updatedItem = await item.save();

    // If quantity is 0 and email exists, send the email
    if (parseInt(item.quantity) === 0 && req.body.userEmail) {
      console.log('Sending email to:', req.body.userEmail);

      const emailPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          to_email: req.body.userEmail,
          item_name: updatedItem.name
        }
      };

      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: 'http://localhost'
          },
          body: JSON.stringify(emailPayload)
        });
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    const updated = await item.save();
    res.json(updated);
    //Logs Change
    const userEmail = req.body.userEmail || 'unknown@example.com';
    logChange('Update', userEmail, item.name);
    
  } catch (error) {
    console.error(err);
      res.status(400).json({ message: err.message });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

// Log the deletion
    const userEmail = req.body.userEmail || 'unknown@example.com';
    logChange('Delete', userEmail, item.name);

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.importCSV = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.files.file;
  const results = [];
  // Moved const path to top
  const uploadsDir = path.join(__dirname, '../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  const filePath = path.join(uploadsDir, file.name);
  file.mv(filePath, err => {

    if (err) return res.status(500).send(err);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', data => {
        results.push({
          name: data.name,
          quantity: Number(data.quantity),
          price: Number(data.price),
          category: data.category,
          tags: data.tags ? data.tags.split(';').map(t => t.trim()) : []
        });
      })
      .on('end', async () => {
              try {
                await Item.insertMany(results);
                res.send('CSV imported successfully');
              } catch (err) {
                res.status(500).json({ message: err.message });
              }
      });
  });
};
