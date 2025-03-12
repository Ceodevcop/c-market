import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [_, navigate] = useLocation();

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Buy and Sell with Confidence</h1>
            <p className="text-lg mb-6 text-indigo-100">
              Join our community of millions and discover the easiest way to buy and sell items online.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/create-listing")}
                className="bg-white text-primary font-medium hover:bg-gray-100 transition"
              >
                Start Selling
              </Button>
              <Button 
                size="lg"
                onClick={() => navigate("/products")}
                className="bg-secondary text-white font-medium hover:bg-secondary/90 transition"
              >
                Shop Now
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1607082351323-de1950b7a412?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              alt="People shopping online" 
              className="rounded-lg shadow-lg max-h-80 object-cover w-full" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
