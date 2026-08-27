import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("auctions");

  return (
    <div className="w-full min-h-screen bg-background p-6 md:p-10">
      <div className="container mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage platform users, monitor live bids, and publish new auction assets.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-600 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4" /> Admin Access Verified
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="auctions">Manage Auctions</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="analytics">Platform Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="auctions"></TabsContent>
          
          <TabsContent value="users"></TabsContent>
          
          <TabsContent value="analytics"></TabsContent>
        </Tabs>

      </div>
    </div>
  );
}