import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Clock, Gavel, Loader2 } from 'lucide-react';

export default function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidInput, setBidInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Fetch auction document details from Firestore
  useEffect(() => {
    const fetchAuctionDoc = async () => {
      try {
        const docRef = doc(db, "auctions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuction({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Auction item not found.");
          navigate('/auctions');
        }
      } catch (err) {
        console.error("Error loading auction:", err);
        navigate('/auctions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctionDoc();
  }, [id, navigate]);

  // Real-time ticker for countdown clock
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time listener for bids placed on this item
  useEffect(() => {
    const q = query(collection(db, "auctions", id, "bids"), orderBy("amount", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBids(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  const getRemainingTime = (expiresAt) => {
    const timeLeft = expiresAt - now;
    if (timeLeft <= 0) return "Auction Ended";
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Submit a new bid logic
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please log in to place a bid.");
      navigate('/login');
      return;
    }

    const numericBid = parseFloat(bidInput);
    const currentHighest = bids.length > 0 ? bids[0].amount : (auction.numericPrice || 0);

    if (numericBid <= currentHighest) {
      toast.error(`Your bid must be higher than the current highest bid (${currentHighest.toLocaleString()} KES).`);
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "auctions", id, "bids"), {
        amount: numericBid,
        bidderEmail: auth.currentUser.email,
        bidderUid: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, "auctions", id), {
        price: `${numericBid.toLocaleString()} KES`,
        numericPrice: numericBid,
        highestBidderUid: auth.currentUser.uid,
        highestBidderEmail: auth.currentUser.email
      });

      toast.success("Bid placed successfully!");
      setBidInput('');
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit bid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !auction) {
    return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  }

  const timeLeftStr = getRemainingTime(auction.expiresAt);
  const isEnded = timeLeftStr === "Auction Ended";
  const currentHighestBid = bids.length > 0 ? bids[0].amount : (auction.numericPrice || 0);

  return (
    <div className="w-full min-h-screen bg-background p-6 md:p-10">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
            <img src={auction.img} alt={auction.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4">
              <Badge className={`${isEnded ? 'bg-muted-foreground' : 'bg-red-500 text-white'} border-none flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold`}>
                <Clock className="w-4 h-4" /> {timeLeftStr}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{auction.title}</h1>
              <p className="text-muted-foreground mt-1">Live Bidding Room</p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Current Highest Bid</p>
                <p className="text-4xl font-extrabold text-emerald-600">{currentHighestBid.toLocaleString()} KES</p>
              </div>

              {/* Active Bidding Form */}
              {!isEnded && (
                <form onSubmit={handlePlaceBid} className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Place a Higher Bid</label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder={`Enter > ${currentHighestBid.toLocaleString()}`} 
                      value={bidInput} 
                      onChange={(e) => setBidInput(e.target.value)} 
                      required 
                      className="h-12 text-lg"
                    />
                    <Button type="submit" className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bid Now"}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Live Bid History Feed */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-emerald-600" /> Live Bid History ({bids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                  {bids.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No bids recorded yet. Be the first!</p>
                  ) : (
                    bids.map((b, index) => (
                      <div key={b.id} className="flex justify-between items-center p-3 bg-muted/40 rounded-xl border border-border/50 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">
                            #{index + 1}
                          </span>
                          <span className="font-medium text-muted-foreground">{b.bidderEmail}</span>
                        </div>
                        <span className="font-extrabold text-foreground">{b.amount.toLocaleString()} KES</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}