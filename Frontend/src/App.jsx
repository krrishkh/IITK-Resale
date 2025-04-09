import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/Homepage/homepage'
import RegisterPage from './components/Register/register';
import LoginPage from './components/Login/login';
import UserDashboard from './components/UserDashboard/dashboard';
import AllProducts from './components/AllItems/allItems';
import ProductDetails from './components/ProductDetails/productDetails';
import AddItem from './components/UserDashboard/addItem';
import MeetTheDevelopers from './components/MeetDevelopers/meetDevelopers';


const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/meet-developers', element: <MeetTheDevelopers /> },
  { path: '/login', element: <LoginPage />},
  { path: '/register', element: <RegisterPage /> }, 
  { path: '/user', element: <UserDashboard/>},
  { path: '/add-item', element: <AddItem/>},
  { path: '/all-items', element: <AllProducts/>},
  { path: '/product/:id', element: <ProductDetails /> }
  // ... other routes (browse, sell, item details, etc.)
]);

function App() {
  

  return <RouterProvider router={router} />;
}

export default App
