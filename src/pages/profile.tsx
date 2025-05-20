import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [username, setUsername] = useState<string>(profile?.username || "");
  const [firstName, setFirstName] = useState<string>(profile?.first_name || "");
  const [lastName, setLastName] = useState<string>(profile?.last_name || "");
  const [email, setEmail] = useState<string>(profile?.email || "");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const update = {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
    };
    const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
    setIsSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Profile Updated" });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <form className="space-y-6" onSubmit={handleSave}>
        <div>
          <Label>Username</Label>
          <Input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div>
          <Label>First Name</Label>
          <Input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
