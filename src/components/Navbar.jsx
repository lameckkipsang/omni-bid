import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gavel, Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for login/logout events
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // If logged in, check if they are an admin
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Gavel className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-xl tracking-tight">OmniBid</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/auctions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Live Auctions</Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Conditional Rendering based on Auth State */}
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Button>
                </Link>
              )}
              <Button onClick={handleLogout} variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-2">
                <LogOut className="w-4 h-4" /> Log Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}