import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ManageAuctions from '../components/admin/ManageAuctions';
import ManageUsers from '../components/admin/ManageUsers';
import PlatformAnalytics from '../components/admin/PlatformAnalytics';

export default function Admin() {
  const [activeTab, setActiveTab] = useState("auctions");
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Security State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // 1. The Bouncer: Check Firebase Auth Status AND Firestore Role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Look up this user in the Firestore database by their email
          const q = query(collection(db, "users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          
          let isAdmin = false;
          querySnapshot.forEach((doc) => {
            if (doc.data().role === "admin") {
              isAdmin = true;
            }
          });

          if (isAdmin) {
            setIsAuthorized(true);
            setIsCheckingAuth(false);
          } else {
            toast.error("Unauthorized access. Admin privileges required.");
            navigate('/login');
          }
        } catch (error) {
          console.error("Error verifying admin role:", error);
          navigate('/login');
        }
      } else {
        navigate('/login'); // Not logged in at all
      }
    });

    return () => unsubscribe(); 
  }, [navigate]);

  // 2. Fetch Data (Only runs if the bouncer lets them in)
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchData = async () => {
      try {
        const auctionsSnapshot = await getDocs(collection(db, "auctions"));
        setAuctions(auctionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching admin data:", err);
        toast.error("Failed to fetch database records.");
      }
    };
    fetchData();
  }, [isAuthorized]);

  // Show a loading spinner while checking credentials
  if (isCheckingAuth) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-muted-foreground font-medium">Verifying database security credentials...</p>
      </div>
    );
  }

  // If authorized, render the dashboard
  return (
    <div className="w-full min-h-screen bg-background p-6 md:p-10">
      <div className="container mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage platform users, monitor live bids, and publish new auction assets.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-600 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4" /> Admin Access Verified
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col w-full space-y-6">
          <TabsList className="inline-flex h-auto flex-wrap items-center justify-start rounded-xl bg-muted p-1 text-muted-foreground w-full sm:w-max border border-border">
            <TabsTrigger value="auctions" className="px-6 py-2.5">Manage Auctions</TabsTrigger>
            <TabsTrigger value="users" className="px-6 py-2.5">Manage Users</TabsTrigger>
            <TabsTrigger value="analytics" className="px-6 py-2.5">Platform Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="auctions" className="w-full outline-none focus:outline-none">
            <ManageAuctions auctions={auctions} setAuctions={setAuctions} />
          </TabsContent>
          
          <TabsContent value="users" className="w-full outline-none focus:outline-none">
            <ManageUsers users={users} setUsers={setUsers} />
          </TabsContent>
          
          <TabsContent value="analytics" className="w-full outline-none focus:outline-none">
            <PlatformAnalytics users={users} auctions={auctions} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}