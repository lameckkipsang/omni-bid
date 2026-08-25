import { useState } from 'react';
import { Clock, Gavel } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function LiveBidding() {
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

  const allAuctions = [
    { id: 1, title: "Premium Kajiado Land — 5 Acres", category: "REAL ESTATE", price: "2,450,000 KES", time: "02h 15m", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Toyota Land Cruiser VX 2019", category: "VEHICLES", price: "4,750,000 KES", time: "05h 24m", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Samsung Galaxy S24 Ultra", category: "ELECTRONICS", price: "115,000 KES", time: "01d 12h", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Mombasa 2-Br Nyali Apt", category: "REAL ESTATE", price: "8,500,000 KES", time: "04d 10h", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Massey Ferguson 375 Tractor", category: "HEAVY EQUIP", price: "1,600,000 KES", time: "12h 45m", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Changed to container mx-auto for strict max-width enforcement */}
      <div className="container mx-auto px-4 md:px-6 py-10 flex flex-col gap-10 overflow-hidden">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6 w-full">
          <div className="flex-1">
            <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-500/10 mb-2">
              ACTIVE BIDDING ENGINE
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight">Live Auctions Room</h1>
            <p className="text-muted-foreground mt-1">Real-time asset price discovery secured by national ID verification.</p>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-semibold">Server Connected</span>
          </div>
        </div>

        {/* FEATURED LIVE ITEM & BIDDING INTERFACE - Switched to strict Flexbox */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-8 w-full">
          
          {/* Item Preview (Takes up 2/3 width) */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-4">
            <div className="relative w-full h-72 md:h-80 rounded-xl overflow-hidden border border-border">
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" alt="Kajiado Land" className="w-full h-full object-cover" />
              <Badge className="absolute top-4 left-4 bg-emerald-600 text-white font-bold px-3 py-1">
                FEATURED ITEM #1
              </Badge>
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold">Premium Kajiado Land — 5 Acres</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Optimized for immediate commercial or residential development. Clean title deed ready for transfer upon auction closure.
              </p>
            </div>
          </div>

          {/* Live Bidding Console (Takes up 1/3 width) */}
          <div className="w-full lg:w-1/3 flex-shrink-0 bg-muted/30 border border-border rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Highest Bid</span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                  <Clock className="w-3.5 h-3.5" /> 02h 15m left
                </div>
              </div>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {currentBid.toLocaleString()} KES
              </p>

              <form onSubmit={handlePlaceBid} className="space-y-3 pt-2 w-full">
                <label className="text-xs font-semibold text-muted-foreground">
                  Place Your Bid (Min: {(currentBid + 50000).toLocaleString()} KES)
                </label>
                <div className="flex gap-2 w-full">
                  <Input 
                    type="number" 
                    placeholder="Enter amount..." 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="bg-background flex-1"
                  />
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 flex-shrink-0">
                    <Gavel className="w-4 h-4" /> Bid
                  </Button>
                </div>
              </form>
            </div>

            {/* Live Bid Stream */}
            <div className="space-y-3 pt-4 border-t border-border w-full">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Bid Activity</h4>
              <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1 w-full">
                {bidHistory.map((bid, bidIndex) => (
                  <div key={bidIndex} className="flex justify-between items-center text-xs bg-background p-3 rounded-lg border border-border w-full">
                    <span className="font-semibold">{bid.bidder}</span>
                    <span className="text-emerald-600 font-bold">{bid.amount}</span>
                    <span className="text-muted-foreground">{bid.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* CATEGORY TABS & AUCTION GRID */}
        <div className="w-full pt-4">
          <Tabs defaultValue="all" className="w-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
              <h3 className="text-xl font-bold">Explore All Live Auctions</h3>
              <TabsList className="bg-muted flex-wrap">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="real estate">Real Estate</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="electronics">Electronics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="w-full outline-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {allAuctions.map((auction, auctionIndex) => (
                  <Card key={auctionIndex} className="overflow-hidden flex flex-col w-full hover:shadow-lg transition-shadow">
                    <div className="relative w-full h-48 overflow-hidden bg-muted">
                      <img src={auction.img} alt={auction.title} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardHeader className="p-5 pb-2">
                      <Badge variant="secondary" className="w-fit text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-2 tracking-wider">
                        {auction.category}
                      </Badge>
                      <CardTitle className="text-base line-clamp-1">{auction.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex-1">
                      <p className="text-xl font-bold text-emerald-600">{auction.price}</p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 flex justify-between items-center bg-muted/20 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-3">
                        <Clock className="w-4 h-4 text-amber-500" /> {auction.time} left
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 mt-3 text-white">Bid Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  );
}