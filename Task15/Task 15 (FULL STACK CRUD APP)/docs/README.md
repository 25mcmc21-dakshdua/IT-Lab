# Full-Stack CRUD Application with React, AJAX, and MySQL

A complete user management system demonstrating full-stack development with React frontend, Express.js backend, and MySQL database integration.

## 🚀 Features

### Core CRUD Operations
- ✅ **Create** - Add new users with form validation
- ✅ **Read** - Display users in a paginated table
- ✅ **Update** - Edit existing user information
- ✅ **Delete** - Remove users with confirmation

### Advanced Features
- 🔍 **Real-time Search** - Filter users by name, email, role, or department
- 📊 **Pagination** - Navigate through large datasets efficiently
- 🔄 **Sorting** - Click column headers to sort (ascending/descending)
- ⚡ **Optimistic UI Updates** - Instant feedback with automatic rollback on failure
- 🎨 **Modern UI** - Responsive design with smooth animations
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔔 **Toast Notifications** - User-friendly success/error messages
- ✨ **Loading States** - Visual feedback during API calls

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone or Download the Project

```bash
# Create project directory
mkdir fullstack-crud-app
cd fullstack-crud-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MySQL Database

#### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE usermanagement;

# Exit MySQL
exit;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Execute: `CREATE DATABASE usermanagement;`

### 4. Configure Database Connection

The server is configured with default MySQL credentials. If your setup is different, update `server.js`:

```javascript
const pool = mysql.createPool({
  host: 'localhost',        // Your MySQL host
  user: 'root',             // Your MySQL username
  password: '',             // Your MySQL password
  database: 'usermanagement',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

Or use environment variables:

```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=yourpassword
export DB_NAME=usermanagement
```

### 5. Start the Server

```bash
# Start the backend server
npm start

# Or for development with auto-reload
npm run dev
```

The server will:
- Start on `http://localhost:3001`
- Automatically create the `users` table
- Populate it with 15 sample users

### 6. Open the Frontend

Open `index.html` in your web browser:

```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or simply drag and drop `index.html` into your browser.

## 📁 Project Structure

```
fullstack-crud-app/
├── server.js          # Express backend with MySQL integration
├── package.json       # Node.js dependencies and scripts
├── index.html         # React frontend (single-page application)
└── README.md          # This file
```

## 🔌 API Endpoints

### GET /api/users
Retrieve users with pagination, sorting, and filtering.

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `sortField` (string) - Field to sort by (id, name, email, role, department, created_at)
- `sortOrder` (string) - Sort direction (asc, desc)
- `search` (string) - Search term for filtering

**Response:**
```json
{
  "users": [...],
  "totalUsers": 15,
  "totalPages": 2,
  "currentPage": 1
}
```

### GET /api/users/:id
Retrieve a single user by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Developer",
  "department": "Engineering",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "Designer",
  "department": "Design"
}
```

**Response:** Created user object with status 201

### PUT /api/users/:id
Update an existing user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "Senior Designer",
  "department": "Design"
}
```

**Response:** Updated user object

### DELETE /api/users/:id
Delete a user by ID.

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## 🎯 Technical Implementation Details

### Backend (Express + MySQL)

#### Database Schema
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Key Features
- **Connection Pooling** - Efficient database connection management
- **Parameterized Queries** - Protection against SQL injection
- **Input Validation** - Server-side validation for all fields
- **Error Handling** - Comprehensive error responses
- **CORS Enabled** - Cross-origin resource sharing for frontend

### Frontend (React)

#### State Management
- `useState` for local component state
- `useEffect` for side effects and data fetching
- `useCallback` for memoized functions

#### AJAX Implementation
Uses the Fetch API for all HTTP requests:
```javascript
const response = await fetch(`${API_URL}/users`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
```

#### Optimistic UI Updates
1. **Immediate Update** - UI updates instantly when user performs action
2. **API Call** - Request sent to server in background
3. **Success** - Replace optimistic data with server response
4. **Failure** - Rollback to previous state and show error

Example flow:
```javascript
// 1. Optimistic update
setUsers(prev => prev.filter(u => u.id !== userId));

try {
  // 2. API call
  await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
  // 3. Success - keep the update
} catch (error) {
  // 4. Rollback on failure
  setUsers(originalUsers);
  showError(error);
}
```

#### Client-Side Filtering & Sorting
- **Debounced Search** - 300ms delay to reduce API calls
- **Column Sorting** - Click headers to toggle sort direction
- **Pagination Controls** - First, Previous, Next, Last navigation

## 🎨 UI/UX Features

### Visual Feedback
- **Loading Spinners** - During data fetch operations
- **Optimistic Styling** - Faded appearance for pending operations
- **Error Animation** - Shake effect when operations fail
- **Toast Notifications** - Auto-dismissing success/error messages
- **Hover Effects** - Interactive button and row highlighting

### Form Validation
- **Real-time Validation** - Errors clear as user types
- **Email Format Check** - Regex validation for email fields
- **Required Fields** - All fields must be filled
- **Duplicate Email Check** - Server-side uniqueness validation

### Accessibility
- **Keyboard Navigation** - All actions accessible via keyboard
- **Semantic HTML** - Proper use of HTML5 elements
- **Focus States** - Clear visual indicators for focused elements
- **Confirmation Dialogs** - Prevent accidental deletions

## 🧪 Testing the Application

### Test Optimistic UI

1. **Slow Network Simulation**
   - The server has built-in 500ms delays to simulate network latency
   - Watch the UI update immediately, then confirm after server responds

2. **Test Rollback**
   - Try creating a user with a duplicate email
   - UI will show the new user, then remove it when server returns error
   - Toast notification will explain the failure

### Test Pagination

1. Add more than 10 users
2. Use the page controls to navigate
3. Change items per page (5, 10, 15, 20)
4. Observe how data loads on each page change

### Test Sorting

1. Click any column header
2. Notice the sort indicator (↑ or ↓)
3. Click again to reverse sort order
4. Data fetches from server with new sort parameters

### Test Search

1. Type in the search box
2. Results filter after 300ms (debounce)
3. Search works across all fields (name, email, role, department)
4. Clear search to see all users again

## 🔧 Customization

### Change Port
In `server.js`, modify:
```javascript
const PORT = 3001; // Change to your preferred port
```

### Add New Fields
1. Update MySQL schema in `server.js`:
```javascript
phone VARCHAR(20),
address TEXT,
```

2. Update API endpoints to handle new fields

3. Add form inputs in `UserFormModal` component

### Modify Pagination Defaults
In `index.html`, change:
```javascript
const [itemsPerPage, setItemsPerPage] = useState(10); // Change default
```

## 📊 Performance Considerations

- **Database Indexing** - Email field has UNIQUE index for fast lookups
- **Connection Pooling** - Reuses MySQL connections efficiently
- **Debounced Search** - Reduces unnecessary API calls
- **Pagination** - Only loads required data per page
- **Optimistic Updates** - Reduces perceived latency

## 🐛 Troubleshooting

### "Cannot connect to database"
- Ensure MySQL server is running
- Check database credentials in `server.js`
- Verify database exists: `SHOW DATABASES;`

### "Port 3001 already in use"
- Change PORT in `server.js`
- Or kill the process using port 3001

### "CORS error"
- Ensure server is running before opening frontend
- Check CORS middleware is enabled in `server.js`

### Frontend not loading data
- Open browser console (F12) for error messages
- Verify API_URL in `index.html` matches server port
- Check network tab to see if requests are being made

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📧 Support

For issues or questions, please create an issue in the project repository.

---

**Built with ❤️ using React, Express.js, and MySQL**
