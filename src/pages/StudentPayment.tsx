
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet } from "lucide-react";

const StudentPayment = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    className: "",
    indexNumber: "",
    amount: "",
    reference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.className || !formData.indexNumber || !formData.amount || !formData.reference) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate payment processing
    setIsSubmitting(true);
    
    // This would typically connect to a payment gateway
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Payment Instructions Sent",
        description: "Please complete your payment using the MTN Mobile Money number provided.",
      });
      
      // Clear form or redirect
      if (!user) {
        setFormData({
          fullName: "",
          className: "",
          indexNumber: "",
          amount: "",
          reference: "",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Department Payment Portal</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
                <CardDescription>
                  Complete the form below to make a payment to the department.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="className">Class/Year Group</Label>
                      <Input
                        id="className"
                        name="className"
                        placeholder="E.g., Year 2 Mathematics"
                        value={formData.className}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="indexNumber">Index Number</Label>
                      <Input
                        id="indexNumber"
                        name="indexNumber"
                        placeholder="Enter your index number"
                        value={formData.indexNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (GHS)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Payment Reference</Label>
                    <Textarea
                      id="reference"
                      name="reference"
                      placeholder="What is this payment for? E.g., Department Dues, Course Materials, etc."
                      value={formData.reference}
                      onChange={handleChange}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-umat-green hover:bg-umat-green/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>Submit Payment Information</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  How to complete your payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                    <Wallet className="h-12 w-12 text-umat-green" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">MTN Mobile Money</h3>
                    <p className="text-sm">Follow these steps to complete your payment:</p>
                    <ol className="list-decimal text-sm ml-5 space-y-1">
                      <li>Dial *170# on your phone</li>
                      <li>Select "Transfer Money"</li>
                      <li>Select "MoMo User"</li>
                      <li>Enter <strong>0596760174</strong></li>
                      <li>Enter the amount</li>
                      <li>Use your index number as reference</li>
                      <li>Enter your PIN to confirm</li>
                    </ol>
                    
                    <div className="border-t pt-2 mt-4">
                      <p className="text-sm font-semibold">Department MoMo Number:</p>
                      <p className="text-lg font-bold">0596760174</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Keep the transaction ID for your records
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentPayment;
