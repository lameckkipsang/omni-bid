import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ManageAuctions from '../components/admin/ManageAuctions';
import ManageUsers from '../components/admin/ManageUsers';
import PlatformAnalytics from '../components/admin/PlatformAnalytics';
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("auctions");
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  const [supportMessages, setSupportMessages] = useState([]);
  
  // Security State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // The Bouncer: Check Firebase Auth Status AND Firestore Role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
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
        navigate('/login');
      }
    });

    return () => unsubscribe(); 
  }, [navigate]);

  // Fetch Data (Auctions, Users, and Support Messages)
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchData = async () => {
      try {
        const auctionsSnapshot = await getDocs(collection(db, "auctions"));
        setAuctions(auctionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const supportSnapshot = await getDocs(collection(db, "support_messages"));
        setSupportMessages(supportSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching admin data:", err);
        toast.error("Failed to fetch database records.");
      }
    };
    fetchData();
  }, [isAuthorized]);

  // Handler to mark support message as resolved/read
  const handleResolveMessage = async (id) => {
    try {
      await updateDoc(doc(db, "support_messages", id), { status: "resolved" });
      setSupportMessages(supportMessages.map(msg => msg.id === id ? { ...msg, status: "resolved" } : msg));
      toast.success("Support ticket marked as resolved.");
    } catch (err) {
      console.error("Error updating support ticket:", err);
      toast.error("Failed to update status.");
    }
  };

  // Handler to delete support message
  const handleDeleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "support_messages", id));
      setSupportMessages(supportMessages.filter(msg => msg.id !== id));
      toast.success("Support ticket deleted.");
    } catch (err) {
      console.error("Error deleting support ticket:", err);
      toast.error("Failed to delete ticket.");
    }
  };

  // Show a loading spinner while checking credentials
  if (isCheckingAuth) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-muted-foreground font-medium">Verifying database security credentials...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background p-6 md:p-10">
      <div className="container mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage platform users, monitor live bids, and review support inquiries.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-600 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4" /> Admin Access Verified
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col w-full space-y-6">
          <TabsList className="inline-flex h-auto flex-wrap items-center justify-start rounded-xl bg-muted p-1 text-muted-foreground w-full sm:w-max border border-border">
            <TabsTrigger value="auctions" className="px-6 py-2.5">Manage Auctions</TabsTrigger>
            <TabsTrigger value="users" className="px-6 py-2.5">Manage Users</TabsTrigger>
            <TabsTrigger value="support" className="px-6 py-2.5">
              Support Inquiries {supportMessages.filter(m => m.status === 'unread' || !m.status).length > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {supportMessages.filter(m => m.status === 'unread' || !m.status).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="px-6 py-2.5">Platform Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="auctions" className="w-full outline-none focus:outline-none">
            <ManageAuctions auctions={auctions} setAuctions={setAuctions} />
          </TabsContent>
          
          <TabsContent value="users" className="w-full outline-none focus:outline-none">
            <ManageUsers users={users} setUsers={setUsers} />
          </TabsContent>

          <TabsContent value="support" className="w-full outline-none focus:outline-none space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Customer Support Inquiries</h2>
              {supportMessages.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">No support messages found.</p>
              ) : (
                <div className="space-y-4">
                  {supportMessages.map((msg) => (
                    <div key={msg.id} className="border border-border p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-base">{msg.fullName}</span>
                          <span className="text-xs text-muted-foreground">({msg.email})</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${msg.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                            {msg.status || 'unread'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Topic: {msg.subject}</p>
                        <p className="text-sm text-foreground mt-2 bg-muted/50 p-3 rounded-lg border border-border/50">{msg.message}</p>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-center">
                        {msg.status !== 'resolved' && (
                          <Button size="sm" variant="outline" onClick={() => handleResolveMessage(msg.id)} className="text-emerald-600 border-emerald-600/30 hover:bg-emerald-50">
                            Mark Resolved
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteMessage(msg.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="w-full outline-none focus:outline-none">
            <PlatformAnalytics users={users} auctions={auctions} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}