import { useState, useEffect } from 'react';
import { ShieldAlert, PackagePlus, Trash2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('REAL ESTATE');
  const [price, setPrice] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionsSnapshot = await getDocs(collection(db, "auctions"));
        setAuctions(auctionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching auctions:", err);
      }
    };
    fetchAuctions();
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="auctions">Manage Auctions</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="analytics">Platform Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="auctions">
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
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
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
          
          <TabsContent value="users"></TabsContent>
          
          <TabsContent value="analytics"></TabsContent>
        </Tabs>

      </div>
    </div>
  );
}