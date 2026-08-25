import { Badge } from "@/components/ui/badge";

export default function LiveBidding() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-500/10 mb-2">
            ACTIVE BIDDING ENGINE
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">Live Auctions Room</h1>
          <p className="text-muted-foreground mt-1">Real-time asset price discovery secured by national ID verification.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold">Server Connected</span>
        </div>
      </div>

    </div>
  );
}