import { TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PlatformAnalytics({ users, auctions }) {
  const getCategoryData = () => {
    const counts = auctions.reduce((acc, auction) => {
      acc[auction.category] = (acc[auction.category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    }));
  };

  const chartData = getCategoryData();

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Platform Statistics
          </CardTitle>
          <CardDescription>Real-time overview of database metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-muted/30 border border-border rounded-xl">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Users</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">{users.length}</p>
            </div>
            <div className="p-6 bg-muted/30 border border-border rounded-xl">
              <p className="text-xs font-bold text-muted-foreground uppercase">Active Listings</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">{auctions.length}</p>
            </div>
            <div className="p-6 bg-muted/30 border border-border rounded-xl">
              <p className="text-xs font-bold text-muted-foreground uppercase">System Status</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">Online</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" /> Auction Breakdown by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80 w-full pt-4">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No data available to chart. Add some auctions first!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs font-medium text-muted-foreground" />
                <YAxis tickLine={false} axisLine={false} className="text-xs font-medium text-muted-foreground" allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
                <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}