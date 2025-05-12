
import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    // In a real app, you would send the form data to a server here
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
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                    <Input id="subject" placeholder="How can we help you?" required />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <textarea 
                      id="message"
                      rows={5}
                      className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-umat-green"
                      placeholder="Please provide details about your inquiry..."
                      required
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="bg-umat-green hover:bg-umat-green/90">
                    Send Message
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
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-gray-700">
                      Department of Mathematical Sciences<br />
                      University of Mines and Technology<br />
                      Tarkwa, Ghana
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-umat-yellow/20 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-umat-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-gray-700">math@umat.edu.gh</p>
                    <p className="text-gray-700">hod.math@umat.edu.gh</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-umat-yellow/20 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-umat-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-gray-700">+233 123 456 789</p>
                    <p className="text-gray-700">+233 987 654 321</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-bold text-lg mb-4">Office Hours</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Saturday</span>
                      <span className="font-medium">9:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 h-64 rounded-lg overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.445002585453!2d-2.006925684685808!3d5.30373539617056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdd8872a2428433%3A0xcb9f71b71334a74f!2sUniversity%20of%20Mines%20and%20Technology!5e0!3m2!1sen!2sgh!4v1620940628693!5m2!1sen!2sgh" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy"
                  title="UMaT Location"
                ></iframe>
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
