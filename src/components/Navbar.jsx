import { Link } from 'react-router-dom';
import { Gavel, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-300">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-600 dark:text-emerald-500">
        <Gavel className="w-6 h-6" /> OmniBid
      </Link>
      
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Categories</Link>
        <Link to="/auctions" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Live Bidding</Link>
        <Link to="/about" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">About Us</Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
        </Button>
        
        <Link to="/login">
          <Button variant="outline" className="border-border">Log In</Button>
        </Link>
        <Link to="/register">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Sign Up</Button>
        </Link>
      </div>
    </nav>
  );
}