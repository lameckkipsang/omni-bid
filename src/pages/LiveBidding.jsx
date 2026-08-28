import { useState, useEffect } from 'react';
import { Clock, ArrowRight, Gavel, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function LiveBidding() {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Fetch live auctions from Firestore in real-time
  useEffect(() => {
    // We use a query to order the items by when they were created
    const q = query(collection(db, "auctions"), orderBy("createdAt", "desc"));
    
    // onSnapshot listens to the database in real-time. If the admin adds an item, this triggers automatically!
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAuctions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAuctions(fetchedAuctions);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching live auctions:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Ticker to update the current time every second so our timers tick down
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to format the remaining time
  const getRemainingTime = (expiresAt) => {
    const timeLeft = expiresAt - now;
    
    if (timeLeft <= 0) return "Auction Ended";

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="w-full min-h-screen bg-background p-6 md:p-10">
      <div className="container mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live Bidding Floor
            </h1>
            <p className="text-muted-foreground mt-1">Place your bids on real-time active auctions.</p>
          </div>
          <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/30 px-4 py-1.5 text-sm">
            {auctions.length} Active Listings
          </Badge>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
            <p className="text-muted-foreground">Connecting to live auction server...</p>
          </div>
        ) : (
          /* Auctions Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground bg-muted/30 rounded-xl border border-border">
                No active auctions at the moment. Check back later!
              </div>
            ) : (
              auctions.map((item) => {
                const timeLeftStr = getRemainingTime(item.expiresAt);
                const isEnded = timeLeftStr === "Auction Ended";

                return (
                  <Card key={item.id} className="border-border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${isEnded ? 'grayscale' : ''}`}
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={`${isEnded ? 'bg-muted-foreground' : 'bg-red-500 text-white'} border-none flex items-center gap-1.5 px-3 py-1`}>
                          <Clock className="w-3.5 h-3.5" /> 
                          {timeLeftStr}
                        </Badge>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur text-foreground border-none font-bold text-xs uppercase tracking-wider">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 pb-4">
                      <p className="text-sm text-muted-foreground mb-1">Current Highest Bid</p>
                      <p className="text-2xl font-extrabold text-emerald-600">{item.price}</p>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group" disabled={isEnded}>
                        {isEnded ? "Bidding Closed" : "Place Bid"}
                        {!isEnded && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}