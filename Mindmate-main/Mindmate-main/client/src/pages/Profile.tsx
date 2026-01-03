import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bell, Key, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function Profile() {
  const { data: user } = useQuery({ queryKey: ['user'], queryFn: api.auth.me });
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    // Mock password change simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsChangingPassword(false);
    setIsDialogOpen(false);
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={user?.name} className="rounded-xl bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email} disabled className="bg-muted/50 rounded-xl cursor-not-allowed" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 flex justify-end p-4 border-t">
           <Button onClick={handleSave} className="rounded-xl">Save Changes</Button>
        </CardFooter>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-2xl bg-white/50">
             <div className="flex items-center gap-3">
               <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                 <Bell className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-semibold">Daily Reminders</p>
                 <p className="text-sm text-muted-foreground">Get reminded to check in at 8:00 PM</p>
               </div>
             </div>
             <SwitchButton defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-muted/30 transition-all duration-200 cursor-pointer bg-white/50 group">
                 <div className="flex items-center gap-3">
                   <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600 group-hover:bg-orange-200 transition-colors">
                     <Key className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="font-semibold">Change Password</p>
                     <p className="text-sm text-muted-foreground">Update your password regularly</p>
                   </div>
                 </div>
                 <Button variant="ghost" size="sm" className="rounded-xl">Update</Button>
              </div>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:rounded-3xl">
              <form onSubmit={handlePasswordChange}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading">Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current and new password to update your security.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input id="current" type="password" required className="rounded-xl" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" required className="rounded-xl" placeholder="••••••••" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isChangingPassword} className="w-full sm:w-auto rounded-xl h-11 px-8">
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

function SwitchButton({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked || false);
  return (
    <button 
      onClick={() => setChecked(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${checked ? 'bg-primary' : 'bg-input'}`}
    >
      <span className={`bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}
