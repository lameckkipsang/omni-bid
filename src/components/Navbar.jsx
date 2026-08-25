import { Link } from 'react-router-dom';
import { Gavel, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-200">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-600">
        <Gavel className="w-6 h-6" /> OmniBid
      </Link>
      
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
        <Link to="/" className="hover:text-emerald-600 transition">Categories</Link>
        <Link to="/about" className="hover:text-emerald-600 transition">About Us</Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </Button>
        <Link to="/auth">
          <Button variant="outline" className="border-gray-300 dark:border-gray-700">Log In</Button>
        </Link>
        <Link to="/auth">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Sign Up</Button>
        </Link>
      </div>
    </nav>
  );
}