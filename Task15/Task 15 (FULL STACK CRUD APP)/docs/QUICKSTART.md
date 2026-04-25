# 🚀 Quick Start Guide

Get the User Management System running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (check: `node --version`)
- ✅ MySQL installed and running (check: `mysql --version`)
- ✅ npm installed (check: `npm --version`)

## Setup Steps

### Step 1: Install Dependencies (1 minute)
```bash
npm install
```

This installs:
- express (web server)
- cors (cross-origin requests)
- mysql2 (MySQL driver)

### Step 2: Setup MySQL Database (1 minute)

#### Option A: Automatic (Recommended)
Just start the server - it will create everything automatically!
```bash
npm start
```

#### Option B: Manual
```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
source setup.sql

# Exit
exit
```

### Step 3: Configure Database (30 seconds)

If your MySQL setup is different from defaults:

1. Copy `.env.example` to `.env`
2. Update credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=usermanagement
```

### Step 4: Start the Server (10 seconds)
```bash
npm start
```

You should see:
```
Connected to MySQL
Database initialized successfully
Sample data initialized
Server running on http://localhost:3001
```

### Step 5: Open the Frontend (10 seconds)

**Option A:** Double-click `index.html`

**Option B:** From terminal:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

## 🎉 That's It!

You should now see the User Management System with 15 sample users!

## What to Try First

1. **Search** - Type "developer" in the search box
2. **Sort** - Click on column headers to sort
3. **Add User** - Click "Add User" button
4. **Edit** - Click "Edit" on any user
5. **Delete** - Click "Delete" and confirm
6. **Paginate** - Navigate between pages
7. **Change Page Size** - Select different items per page

## Verify It's Working

### Test the API
```bash
# Should return list of users
curl http://localhost:3001/api/users
```

### Check the Database
```bash
mysql -u root -p usermanagement -e "SELECT COUNT(*) FROM users;"
```

## Common Issues & Solutions

### Issue 1: "Cannot connect to MySQL"
```bash
# Check if MySQL is running
sudo service mysql status

# Start MySQL if needed
sudo service mysql start
```

### Issue 2: "Port 3001 already in use"
```bash
# Find what's using the port
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change the port in server.js
```

### Issue 3: "Database doesn't exist"
```bash
# Create it manually
mysql -u root -p -e "CREATE DATABASE usermanagement;"
```

### Issue 4: "Access denied for user 'root'"
Update your password in server.js or .env file:
```javascript
password: 'your_actual_password'
```

### Issue 5: Frontend shows empty/no data
- Check browser console (F12) for errors
- Verify server is running: `http://localhost:3001/api/users`
- Check if CORS is enabled in server.js

## Next Steps

### Customize Your App
1. **Add Fields** - Edit the schema in server.js and forms in index.html
2. **Change Styles** - Modify CSS in index.html
3. **Add Features** - Export to CSV, bulk operations, etc.

### Deploy Your App
1. **Backend** - Deploy to Heroku, Railway, or DigitalOcean
2. **Database** - Use MySQL on AWS RDS, Google Cloud SQL, or PlanetScale
3. **Frontend** - Host on Netlify, Vercel, or GitHub Pages

### Learn More
- Read `README.md` for detailed documentation
- Check `API_TESTING.md` for API testing examples
- View `setup.sql` for database schema details

## Need Help?

### View Logs
Server logs appear in the terminal where you ran `npm start`

### Test the API
Use the examples in `API_TESTING.md`

### Database Issues
```bash
# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check table structure
mysql -u root -p usermanagement -e "DESCRIBE users;"

# View data
mysql -u root -p usermanagement -e "SELECT * FROM users LIMIT 5;"
```

## Stopping the Application

### Stop the Server
Press `Ctrl + C` in the terminal

### Stop MySQL (if needed)
```bash
sudo service mysql stop
```

---

**You're all set! 🎊 Enjoy building with your CRUD application!**
