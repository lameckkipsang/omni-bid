import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <header className="relative bg-zinc-950 text-white py-24 px-6 overflow-hidden">
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
            <Link to="/item/1" className="ml-auto">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg">
                View Auction Details <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

    </div>
  );
}