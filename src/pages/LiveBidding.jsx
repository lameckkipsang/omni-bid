import { useState, useEffect } from 'react';
import { Clock, Gavel, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { auth } from '../lib/firebase';

// Helper component for individual cards so each has its own independent live countdown
function AuctionCard({ auction, onBidClick }) {
  const [timeLeft, setTimeLeft] = useState(auction.initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isEnded = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <Card className="overflow-hidden flex flex-col w-full hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <img src={auction.img} alt={auction.title} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        {isEnded && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Ended</span>
          </div>
        )}
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
          <Clock className="w-4 h-4 text-amber-500" /> 
          {isEnded ? "Closed" : `${timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}${String(timeLeft.hours).padStart(2, '0')}h : ${String(timeLeft.minutes).padStart(2, '0')}m : ${String(timeLeft.seconds).padStart(2, '0')}s`}
        </div>
        <Button 
          size="sm" 
          disabled={isEnded}
          className="bg-emerald-600 hover:bg-emerald-700 mt-3 text-white disabled:opacity-50"
          onClick={() => onBidClick(auction)}
        >
          {isEnded ? "Ended" : "Bid Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function LiveBidding() {
  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(2450000);
  const [bidHistory, setBidHistory] = useState([
    { bidder: "ID No. ***892", amount: "2,450,000 KES", time: "2 mins ago" },
    { bidder: "ID No. ***411", amount: "2,400,000 KES", time: "14 mins ago" },
    { bidder: "ID No. ***655", amount: "2,300,000 KES", time: "1 hour ago" }
  ]);
  const navigate = useNavigate();

  // Featured Item Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 30 });
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          setIsEnded(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePlaceBid = (e) => {
    e.preventDefault();

    if (isEnded) {
      toast.error("This auction has ended. Bidding is closed.");
      return;
    }

    if (!auth.currentUser) {
      toast.error("Please log in or sign up to place a live bid.");
      navigate('/login');
      return;
    }

    const numericBid = parseInt(bidAmount);
    if (!numericBid || numericBid <= currentBid) {
      toast.error("Please enter a bid higher than the current active amount.");
      return;
    }

    setCurrentBid(numericBid);
    setBidHistory([
      { bidder: auth.currentUser.displayName || "Verified Bidder", amount: `${numericBid.toLocaleString()} KES`, time: "Just now" },
      ...bidHistory
    ]);
    setBidAmount('');
    toast.success("Bid placed successfully!");
  };

  const handleGridBidClick = (auction) => {
    if (!auth.currentUser) {
      toast.error("Please log in or sign up to bid on items.");
      navigate('/login');
    } else {
      toast.info(`Selected ${auction.title} for bidding.`);
    }
  };

  // Auctions array with initial structured time objects for the live timers
  const allAuctions = [
    { id: 1, title: "Premium Kajiado Land — 5 Acres", category: "REAL ESTATE", price: "2,450,000 KES", initialTime: { days: 0, hours: 2, minutes: 15, seconds: 0 }, img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Toyota Land Cruiser VX 2019", category: "VEHICLES", price: "4,750,000 KES", initialTime: { days: 0, hours: 5, minutes: 24, seconds: 0 }, img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Samsung Galaxy S24 Ultra", category: "ELECTRONICS", price: "115,000 KES", initialTime: { days: 1, hours: 12, minutes: 0, seconds: 0 }, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Mombasa 2-Br Nyali Apt", category: "REAL ESTATE", price: "8,500,000 KES", initialTime: { days: 4, hours: 10, minutes: 0, seconds: 0 }, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Massey Ferguson 375 Tractor", category: "HEAVY EQUIP", price: "1,600,000 KES", initialTime: { days: 0, hours: 12, minutes: 45, seconds: 0 }, img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80" }
  ];

  const renderAuctionGrid = (auctionsList) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {auctionsList.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} onBidClick={handleGridBidClick} />
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background">
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

        {/* FEATURED LIVE ITEM & BIDDING INTERFACE */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-8 w-full">
          
          <div className="flex-1 lg:w-2/3 flex flex-col gap-4">
            <div className="relative w-full h-72 md:h-80 rounded-xl overflow-hidden border border-border">
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" alt="Kajiado Land" className="w-full h-full object-cover" />
              <Badge className={`absolute top-4 left-4 font-bold px-3 py-1 text-white ${isEnded ? 'bg-amber-600' : 'bg-emerald-600'}`}>
                {isEnded ? "AUCTION CLOSED (Archived)" : "FEATURED ITEM #1"}
              </Badge>
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold">Premium Kajiado Land — 5 Acres</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Optimized for immediate commercial or residential development. Clean title deed ready for transfer upon auction closure.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex-shrink-0 bg-muted/30 border border-border rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {isEnded ? "Final Winning Bid" : "Current Highest Bid"}
                </span>
                <div className={`flex items-center gap-1 text-xs font-medium ${isEnded ? 'text-red-500 font-bold' : 'text-amber-500'}`}>
                  <Clock className="w-3.5 h-3.5" /> 
                  <span>
                    {isEnded ? "Live Bidding Ended" : `${String(timeLeft.hours).padStart(2, '0')}h : ${String(timeLeft.minutes).padStart(2, '0')}m : ${String(timeLeft.seconds).padStart(2, '0')}s left`}
                  </span>
                </div>
              </div>

              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {currentBid.toLocaleString()} KES
              </p>

              {isEnded ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Live Bidding Ended</p>
                    <p>This auction is now closed. Final audit is underway. Listing will remain archived for 48 hours before removal.</p>
                  </div>
                </div>
              ) : (
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
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-border w-full">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Final Bid Activity</h4>
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

        {/* CATEGORY TABS & FILTERABLE AUCTION GRID */}
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
              {renderAuctionGrid(allAuctions)}
            </TabsContent>

            <TabsContent value="real estate" className="w-full outline-none">
              {renderAuctionGrid(allAuctions.filter(item => item.category === "REAL ESTATE"))}
            </TabsContent>

            <TabsContent value="vehicles" className="w-full outline-none">
              {renderAuctionGrid(allAuctions.filter(item => item.category === "VEHICLES"))}
            </TabsContent>

            <TabsContent value="electronics" className="w-full outline-none">
              {renderAuctionGrid(allAuctions.filter(item => item.category === "ELECTRONICS"))}
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  );
}