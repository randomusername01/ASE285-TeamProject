const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { parse } = require('json2csv');
const csv = require('csv-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api/items', require('./routes/itemRoutes'));

const path = require('path');

//Login API for checking Login Credentials
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const emails = process.env.LOGIN_EMAILS.split(',');
const passwords = process.env.LOGIN_PASSWORDS.split(',');

const index = emails.findIndex((e) => e.trim() === email);
if (index !== -1 && passwords[index].trim() === password) {
  return res.json({ success: true });
} else {
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
}
});
//End of Login API

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

//Email Tracker for JSON file named 'emailNotice' 
//(For Checking if email has already been sent for that item, ensuring no duplicates)
const sentFilePath = path.join(__dirname, './emailNotice.json');
let sentItems = [];
try {
  sentItems = JSON.parse(fs.readFileSync(sentFilePath));
} catch (err) {
  console.error('Could not read emailNotice.json', err);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
