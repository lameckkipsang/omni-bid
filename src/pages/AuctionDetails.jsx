import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, Loader2 } from 'lucide-react';

export default function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // 1. Fetch auction document details from Firestore
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

  // 2. Real-time ticker for countdown clock
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingTime = (expiresAt) => {
    const timeLeft = expiresAt - now;
    if (timeLeft <= 0) return "Auction Ended";
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (isLoading || !auction) {
    return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  }

  const timeLeftStr = getRemainingTime(auction.expiresAt);
  const isEnded = timeLeftStr === "Auction Ended";

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
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Current Price</p>
              <p className="text-4xl font-extrabold text-emerald-600">{auction.price}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}