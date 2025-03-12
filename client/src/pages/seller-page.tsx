import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { User, Product } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, UserCheck, Star, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SellerPage() {
  const { id } = useParams();
  const numericId = parseInt(id);
  const [_, navigate] = useLocation();
  const { user } = useAuth();

  const { data: seller, isLoading: sellerLoading } = useQuery<Omit<User, "password">>({
    queryKey: [`/api/users/${id}`],
    enabled: !!id && !isNaN(numericId)
  });

  const { data: sellerProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/sellers/${id}/products`],
    enabled: !!id && !isNaN(numericId)
  });

  if (sellerLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Skeleton className="h-32 rounded-lg mb-6" />
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-full max-w-lg mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Seller Not Found</h1>
            <p className="mb-6">The seller profile you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
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
          {/* Seller Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="md:flex md:items-center">
              {/* Avatar */}
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {seller.avatar ? (
                    <img src={seller.avatar} alt={seller.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-gray-600 text-2xl">{seller.name.charAt(0)}</span>
                  )}
                </div>
              </div>
              
              {/* Seller Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1 text-gray-800">{seller.name}</h1>
                <div className="flex items-center mb-2">
                  <UserCheck className="h-4 w-4 text-success mr-1" />
                  <span className="text-sm text-gray-500">Verified Seller</span>
                </div>
                
                {seller.bio && (
                  <p className="text-gray-600 mb-4">{seller.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4">
                  {user && user.id !== seller.id && (
                    <Button onClick={() => navigate(`/messages/${seller.id}`)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="products" className="mb-8">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-6">
              <h2 className="text-xl font-bold mb-6">Products by {seller.name}</h2>
              
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sellerProducts && sellerProducts.length > 0 ? (
                <ProductGrid products={sellerProducts} />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No products yet</h3>
                  <p className="text-gray-500">This seller hasn't listed any products yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="mt-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">About {seller.name}</h2>
                
                <div className="space-y-4">
                  {seller.bio ? (
                    <div>
                      <h3 className="font-medium mb-2">Bio</h3>
                      <p className="text-gray-600">{seller.bio}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">This seller hasn't added a bio yet.</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Member Since</h4>
                        <p className="text-gray-600">January 2023</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-gray-600">United States</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Reviews for {seller.name}</h2>
                
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center bg-gray-50 p-4 rounded-full mb-4">
                    <Star className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-gray-500">This seller hasn't received any reviews yet.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
