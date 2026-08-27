import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ManageAuctions from '../components/admin/ManageAuctions';
import ManageUsers from '../components/admin/ManageUsers';
import PlatformAnalytics from '../components/admin/PlatformAnalytics';

export default function Admin() {
  const [activeTab, setActiveTab] = useState("auctions");
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auctionsSnapshot = await getDocs(collection(db, "auctions"));
        setAuctions(auctionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchData();
  }, []);

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