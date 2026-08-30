import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LiveBidding from './pages/LiveBidding';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Payment from './pages/Payment';
import AuctionDetails from './pages/AuctionDetails';
import Support from './pages/Support';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden transition-colors duration-300">
        <Toaster richColors position="top-right" />
        
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auctions" element={<LiveBidding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/auction/:id" element={<AuctionDetails />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}