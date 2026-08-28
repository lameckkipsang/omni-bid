import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gavel, ShieldCheck, Lock, Mail, ArrowRight, Loader2, User, Fingerprint } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Enforce National ID requirement by saving it directly to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email: user.email,
        nationalId,
        role: "bidder", 
        createdAt: serverTimestamp()
      });

      toast.success("Account created successfully! Welcome to OmniBid.");
      navigate('/auctions'); 
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row w-full overflow-hidden transition-colors duration-300">
      
      {/* Branding Side */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-muted/30 p-12 lg:p-20 border-r border-border">
        <div>
          <Link to="/" className="flex items-center gap-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-500 mb-8">
            <Gavel className="w-8 h-8" /> OmniBid
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Join the Bidding Floor.</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Create an account to participate in Kenya's premier auction platform. Strict verification ensures a safe bidding environment for everyone.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold">Identity Verification</h4>
              <p className="text-sm text-muted-foreground">National ID tracking eliminates fraud and fake bidders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          
          <div className="md:hidden flex justify-center mb-8">
             <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-emerald-600">
              <Gavel className="w-6 h-6" /> OmniBid
            </Link>
          </div>

          <Card className="border-border shadow-lg pt-6">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>Enter your details to register for the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      className="pl-10 bg-background" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required 
                    />
                  </div>
                </div>

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
                  <label className="text-xs font-bold text-muted-foreground uppercase">National ID</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="e.g. 12345678" 
                      className="pl-10 bg-background" 
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 bg-background" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="flex items-center">Sign Up <ArrowRight className="w-4 h-4 ml-2" /></span>}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account? <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Log in</Link>
              </p>
            </CardFooter>
          </Card>
          
        </div>
      </div>
    </div>
  );
}