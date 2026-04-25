# Task 18: RESTful Product API with Node.js and MySQL

This project is a robust RESTful API built for managing a product inventory. It features secure user authentication and full CRUD (Create, Read, Update, Delete) capabilities.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
- **Password Security**: Passwords are hashed using `bcryptjs` before being stored in the database.
- **Product Management**: Full CRUD operations for products.
- **Protected Routes**: Sensitive operations (Create, Update, Delete) require a valid JWT token.
- **Database ORM**: Uses **Sequelize** for interactively managing the MySQL database.
- **CORS Enabled**: Cross-Origin Resource Sharing is configured to allow frontend integration.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Security**: JSON Web Token (JWT), Bcrypt.js
- **Environment Management**: Dotenv

---

## 📁 Project Structure

```text
d:\AG IT\
├── src\
│   ├── config\
│   │   └── db.js          # MySQL connection & Sequelize setup
│   ├── controllers\
│   │   ├── authController.js    # Logic for Login & Register
│   │   └── productController.js # Logic for Product CRUD
│   ├── middleware\
│   │   └── auth.js        # JWT verification middleware
│   ├── models\
│   │   ├── User.js        # User schema (username, email, password)
│   │   └── Product.js     # Product schema (name, desc, price, category)
│   ├── routes\
│   │   ├── authRoutes.js  # Auth endpoints
│   │   └── productRoutes.js # Product endpoints
│   ├── app.js             # Express app configuration
│   └── server.js          # Entry point (Server start)
├── .env                   # Environment variables
├── package.json           # Dependencies & scripts
└── Product_API.postman_collection.json # Testing collection
```

---

## 🔑 Implementation Details

### 1. Database Connection
Located in `src/config/db.js`, it uses Sequelize to connect to MySQL. The connection details are pulled from the `.env` file for security.

### 2. User Authentication
- **Registration**: Hashes the user's password using `bcryptjs` before saving.
- **Login**: Verifies the password and returns a JWT token signed with a secret key.
- **Middleware**: The `protect` middleware in `src/middleware/auth.js` intercepts requests to protected routes, verifies the token, and attaches the user object to the request.

### 3. Product CRUD Logic
- **Create**: (Protected) Validates input and creates a new product record.
- **Read**: (Public) Fetches all products or a single product by ID.
- **Update**: (Protected) Finds the product by ID and updates specific fields.
- **Delete**: (Protected) Removes the product record from the database.

---

## 🚦 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |

### Products
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| POST | `/api/products` | Create a product | **Private** |
| PUT | `/api/products/:id` | Update a product | **Private** |
| DELETE | `/api/products/:id` | Delete a product | **Private** |

---

## ⚙️ Setup & Running

1. **Configure `.env`**:
   Ensure your MySQL credentials are correct in the `.env` file.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the API**:
   ```bash
   npm start
   ```

---

## 🧪 Testing
Use the provided `Product_API.postman_collection.json` to test the API. Remember to copy the token from the login response and paste it into the **Authorization** tab (Bearer Token) for the protected requests.
