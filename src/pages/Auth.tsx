
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState as useHookState } from "react";
import { v4 as uuidv4 } from "uuid";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [classValue, setClassValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // For profile image
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    setAvatarFile(file);
    
    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      setUploading(true);
      
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${userId}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Avatar upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (userId: string, avatarUrl?: string | null) => {
    try {
      const updates = {
        first_name: firstName,
        last_name: lastName,
        index_number: indexNumber,
        class: classValue,
        ...(avatarUrl && { avatar_url: avatarUrl })
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
        
      if (error) throw error;
    } catch (error: any) {
      throw error;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              index_number: indexNumber,
              class: classValue
            }
          }
        });

        if (error) throw error;
        
        // If we have an avatar file and user, upload it
        if (avatarFile && data.user) {
          const avatarUrl = await uploadAvatar(data.user.id);
          
          // Update the profile with the avatar URL and names
          await updateProfile(data.user.id, avatarUrl);
        }
        
        toast({
          title: "Sign up successful!",
          description: "Please check your email for verification.",
        });
      } else {
        // Sign in flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Logged in successfully!",
          description: "Welcome back!",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-umat-green">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isSignUp
              ? "Join the Department of Mathematical Sciences community"
              : "Sign in to your account"}
          </p>
        </div>

        <Tabs defaultValue="signin" onValueChange={(value) => setIsSignUp(value === "signup")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="signin-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student's email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signin-password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                className="w-full bg-umat-green hover:bg-umat-green/90"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="index-number" className="text-sm font-medium">
                  Index Number
                </label>
                <Input
                  id="index-number"
                  type="text"
                  value={indexNumber}
                  onChange={(e) => setIndexNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="class" className="text-sm font-medium">
                  Class
                </label>
                <Input
                  id="class"
                  type="text"
                  value={classValue}
                  onChange={(e) => setClassValue(e.target.value)}
                  placeholder="e.g., MA 3"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student's email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="avatar" className="text-sm font-medium">
                  Profile Picture (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border border-gray-300">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Profile preview" />
                    ) : (
                      <AvatarFallback>
                        {firstName && lastName
                          ? `${firstName[0]}${lastName[0]}`
                          : "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <Button
                className="w-full bg-umat-green hover:bg-umat-green/90"
                type="submit"
                disabled={loading || uploading}
              >
                {loading || uploading ? "Processing..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
