import { useState } from 'react';
import { Clock, Gavel } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function LiveBidding() {
  // State for tracking user bid input on the featured live item
  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(2450000);
  const [bidHistory, setBidHistory] = useState([
    { bidder: "ID No. ***892", amount: "2,450,000 KES", time: "2 mins ago" },
    { bidder: "ID No. ***411", amount: "2,400,000 KES", time: "14 mins ago" },
    { bidder: "ID No. ***655", amount: "2,300,000 KES", time: "1 hour ago" }
  ]);

  const handlePlaceBid = (e) => {
    e.preventDefault();
    const numericBid = parseInt(bidAmount);
    if (!numericBid || numericBid <= currentBid) {
      alert("Please enter a bid higher than the current active amount.");
      return;
    }

    setCurrentBid(numericBid);
    setBidHistory([
      { bidder: "You (Verified ID)", amount: `${numericBid.toLocaleString()} KES`, time: "Just now" },
      ...bidHistory
    ]);
    setBidAmount('');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-500/10 mb-2">
            ACTIVE BIDDING ENGINE
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">Live Auctions Room</h1>
          <p className="text-muted-foreground mt-1">Real-time asset price discovery secured by national ID verification.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold">Server Connected</span>
        </div>
      </div>

      {/* FEATURED LIVE ITEM & BIDDING INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-card border border-border rounded-2xl p-6 shadow-sm">
        
        {/* Item Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-72 md:h-96 rounded-xl overflow-hidden border border-border">
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" alt="Kajiado Land" className="w-full h-full object-cover" />
            <Badge className="absolute top-4 left-4 bg-emerald-600 text-white font-bold px-3 py-1">
              FEATURED ITEM #1
            </Badge>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Premium Kajiado Land — 5 Acres</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Optimized for immediate commercial or residential development. Clean title deed ready for transfer upon auction closure.
            </p>
          </div>
        </div>

        {/* Live Bidding Console */}
        <div className="bg-muted/30 border border-border rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Highest Bid</span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                <Clock className="w-3.5 h-3.5" /> 02h 15m left
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {currentBid.toLocaleString()} KES
            </p>

            <form onSubmit={handlePlaceBid} className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-muted-foreground">
                Place Your Bid (Min: {(currentBid + 50000).toLocaleString()} KES)
              </label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Enter amount..." 
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="bg-background"
                />
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                  <Gavel className="w-4 h-4" /> Bid
                </Button>
              </div>
            </form>
          </div>

          {/* Live Bid Stream */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Bid Activity</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {bidHistory.map((bid, index) => (
                <div key={index} className="flex justify-between items-center text-xs bg-background p-2.5 rounded-lg border border-border">
                  <span className="font-semibold">{bid.bidder}</span>
                  <span className="text-emerald-600 font-bold">{bid.amount}</span>
                  <span className="text-muted-foreground">{bid.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}