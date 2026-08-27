import { useState } from 'react';
import { PackagePlus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function ManageAuctions({ auctions, setAuctions }) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('REAL ESTATE');
  const [price, setPrice] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [imgUrl, setImgUrl] = useState('');

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
  );
}