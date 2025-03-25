#  Epics & Requirements

---

## Feature: Add & Manage Items (Priyanka)

**Epic:**  
Enable users to add new inventory items and manage stock quantities for each product.

**User Story:**  
As an inventory manager, I want to add new items with details like name, quantity, price, and category, and update or remove them as needed so that I can maintain accurate stock records.

**Requirements:**
- [ ] Create form for adding new inventory items
- [ ] Each item must include name, price, quantity, and category
- [ ] Implement input validation (e.g., no negative quantity)
- [ ] Enable updating item details
- [ ] Enable deleting/disabling discontinued items
- [ ] Store and retrieve item data from MongoDB

---

## Feature: Mock Interview Simulator (Preston)

**Epic:**  
Simulate a basic inventory search and query interface that mimics user-facing functionality.

**User Story:**  
As a user, I want to be able to search for inventory items by name or category so that I can quickly find what I’m looking for.

**Requirements:**
- [ ] Display all inventory items in a table or card view
- [ ] Implement search bar for item name or category
- [ ] Show search results in real-time
- [ ] Allow filtering by category
- [ ] Pull data from MongoDB and update dynamically
