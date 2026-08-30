import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock, TrendingUp, MapPin, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import lameckProfile from '../assets/lameck2.jpeg';

export default function Home() {
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [now, setNow] = useState(Date.now());

  const team = [
    { 
      name: "Lameck Kipsang", 
      role: "Founder & Lead Developer",
      img: lameckProfile
    }
  ];

  // Fetch the latest 4 auctions dynamically
  useEffect(() => {
    const q = query(collection(db, "auctions"), orderBy("createdAt", "desc"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeaturedAuctions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Update timers every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingTime = (expiresAt) => {
    const timeLeft = expiresAt - now;
    if (timeLeft <= 0) return "Auction Ended";
    const totalHours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    return `${totalHours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <header className="relative bg-slate-950 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')] bg-cover bg-center" />
        <div className="relative max-w-5xl mx-auto space-y-6">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500 bg-emerald-500/10 px-3 py-1 text-xs">
            LIVE PREMIUM AUCTION
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Premium Kajiado Land — 5 Acres</h1>
          <p className="text-lg text-zinc-300 max-w-2xl">
            Exceptional parcel optimized for development or investment. Secure boundary, ready title deed, direct access road.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div>
              <p className="text-xs text-zinc-400 uppercase">Current Bid</p>
              <p className="text-2xl font-bold text-emerald-400">2,450,000 KES</p>
            </div>
            <Link to="/auctions" className="ml-auto">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg">
                View Auction Details <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* SERVICES GRID */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Engineered for Integrity</h2>
        <p className="text-2xl font-bold mb-8 text-foreground">Our guarantees for every buyer and seller</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle>ID Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Mandatory national ID checks eliminate fraud and fake bidders.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Lock className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle>Secure Escrow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Bank-grade escrow accounts protect earnest money deposits.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle>Multi-Category</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">From vast land parcels to flagship vehicles, everything on one dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ABOUT US and OFFICES */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Kenya's Trusted Modern Auction Platform</h2>
          <p className="text-muted-foreground leading-relaxed">
            OmniBid brings fair, public price discovery to high-value assets across East Africa. By combining strict identity verification with state-of-the-art live technology, we deliver a bidding ecosystem where trust is absolute.
          </p>
          <div className="flex gap-10 pt-4">
            <div>
              <p className="text-4xl font-bold text-emerald-600">100%</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase mt-1">Verified Bidders</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-600">1.2B</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase mt-1">KES Transacted</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 bg-muted/50 p-8 rounded-2xl border border-border">
          <h3 className="text-xl font-bold">Visit Our Offices</h3>
          <div className="space-y-4">
            <Card className="flex items-center p-5 gap-4 shadow-sm">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Nairobi Office</h4>
                <p className="text-sm text-muted-foreground">OmniBid Plaza, Wood Avenue, Kilimani</p>
              </div>
            </Card>
            <Card className="flex items-center p-5 gap-4 shadow-sm">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Mombasa Office</h4>
                <p className="text-sm text-muted-foreground">Shoreline Business Park, Nyali Road</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* MEET THE TEAM */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Meet the Leadership</h2>
          <p className="text-muted-foreground mt-2">The engineering mind keeping OmniBid secure, compliant, and efficient.</p>
        </div>
        <div className="flex justify-center">
          {team.map((member, teamIndex) => (
            <Card key={teamIndex} className="text-center p-8 hover:border-emerald-500 transition-colors w-full max-w-sm shadow-md">
              <div className="w-32 h-32 mx-auto bg-muted rounded-full mb-6 overflow-hidden border-4 border-background shadow-sm">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-xl">{member.name}</h4>
              <p className="text-sm text-emerald-600 uppercase font-bold mt-2 tracking-wider">{member.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURED AUCTIONS */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">Active Featured Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredAuctions.length === 0 ? (
            <div className="col-span-4 text-center text-muted-foreground py-10">No featured auctions available.</div>
          ) : (
            featuredAuctions.map((auction) => {
              const timeLeftStr = getRemainingTime(auction.expiresAt);
              const isEnded = timeLeftStr === "Auction Ended";

              return (
                <Card key={auction.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden relative">
                    <img src={auction.img} alt={auction.title} className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 ${isEnded ? 'grayscale' : ''}`} />
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
                      <Clock className="w-4 h-4 text-amber-500" /> {isEnded ? timeLeftStr : `${timeLeftStr} left`}
                    </div>
                    <Link to="/auctions">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 mt-3" disabled={isEnded}>
                        {isEnded ? "Closed" : "Bid Now"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
}