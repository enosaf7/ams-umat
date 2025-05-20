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

  const [avatarUrl, setAvatarUrl] = useState<string>(profile?.avatar_url || "");
  const [about, setAbout] = useState<string>(profile?.about || "");
  const [linkedin, setLinkedin] = useState<string>(profile?.linkedin || "");
  const [portfolio, setPortfolio] = useState<string>(profile?.portfolio || "");
  const [cvUrl, setCvUrl] = useState<string>(profile?.cv_url || "");
  const [name, setName] = useState<string>(profile?.name || "");
  const [email, setEmail] = useState<string>(profile?.email || "");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatar_url || "");
      setAbout(profile.about || "");
      setLinkedin(profile.linkedin || "");
      setPortfolio(profile.portfolio || "");
      setCvUrl(profile.cv_url || "");
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}.${fileExt}`;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Error", description: uploadError.message, variant: "destructive" });
      return;
    }
    const { publicURL } = supabase.storage.from("avatars").getPublicUrl(filePath).data;
    setAvatarUrl(publicURL);

    // Optionally update profile immediately
    await supabase.from("profiles").update({ avatar_url: publicURL }).eq("id", user.id);
    await refreshProfile();
    toast({ title: "Profile Picture Updated" });
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `cvs/${user.id}.${fileExt}`;

    let { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Error", description: uploadError.message, variant: "destructive" });
      return;
    }
    const { publicURL } = supabase.storage.from("cvs").getPublicUrl(filePath).data;
    setCvUrl(publicURL);

    // Optionally update profile immediately
    await supabase.from("profiles").update({ cv_url: publicURL }).eq("id", user.id);
    await refreshProfile();
    toast({ title: "CV/Resume Uploaded" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const update = {
      name,
      email,
      about,
      linkedin,
      portfolio,
      avatar_url: avatarUrl,
      cv_url: cvUrl,
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
          <Label>Profile Picture</Label>
          <div className="flex items-center space-x-4">
            <img
              src={avatarUrl || "/default-avatar.png"}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <Input type="file" accept="image/*" onChange={handleAvatarUpload} />
          </div>
        </div>
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>About</Label>
          <textarea
            value={about}
            onChange={e => setAbout(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="Tell us about yourself"
          />
        </div>
        <div>
          <Label>LinkedIn</Label>
          <Input
            value={linkedin}
            onChange={e => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div>
          <Label>Portfolio Website</Label>
          <Input
            value={portfolio}
            onChange={e => setPortfolio(e.target.value)}
            placeholder="https://your-portfolio.com"
          />
        </div>
        <div>
          <Label>CV/Resume</Label>
          <div className="flex items-center space-x-4">
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View/Download Current CV
              </a>
            )}
            <Input type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} />
          </div>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
