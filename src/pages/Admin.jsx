import { useState, useEffect } from 'react';
import { ShieldAlert, PackagePlus, Trash2, Users, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function Admin() {
  const [activeTab, setActiveTab] = useState("auctions");
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('REAL ESTATE');
  const [price, setPrice] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Auctions
        const auctionsSnapshot = await getDocs(collection(db, "auctions"));
        setAuctions(auctionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        // Fetch Users
        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchData();
  }, []);

  const handleAddAuction = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const durationInMilliseconds = parseInt(durationHours) * 60 * 60 * 1000;
      const expiresAt = Date.now() + durationInMilliseconds;

      const newAuctionData = {
        title,
        category,
        price: `${parseInt(price).toLocaleString()} KES`,
        numericPrice: parseInt(price),
        expiresAt,
        img: imgUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "auctions"), newAuctionData);
      
      setAuctions([...auctions, { id: docRef.id, ...newAuctionData }]);
      toast.success("Auction item published successfully!");
      
      setTitle('');
      setPrice('');
      setDurationHours('');
      setImgUrl('');
    } catch (err) {
      toast.error("Failed to publish item.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    try {
      await deleteDoc(doc(db, "auctions", auctionId));
      setAuctions(auctions.filter(a => a.id !== auctionId));
      toast.success("Auction deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete auction.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user from the database?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter(u => u.id !== userId));
        toast.success("User deleted successfully.");
      } catch (err) {
        toast.error("Failed to delete user.");
      }
    }
  };

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <Card className="border-border shadow-sm lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <PackagePlus className="w-5 h-5 text-emerald-600" /> Add Auction Item
                  </CardTitle>
                  <CardDescription>Publish a new asset to the live bidding floor.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddAuction} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Item Title</label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Prime Nakuru Farm" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
                      <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none"
                      >
                        <option value="REAL ESTATE">REAL ESTATE</option>
                        <option value="VEHICLES">VEHICLES</option>
                        <option value="ELECTRONICS">ELECTRONICS</option>
                        <option value="HEAVY EQUIP">HEAVY EQUIP</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Initial Value (KES)</label>
                      <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 3500000" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Duration (Hours)</label>
                      <Input type="number" value={durationHours} onChange={(e) => setDurationHours(e.target.value)} placeholder="e.g. 48" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Image URL</label>
                      <Input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://unsplash.com/..." />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2" disabled={isLoading}>
                      {isLoading ? "Publishing..." : "Publish Listing"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Active & Archived Listings</CardTitle>
                  <CardDescription>Live database records currently synced with Firestore.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                    {auctions.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-10">No auction listings found in Firestore.</p>
                    )}
                    {auctions.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl">
                        <div className="flex items-center gap-4">
                          <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded-lg border border-border" />
                          <div>
                            <h4 className="font-bold text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.category} • <span className="text-emerald-600 font-bold">{item.price}</span></p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteAuction(item.id)} className="text-red-500 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
          
          <TabsContent value="users" className="w-full outline-none focus:outline-none">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" /> Registered Platform Users
                </CardTitle>
                <CardDescription>View or remove user accounts registered in your Firestore database.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
                        <th className="p-4">Full Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">National ID</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-6 text-center text-muted-foreground">No users found in database.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-muted/20">
                            <td className="p-4 font-semibold">{u.fullName || "N/A"}</td>
                            <td className="p-4 text-muted-foreground">{u.email}</td>
                            <td className="p-4">{u.nationalId || "Pending"}</td>
                            <td className="p-4">
                              <span className="bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">
                                {u.role || "Bidder"}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="w-full outline-none focus:outline-none">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" /> Platform Statistics
                </CardTitle>
                <CardDescription>Real-time overview of database metrics.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-muted/30 border border-border rounded-xl">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Total Users</p>
                    <p className="text-3xl font-extrabold text-emerald-600 mt-2">{users.length}</p>
                  </div>
                  <div className="p-6 bg-muted/30 border border-border rounded-xl">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Active Listings</p>
                    <p className="text-3xl font-extrabold text-emerald-600 mt-2">{auctions.length}</p>
                  </div>
                  <div className="p-6 bg-muted/30 border border-border rounded-xl">
                    <p className="text-xs font-bold text-muted-foreground uppercase">System Status</p>
                    <p className="text-3xl font-extrabold text-emerald-600 mt-2">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}