import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gavel, ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/auctions'); // Redirect to auctions on success
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/auctions'); // Redirect to auctions on success
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row w-full overflow-hidden transition-colors duration-300">
      
      {/* Branding */}
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

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          
          <div className="md:hidden flex justify-center mb-8">
             <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-emerald-600">
              <Gavel className="w-6 h-6" /> OmniBid
            </Link>
          </div>

          <Card className="border-border shadow-lg pt-6">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
              
              {/* Google Sign-In Button */}
              <div className="flex flex-col gap-4 mb-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full bg-background border-border h-11" 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
              </div>

              {/* Error Message Display */}
              {error && <p className="text-sm text-red-500 mb-4 font-medium">{error}</p>}

              {/* Email Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="you@example.com" 
                      className="pl-10 bg-background" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
                    <Link to="#" className="text-xs text-emerald-600 hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 bg-background" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account? <Link to="/register" className="text-emerald-600 font-semibold hover:underline">Sign up</Link>
              </p>
            </CardFooter>
          </Card>
          
        </div>
      </div>
    </div>
  );
}