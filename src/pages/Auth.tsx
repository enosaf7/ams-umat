import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const classOptions = [
  "MA 1", "MA 2", "MA 3", "MA 4",
  "SD 1", "SD 2", "SD 3", "SD 4"
];

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles sign up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !fullName || !indexNumber || !className) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // 1. Create user with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message || "Sign up failed.");
      setLoading(false);
      return;
    }

    // 2. Insert user profile with class info
    const { error: profileError } = await supabase.from("profiles").upsert([
      {
        id: signUpData.user.id,
        email,
        full_name: fullName,
        index_number: indexNumber,
        class: className,
      }
    ]);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    // Optionally, redirect to dashboard or login page
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <form
        className="w-full max-w-md p-8 bg-white rounded shadow"
        onSubmit={handleSignup}
      >
        <h2 className="text-2xl font-bold mb-6 text-umat-green">Sign Up</h2>
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Index Number</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={indexNumber}
            onChange={e => setIndexNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Class</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={className}
            onChange={e => setClassName(e.target.value)}
            required
          >
            <option value="">Select your class</option>
            {classOptions.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-umat-yellow text-umat-green font-bold py-2 px-4 rounded hover:bg-yellow-300 transition"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
