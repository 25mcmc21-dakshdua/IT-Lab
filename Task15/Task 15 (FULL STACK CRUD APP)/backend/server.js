const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());

console.log("Current Directory:", __dirname);
console.log("DB Password from Env:", process.env.DB_PASSWORD);

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'usermanagement',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
}

// Initialize database and create table
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_department (department),
        INDEX idx_created_at (created_at)
      )
    `);
    
    // Check if table is empty and insert sample data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    if (rows[0].count === 0) {
      const sampleUsers = [
        ['John Doe', 'john@example.com', 'Developer', 'Engineering'],
        ['Jane Smith', 'jane@example.com', 'Designer', 'Design'],
        ['Bob Johnson', 'bob@example.com', 'Manager', 'Operations'],
        ['Alice Williams', 'alice@example.com', 'Developer', 'Engineering'],
        ['Charlie Brown', 'charlie@example.com', 'Analyst', 'Analytics'],
        ['Diana Prince', 'diana@example.com', 'HR Manager', 'HR'],
        ['Ethan Hunt', 'ethan@example.com', 'Security', 'Operations'],
        ['Fiona Clark', 'fiona@example.com', 'Developer', 'Engineering'],
        ['George Martin', 'george@example.com', 'Writer', 'Content'],
        ['Hannah Lee', 'hannah@example.com', 'Designer', 'Design'],
        ['Ian Malcolm', 'ian@example.com', 'Scientist', 'Research'],
        ['Julia Roberts', 'julia@example.com', 'Sales', 'Sales'],
        ['Kevin Hart', 'kevin@example.com', 'Marketing', 'Marketing'],
        ['Laura Croft', 'laura@example.com', 'Archaeologist', 'Research'],
        ['Michael Scott', 'michael@example.com', 'Regional Manager', 'Management']
      ];
      
      for (const user of sampleUsers) {
        await connection.query(
          'INSERT INTO users (name, email, role, department) VALUES (?, ?, ?, ?)',
          user
        );
      }
      
      console.log('📊 Sample data initialized with 15 users');
    }
    
    connection.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Start server
async function startServer() {
  // Test database connection first
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.error('❌ Cannot start server without database connection');
    console.log('\n💡 Tips:');
    console.log('   1. Make sure MySQL is running: sudo service mysql start');
    console.log('   2. Check your .env file for correct credentials');
    console.log('   3. Create .env file from .env.example');
    process.exit(1);
  }
  
  // Initialize database
  await initializeDatabase();
  
  // Start server
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log('📡 API endpoints available at:');
    console.log(`   GET    http://localhost:${PORT}/api/users`);
    console.log(`   GET    http://localhost:${PORT}/api/users/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/users`);
    console.log(`   PUT    http://localhost:${PORT}/api/users/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/users/:id`);
    console.log('\n💡 Frontend should be opened from: frontend/index.html\n');
  });
}

// API Routes (add these before startServer)

// GET all users with pagination, sorting, and filtering
app.get('/api/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const sortField = req.query.sortField || 'created_at';
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    // Validate sort field to prevent SQL injection
    const allowedSortFields = ['id', 'name', 'email', 'role', 'department', 'created_at'];
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'created_at';
    
    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const queryParams = [];
    const countParams = [];
    
    // Add search filter
    if (req.query.search) {
      const searchCondition = ' WHERE name LIKE ? OR email LIKE ? OR role LIKE ? OR department LIKE ?';
      const searchValue = `%${req.query.search}%`;
      query += searchCondition;
      countQuery += searchCondition;
      queryParams.push(searchValue, searchValue, searchValue, searchValue);
      countParams.push(searchValue, searchValue, searchValue, searchValue);
    }
    
    // Add sorting
    query += ` ORDER BY ${validSortField} ${sortOrder}`;
    
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    // Execute queries
    const [users] = await pool.query(query, queryParams);
    const [countResult] = await pool.query(countQuery, countParams);
    const totalUsers = countResult[0].total;
    
    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    
    // Validation
    if (!name || !email || !role || !department) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Simulate network delay for testing optimistic updates
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, role, department) VALUES (?, ?, ?, ?)',
      [name, email, role, department]
    );
    
    // Fetch the created user
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    
    res.status(201).json(users[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Check for duplicate email
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    const userId = req.params.id;
    
    // Validation
    if (!name || !email || !role || !department) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Simulate network delay for testing optimistic updates
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update user
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, department = ? WHERE id = ?',
      [name, email, role, department, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Fetch the updated user
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Check for duplicate email
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    // Simulate network delay for testing optimistic updates
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start the server
startServer();