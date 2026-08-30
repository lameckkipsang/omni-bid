import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function Support() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        <img 
          src="/assets/support-hero-bg.jpg" 
          alt="OmniBid Support" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-center text-white space-y-4 px-6 max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Get in Touch & FAQ</h1>
          <p className="text-base md:text-lg text-white/90 font-medium">
            Need physical title deed checking or cash escrow support? Send us a query or explore our answers to standard bidding processes in Kenya.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        </div>
      </div>

    </div>
  );
}