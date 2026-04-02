# User Management Frontend (React)

Professional React application with proper component structure, custom hooks, and optimistic UI updates.

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Toast.js            # Toast notification component
│   │   ├── Toast.css
│   │   ├── UserFormModal.js    # Add/Edit user modal
│   │   ├── UserFormModal.css
│   │   ├── UserList.js         # Users table component
│   │   ├── UserList.css
│   │   ├── Pagination.js       # Pagination controls
│   │   ├── Pagination.css
│   │   ├── SearchBar.js        # Search and filters
│   │   └── SearchBar.css
│   ├── services/
│   │   └── api.js              # Axios API service layer
│   ├── hooks/
│   │   └── useUsers.js         # Custom hook for user management
│   ├── App.js                  # Main App component
│   ├── App.css
│   ├── index.js                # Entry point
│   └── index.css
└── package.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- `react` & `react-dom` - React library
- `axios` - HTTP client for AJAX calls
- `react-scripts` - Create React App build tools

### 2. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000` and automatically proxy API requests to `http://localhost:3001`.

### 3. Build for Production

```bash
npm run build
```

Creates optimized production build in the `build/` folder.

## 🎯 Features

### Component Architecture
- **Modular Components** - Each component in its own file with CSS
- **Custom Hooks** - `useUsers` hook manages all user state and operations
- **Service Layer** - Centralized API calls using Axios
- **Separation of Concerns** - Logic, UI, and styles properly separated

### AJAX Implementation
All API calls use Axios with:
- Automatic request/response interceptors
- Centralized error handling
- Promise-based async/await syntax
- Query parameter handling

### Optimistic UI Updates
- **Immediate Feedback** - UI updates before server confirms
- **Automatic Rollback** - Reverts on server errors
- **Visual Indicators** - Shows pending operations
- **Error Recovery** - Graceful error handling with notifications

### State Management
- **Custom Hook Pattern** - `useUsers` hook encapsulates all state
- **React Hooks** - useState, useEffect, useCallback
- **Derived State** - Computed values from base state
- **Controlled Components** - All forms are controlled

## 📦 Component Details

### App.js (Main Component)
The main application container that:
- Uses the `useUsers` custom hook
- Manages modal and toast state
- Handles user interactions
- Renders all child components

### useUsers Hook (Custom Hook)
Manages all user-related state and operations:
- Fetching users with pagination/sorting/filtering
- Creating users with optimistic updates
- Updating users with rollback on error
- Deleting users with confirmation
- Tracking optimistic operations

### UserList Component
Displays users in a sortable table:
- Click headers to sort
- Visual indicators for sort direction
- Color-coded department badges
- Edit/Delete actions per row
- Optimistic styling for pending operations

### UserFormModal Component
Modal for adding/editing users:
- Form validation (client-side)
- Error display
- Loading states
- Controlled inputs
- Department dropdown

### SearchBar Component
Search and pagination controls:
- Real-time search (with debouncing via hook)
- Items per page selector
- Responsive layout

### Pagination Component
Navigation controls:
- First/Previous/Next/Last buttons
- Current page indicator
- Total count display
- Disabled state handling

### Toast Component
Notification system:
- Auto-dismiss after 3 seconds
- Success/Error variants
- Slide-in animation
- Non-blocking overlay

## 🔌 API Service (services/api.js)

Centralized API layer using Axios:

```javascript
import { userApi } from './services/api';

// Get all users
const response = await userApi.getUsers({ page: 1, limit: 10 });

// Get single user
const user = await userApi.getUser(userId);

// Create user
const newUser = await userApi.createUser(userData);

// Update user
const updated = await userApi.updateUser(userId, userData);

// Delete user
await userApi.deleteUser(userId);
```

## 🎨 Styling Approach

- **Component-Level CSS** - Each component has its own CSS file
- **BEM-like Naming** - Clear, descriptive class names
- **Responsive Design** - Mobile-first approach
- **CSS Variables** - Consistent colors and spacing
- **Animations** - Smooth transitions and loading states

## 🔧 Configuration

### Proxy Setup
The `package.json` includes a proxy configuration:
```json
"proxy": "http://localhost:3001"
```

This allows you to make API calls to `/api/users` instead of `http://localhost:3001/api/users` during development.

### Environment Variables
Create a `.env` file for custom configuration:
```
REACT_APP_API_URL=http://localhost:3001/api
```

Then use in your code:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

## 🧪 Development Tips

### Hot Module Replacement
Changes to React components will automatically reload in the browser without losing state.

### Browser DevTools
- React Developer Tools extension recommended
- Network tab shows all AJAX requests
- Console shows any errors or warnings

### Code Organization
- Keep components small and focused
- Use custom hooks for shared logic
- Separate concerns (logic, UI, styles)
- Name files clearly and consistently

## 🏗️ Building for Production

### Create Production Build
```bash
npm run build
```

This creates a `build/` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps

### Serve Production Build Locally
```bash
npx serve -s build
```

### Deploy to Hosting
The `build/` folder can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

## 📝 Code Examples

### Using the Custom Hook
```javascript
import { useUsers } from './hooks/useUsers';

function MyComponent() {
  const {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  const handleCreate = async (userData) => {
    const result = await createUser(userData);
    if (result.success) {
      console.log('User created!');
    }
  };

  return <div>{/* Your UI */}</div>;
}
```

### Making API Calls
```javascript
import { userApi } from './services/api';

// With async/await
try {
  const response = await userApi.getUsers({ page: 1 });
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data?.error);
}

// With promises
userApi.getUsers({ page: 1 })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### API calls failing
- Ensure backend server is running on port 3001
- Check proxy configuration in package.json
- Look for CORS errors in browser console

### Components not updating
- Check React DevTools for state changes
- Verify useEffect dependencies
- Look for console errors

### Build fails
```bash
npm run build
```
Check the error message and ensure all imports are correct.

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Axios Documentation](https://axios-http.com/)
- [Create React App](https://create-react-app.dev/)
- [React Hooks](https://react.dev/reference/react)

## 🤝 Contributing

1. Create feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

---

**Built with ❤️ using React 18 and modern best practices**