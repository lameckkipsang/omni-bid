import { Link } from 'react-router-dom';
import { Gavel } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground py-12 border-t border-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand & Description */}
        <div className="md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-600 dark:text-emerald-500">
            <Gavel className="w-6 h-6" /> OmniBid
          </Link>
          <p className="text-xs leading-relaxed">
            Kenya's most trusted, secure multi-category auction platform. Redefining modern asset liquidation and bidding integrity.
          </p>
        </div>

        {/* Link Columns */}
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/auctions" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Real Estate
              </Link>
            </li>
            <li>
              <Link to="/auctions" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Vehicles
              </Link>
            </li>
            <li>
              <Link to="/auctions" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Electronics
              </Link>
            </li>
            <li>
              <Link to="/auctions" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Heavy Equipment
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/auctions" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Live Auctions
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Verification
              </Link>
            </li>
            <li>
              <Link to="/home" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Office Locations
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/support" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Bidding Rules
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                Anti-Fraud
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs">
          © 2026 OmniBid Platform Kenya. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
          >
            <FaTwitter className="w-5 h-5" />
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
          >
            <FaFacebook className="w-5 h-5" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}