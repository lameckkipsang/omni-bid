import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Support() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      q: "How does bidding work?",
      a: "Every bid on OmniBid is a legally binding contract. Placing a proxy bid registers your maximum threshold. Our platform automatically ups the bid on your behalf by the minimum increment (e.g. 50,000 KES) to keep you in the lead. Anti-snipe logic extends the clock by 2 minutes if a bid lands in the final seconds."
    },
    {
      q: "What is the platform transaction fee?",
      a: "We charge a standard 5% buyer's premium on all successful auctions. This covers secure escrow, identity verification, and platform maintenance. There are no hidden fees."
    },
    {
      q: "How do I verify my ID?",
      a: "You can verify your National ID by navigating to your profile settings and entering your ID number. Verification is mandatory before you can place live bids."
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept secure payments via M-Pesa, standard bank transfers (EFT/RTGS), and major credit cards for initial deposits."
    },
    {
      q: "Can I cancel a bid?",
      a: "No. Bids cannot be retracted or cancelled once placed to ensure a fair marketplace for all participants. Please ensure you are ready to purchase before confirming a bid."
    },
    {
      q: "How do I contact support?",
      a: "You can use the contact form on this page, or visit one of our Verified Regional Support Hubs in Nairobi or Mombasa for physical asset verification."
    }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Extract data directly from the form elements using their 'name' attributes
    const formData = new FormData(e.target);
    const messageData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      status: 'unread', // Useful for managing tickets in your admin panel later
      createdAt: serverTimestamp()
    };

    try {
      // Add the document to a new 'support_messages' collection in Firestore
      await addDoc(collection(db, 'support_messages'), messageData);
      
      toast.success("Message sent successfully! Our support team will get back to you shortly.");
      e.target.reset(); // Clear the form
    } catch (error) {
      console.error("Error submitting support message:", error);
      toast.error("Failed to send message. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden bg-background border-b border-border">
        <div className="relative z-20 text-center space-y-4 px-6 max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Get in Touch & FAQ</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium">
            Need physical title deed checking or cash escrow support? Send us a query or explore our answers to standard bidding processes in Kenya.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Form */}
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Send Us a Message</h2>
            <form onSubmit={handleSendMessage} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <Input name="fullName" type="text" placeholder="Enter your official name" required className="h-11 bg-background" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <Input name="email" type="email" placeholder="e.g. buyer@domain.com" required className="h-11 bg-background" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject / Category</label>
                <select name="subject" required defaultValue="" className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                  name="message"
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

          {/* FAQ Accordion */}
          <div>
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Bidding Questions Answered</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`border ${isOpen ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border bg-card'} rounded-xl overflow-hidden transition-all duration-200`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      className="flex items-center justify-between w-full p-5 text-left focus:outline-none"
                    >
                      <span className={`font-semibold text-sm md:text-base ${isOpen ? 'text-emerald-700 dark:text-emerald-500' : 'text-foreground'}`}>
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                      )}
                    </button>
                    
                    <div 
                      className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}