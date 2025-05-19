import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const subject = (form.elements.namedItem("subject") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    const { error } = await supabase.from("contact_messages").insert([
      { name, email, subject, message }
    ]);
    setLoading(false);

    if (error) {
      setError("Failed to send message. Please try again.");
    } else {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-umat-green/90 py-20 px-4">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl max-w-3xl">
              Get in touch with the Department of Mathematical Sciences at the University of Mines and Technology.
            </p>
          </div>
        </div>
        <div className="container mx-auto py-16 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-heading mb-8">Get in Touch</h2>
              {formSubmitted ? (
                <div className="bg-green-50 text-green-800 p-6 rounded-lg border border-green-200 mb-8">
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p>Your message has been received. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                      <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                    <Input id="subject" name="subject" placeholder="How can we help you?" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-umat-green"
                      placeholder="Please provide details about your inquiry..."
                      required
                    ></textarea>
                  </div>
                  {error && (
                    <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded">{error}</div>
                  )}
                  <Button type="submit" className="bg-umat-green hover:bg-umat-green/90" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
            <div>
              <h2 className="section-heading mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-umat-yellow/20 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-umat-green" />
                  </div>
                  <div>
                    <div className="font-semibold">Address</div>
                    <div>University of Mines and Technology, Tarkwa, Ghana</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-umat-yellow/20 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-umat-green" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div>maths@umat.edu.gh</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-umat-yellow/20 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-umat-green" />
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div>+233 3123 20324</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
