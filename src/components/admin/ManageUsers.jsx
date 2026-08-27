import { Users, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from '../../lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export default function ManageUsers({ users, setUsers }) {
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user from the database?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter(u => u.id !== userId));
        toast.success("User deleted successfully.");
      } catch (err) {
        toast.error("Failed to delete user.");
      }
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" /> Registered Platform Users
        </CardTitle>
        <CardDescription>View or remove user accounts registered in your Firestore database.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
                <th className="p-4">Full Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">National ID</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-muted-foreground">No users found in database.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20">
                    <td className="p-4 font-semibold">{u.fullName || "N/A"}</td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4">{u.nationalId || "Pending"}</td>
                    <td className="p-4">
                      <span className="bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">
                        {u.role || "Bidder"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}