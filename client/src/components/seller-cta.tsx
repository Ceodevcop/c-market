import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function SellerCTA() {
  const [_, navigate] = useLocation();

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">Start Selling Today</h2>
            <p className="mb-6">
              Turn your unused items into cash. Join thousands of sellers who've found success on Central-M.
            </p>
            <ul className="mb-8 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-300" />
                <span>Free to list items</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-300" />
                <span>Reach millions of buyers</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-300" />
                <span>Simple and secure payment system</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-300" />
                <span>24/7 seller support</span>
              </li>
            </ul>
            <Button 
              className="bg-white text-primary font-medium hover:bg-gray-100 transition" 
              size="lg"
              onClick={() => navigate("/create-listing")}
            >
              Create Seller Account
            </Button>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              alt="Person using laptop" 
              className="rounded-lg shadow-lg max-h-96 object-cover w-full" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
