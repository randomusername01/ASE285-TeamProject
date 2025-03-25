# Test Plan

Our testing strategy includes three major types of tests to ensure functionality, stability, and user satisfaction.

---

## Integration Tests
Verify that different parts of the system — especially the backend logic and database (MongoDB) — work together properly.

**Examples:**
- Adding a new item correctly stores it in MongoDB
- Updating stock quantity reflects in the database and UI
- Low-stock detection triggers after quantity is adjusted

---

## Regression Tests
Ensure that existing features continue to work after new features are added or code is changed.

**Examples:**
- “Add Item” feature still works after “Update Item” is implemented
- Search/filter continues to return correct results after DB changes
- Previously fixed bugs do not reappear after future sprints

---

## Acceptance Tests
Test the app as a complete user experience, simulating real-world scenarios to validate that the system meets all requirements.

**Examples:**
- A user adds, edits, and deletes an item successfully
- A manager sees low-stock notification after items drop below threshold
- A user performs a search and finds the correct item without errors
