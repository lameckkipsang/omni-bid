import { Link } from 'react-router-dom';
import { Gavel, ShieldCheck } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row w-full overflow-hidden transition-colors duration-300">
      
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-muted/30 p-12 lg:p-20 border-r border-border">
        <div>
          <Link to="/" className="flex items-center gap-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-500 mb-8">
            <Gavel className="w-8 h-8" /> OmniBid
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Secure. Verified. Transparent.</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Welcome back to Kenya's premier auction platform. Access your personalized bidding dashboard securely.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold">Encrypted Connection</h4>
              <p className="text-sm text-muted-foreground">Your session is secured with bank-grade encryption.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
      </div>
      
    </div>
  );
}