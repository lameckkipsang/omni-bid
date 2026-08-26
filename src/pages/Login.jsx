import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="you@example.com" className="pl-10 bg-background" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
                    <Link to="#" className="text-xs text-emerald-600 hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pl-10 bg-background" required />
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