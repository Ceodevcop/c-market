import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, Order } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CreditCard, Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CheckoutPage() {
  const { id } = useParams();
  const numericId = parseInt(id);
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id && !isNaN(numericId)
  });

  const createOrderMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/orders", { productId });
      return await res.json();
    },
    onSuccess: (order: Order) => {
      setOrderPlaced(true);
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: Error) => {
      setOrderError(error.message || "Failed to place your order");
      toast({
        title: "Error",
        description: error.message || "Failed to place your order",
        variant: "destructive",
      });
    }
  });

  // Calculate totals
  const subtotal = product ? product.price : 0;
  const shippingFee = 4.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingFee + tax;

  const handlePlaceOrder = () => {
    if (!product) return;
    createOrderMutation.mutate(product.id);
  };

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  if (productLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Checkout</h1>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Skeleton className="h-64 w-full" />
                </div>
                <div>
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 text-center">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Product Not Found</AlertTitle>
              <AlertDescription>
                We couldn't find the product you're looking for. It may have been removed or is no longer available.
              </AlertDescription>
              <div className="mt-4">
                <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
              </div>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Product:</span>
                  <span>{product.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span>{paymentMethod === "credit_card" ? "Credit Card" : "PayPal"}</span>
                </div>
              </div>
              <div className="space-x-4">
                <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
                <Button variant="outline" onClick={() => navigate("/profile")}>View Orders</Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            {orderError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{orderError}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Checkout Form */}
              <div className="md:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="First Name" defaultValue={user?.name.split(" ")[0] || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Last Name" defaultValue={user?.name.split(" ")[1] || ""} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" placeholder="123 Main Street" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="City" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="State" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="ZIP Code" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" placeholder="Country" defaultValue="United States" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 border rounded-md p-4 mb-3">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>Credit / Debit Card</span>
                        </Label>
                      </div>
                      
                      {paymentMethod === "credit_card" && (
                        <div className="space-y-4 mt-4 pl-6">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input id="expiryDate" placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvc">CVC</Label>
                              <Input id="cvc" placeholder="123" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="nameOnCard">Name on Card</Label>
                            <Input id="nameOnCard" placeholder="Name on Card" defaultValue={user?.name || ""} />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 border rounded-md p-4 mt-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center">
                          <svg className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.22,9.29A.92.92,0,0,0,10,8.79h3.26a4.2,4.2,0,0,1,.63,0,2.58,2.58,0,0,1,.92.21,1.46,1.46,0,0,1,.63.57,2.06,2.06,0,0,1,.25,1.11,3.36,3.36,0,0,1-.26,1.38,2.21,2.21,0,0,1-.81,1,3.27,3.27,0,0,1-1.18.48,5.18,5.18,0,0,1-1.49.1H11a.65.65,0,0,0-.63.53l-.42,2.24a.27.27,0,0,1-.25.22H7.63a.21.21,0,0,1-.19-.25l1.78-9.42Z" />
                            <path d="M20.94,6.5H17.67A1,1,0,0,0,16.94,7l-1.81,9.6a.27.27,0,0,0,0,.16.21.21,0,0,0,.19.1h1.62a.35.35,0,0,0,.33-.27l.47-2.49a.91.91,0,0,1,.82-.7h3.26a3.59,3.59,0,0,0,3.06-1.62,4.86,4.86,0,0,0,.62-3.27A2.37,2.37,0,0,0,20.94,6.5Z" />
                            <path d="M8.16,12.19A2.67,2.67,0,0,0,9.68,11a4.85,4.85,0,0,0,.7-2.29,2.22,2.22,0,0,0-.35-1.87A2.7,2.7,0,0,0,7.87,6H4.84a.92.92,0,0,0-.82.7L2.3,15.8a.26.26,0,0,0,0,.15.22.22,0,0,0,.2.1H4.26a.35.35,0,0,0,.33-.27l.41-2.23a.92.92,0,0,1,.82-.7H7.17A5.75,5.75,0,0,0,8.16,12.19Z" />
                          </svg>
                          <span>PayPal</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
              
              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Product Summary */}
                    <div className="flex items-center space-x-3">
                      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500">Condition: {product.condition}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Cost Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Shipping</span>
                        <span className="text-sm font-medium">${shippingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tax</span>
                        <span className="text-sm font-medium">${tax.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Total */}
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">${total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handlePlaceOrder}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
