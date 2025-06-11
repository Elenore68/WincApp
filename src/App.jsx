import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import Main from './pages/Main'; // Import Main page
import MainCategory from './pages/MainCategory'; // Import MainCategory page
import OverviewPage from './pages/OverviewPage';
import CheckoutPage from './pages/CheckoutPage'; // Import CheckoutPage
import ProfilePage from './pages/ProfilePage';
import MyCardsPage from './pages/MyCardsPage';
import AccountInfoPage from './pages/AccountInfoPage';
import HelpPage from './pages/HelpPage';
import './Auth.css'; // Import the shared authentication and app styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} /> {/* Default route changed to Main page */}
        <Route path="/category/:categoryName" element={<MainCategory />} /> {/* Route for category filtered templates */}
        <Route path="/overview/:cardId" element={<OverviewPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/checkout" element={<CheckoutPage />} /> {/* Checkout route */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-cards" element={<MyCardsPage />} />
        <Route path="/account-info" element={<AccountInfoPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
