import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function Support() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Message sent successfully! Our support team will get back to you shortly.");
      setIsSubmitting(false);
      e.target.reset();
    }, 1500);
  };

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
          
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Send Us a Message</h2>
            <form onSubmit={handleSendMessage} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <Input type="text" placeholder="Enter your official name" required className="h-11 bg-background" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <Input type="email" placeholder="e.g. buyer@domain.com" required className="h-11 bg-background" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject / Category</label>
                <select required defaultValue="" className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="" disabled>Select a topic...</option>
                  <option value="title_deed">Title Deed Verification Support</option>
                  <option value="payment">Payment & Escrow Issues</option>
                  <option value="id_verify">National ID Verification</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Message</label>
                <textarea 
                  placeholder="Please specify the exact auction ID or your ID verification query..." 
                  required 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base mt-2 transition-all">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
}