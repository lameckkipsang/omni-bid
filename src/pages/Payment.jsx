import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import { Loader2, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  //Fetch the specific auction data from Firestore
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

  const handleSimulatedPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
  };

  const generateReceipt = () => {
    const doc = new jsPDF();
    doc.save(`OmniBid_Receipt_${id}.pdf`);
  };

  // Shows a loading state while fetching data from the database
  if (!auction) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-muted-foreground font-medium">Loading secure checkout...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-sm">
        {!isSuccess ? (
          <>
            <div className="text-center mb-6 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold tracking-tight">Secure Checkout</h2>
              {/* Dynamic title */}
              <p className="text-muted-foreground text-sm">Place a secure bid on {auction.title}</p>
            </div>
            
            <form onSubmit={handleSimulatedPayment} className="space-y-6">
              {/* Dynamic price display box */}
              <div className="p-4 bg-muted/50 rounded-xl text-center border border-border">
                <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider mb-1">Current Highest Bid</p>
                <p className="text-2xl font-extrabold text-emerald-600">{auction.price}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Enter Your Bid (KES)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 500000" 
                  value={bidAmount} 
                  onChange={(e) => setBidAmount(e.target.value)} 
                  required 
                  className="h-12 text-lg"
                />
              </div>
              
              <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authorize Payment"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 py-4">
            <CheckCircle2 className="w-20 h-20 text-emerald-600 mx-auto" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Bid Successful!</h2>
              <p className="text-muted-foreground">Your simulated payment was processed and the funds are secured.</p>
            </div>
            <Button onClick={generateReceipt} variant="outline" className="w-full h-12 border-emerald-500 text-emerald-600 hover:bg-emerald-500/10">
              <Download className="w-5 h-5 mr-2" /> Download Official Receipt
            </Button>
            <Button onClick={() => navigate('/auctions')} variant="ghost" className="w-full">
              Return to Live Bidding
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}