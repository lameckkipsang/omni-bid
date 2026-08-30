import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import { Loader2, Download, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const docRef = doc(db, "auctions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuction({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Auction not found.");
          navigate('/auctions');
        }
      } catch (error) {
        console.error("Error fetching auction details:", error);
        navigate('/auctions');
      }
    };
    fetchAuction();
  }, [id, navigate]);

  // The Simulated Payment Logic & Firestore Revenue Registration
  const handleSimulatedPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate network request delay (e.g. M-Pesa STK Push / Bank Gateway)
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Register payment record in Firestore so the Admin Revenue Chart updates automatically
      await addDoc(collection(db, "payments"), {
        auctionId: auction.id,
        title: auction.title,
        amount: auction.numericPrice || parseFloat(auction.price.replace(/[^0-9.]/g, '')),
        paymentReference: paymentRef,
        payerEmail: auth.currentUser?.email || "Anonymous",
        payerUid: auth.currentUser?.uid || "N/A",
        createdAt: serverTimestamp()
      });

      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Payment verified and recorded successfully!");
    } catch (err) {
      console.error("Payment processing error:", err);
      toast.error("Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // The Dynamic PDF Generator
  const generateReceipt = () => {
    const doc = new jsPDF();
    const finalAmount = auction.price;
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(5, 150, 105); // Emerald Green
    doc.text("OmniBid Official Receipt", 20, 20);
    
    // Body
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 40);
    doc.text(`Bidder Account: ${auth.currentUser?.email}`, 20, 50);
    doc.text(`Asset Title: ${auction.title}`, 20, 60);
    doc.text(`Asset Category: ${auction.category}`, 20, 70);
    doc.text(`Payment Ref / Phone: ${paymentRef}`, 20, 80);
    
    doc.setFontSize(14);
    doc.text(`Total Amount Paid: ${finalAmount}`, 20, 100);
    
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text(`Transaction Status: VERIFIED & HELD IN ESCROW`, 20, 120);
    
    doc.save(`OmniBid_Receipt_${auction.id}.pdf`);
  };

  if (!auction) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-muted-foreground font-medium">Loading secure checkout...</p>
      </div>
    );
  }

  const finalPriceDisplay = auction.price;

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-sm">
        {!isSuccess ? (
          <>
            <div className="text-center mb-6 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold tracking-tight">Secure Asset Checkout</h2>
              <p className="text-muted-foreground text-sm">Finalizing payment for {auction.title}</p>
            </div>
            
            <form onSubmit={handleSimulatedPayment} className="space-y-6">
              {/* Locked Winning Price Display */}
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-1">
                <p className="text-xs uppercase text-emerald-600 font-extrabold tracking-wider">Locked Winning Bid Amount</p>
                <p className="text-3xl font-extrabold text-emerald-600">{finalPriceDisplay}</p>
                <p className="text-[11px] text-muted-foreground pt-1">Amount is fixed based on the final auction results.</p>
              </div>

              {/* Payment Reference Input (Phone Number or Bank Code) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> M-Pesa Phone / Bank Transaction Code
                </label>
                <Input 
                  type="text" 
                  placeholder="e.g. 0712345678 or TXN987654321" 
                  value={paymentRef} 
                  onChange={(e) => setPaymentRef(e.target.value)} 
                  required 
                  className="h-12 text-base font-medium"
                />
                <p className="text-[11px] text-muted-foreground">Enter your mobile money number or bank reference number to confirm transaction authorization.</p>
              </div>
              
              <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold shadow-md" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Authorize Payment (${finalPriceDisplay})`}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 py-4">
            <CheckCircle2 className="w-20 h-20 text-emerald-600 mx-auto" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground">Your transaction has been registered and revenue logged to platform analytics.</p>
            </div>
            <Button onClick={generateReceipt} variant="outline" className="w-full h-12 border-emerald-500 text-emerald-600 hover:bg-emerald-500/10">
              <Download className="w-5 h-5 mr-2" /> Download Official Receipt
            </Button>
            <Button onClick={() => navigate('/auctions')} variant="ghost" className="w-full">
              Return to Live Bidding Floor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}