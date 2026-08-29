import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function PlatformAnalytics({ users, auctions }) {
  const [revenueData, setRevenueData] = useState([]);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true);

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

  // Fetch real payment records from Firestore to calculate revenue
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "payments"));
        const payments = querySnapshot.docs.map(doc => doc.data());

        // Group payments by month (assuming payment doc has { amount: number, createdAt: timestamp/date })
        const monthlyTotals = {};

        payments.forEach(payment => {
          if (payment.createdAt && payment.amount) {
            const date = payment.createdAt.toDate ? payment.createdAt.toDate() : new Date(payment.createdAt);
            const monthName = date.toLocaleString('default', { month: 'short' });
            monthlyTotals[monthName] = (monthlyTotals[monthName] || 0) + parseFloat(payment.amount);
          }
        });

        // Format for Recharts
        const formattedData = Object.keys(monthlyTotals).map(month => ({
          month,
          revenue: monthlyTotals[month]
        }));

        setRevenueData(formattedData);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
      } finally {
        setIsLoadingRevenue(false);
      }
    };

    fetchRevenueData();
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Real-Time Revenue Chart from Firestore Payments */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Paid Auctions Revenue (KES)
            </CardTitle>
            <CardDescription>Live revenue pulled from completed database checkouts.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 w-full pt-4 flex items-center justify-center">
            {isLoadingRevenue ? (
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            ) : revenueData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">No payment records found in database.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs font-medium text-muted-foreground" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs font-medium text-muted-foreground" />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    formatter={(value) => [`${value.toLocaleString()} KES`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}