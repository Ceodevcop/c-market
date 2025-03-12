import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Product, Review, InsertReview, User } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ChevronRight, MessageCircle } from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductPage() {
  const { id } = useParams();
  const numericId = parseInt(id);
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id && !isNaN(numericId)
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: [`/api/products/${id}/reviews`],
    enabled: !!id && !isNaN(numericId)
  });

  const { data: seller, isLoading: sellerLoading } = useQuery<Omit<User, "password">>({
    queryKey: [`/api/users/${product?.sellerId}`],
    enabled: !!product?.sellerId
  });

  const createOrderMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/orders", { productId });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Product added to your orders. Proceeding to checkout.",
      });
      navigate(`/checkout/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    }
  });

  const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(3, { message: "Comment must be at least 3 characters" }).max(500)
  });

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reviewSchema>) => {
      const reviewData: InsertReview = {
        productId: numericId,
        userId: user!.id,
        rating: data.rating,
        comment: data.comment,
      };
      const res = await apiRequest("POST", `/api/products/${id}/reviews`, reviewData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}/reviews`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  });

  function handleBuyNow() {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to purchase items",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    createOrderMutation.mutate(numericId);
  }

  const onSubmitReview = (data: z.infer<typeof reviewSchema>) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to submit reviews",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    submitReviewMutation.mutate(data);
  };

  // Calculate average rating
  const avgRating = reviews?.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  if (productLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="w-full md:w-1/2 aspect-square rounded-lg" />
              <div className="w-full md:w-1/2 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-40" />
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
          <div className="container mx-auto px-4 text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/products")}>Browse Products</Button>
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
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-primary">Home</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <a href="/products" className="hover:text-primary">Products</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">{product.name}</span>
          </div>

          {/* Product Detail */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Product Image */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-auto object-contain aspect-square" 
                />
              </div>
              
              {/* Additional Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-white rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${product.name} ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <StarRating rating={avgRating} />
                <span className="text-sm text-gray-500 ml-2">
                  {reviews?.length || 0} reviews
                </span>
              </div>
              
              {/* Price */}
              <p className="text-2xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
              
              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              {/* Condition */}
              <div className="mb-6">
                <span className="text-gray-600">Condition: </span>
                <span className="font-medium">{product.condition}</span>
              </div>
              
              {/* Seller */}
              {sellerLoading ? (
                <Skeleton className="h-12 w-full mb-6" />
              ) : seller ? (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                    {seller.avatar ? (
                      <img src={seller.avatar} alt={seller.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-gray-600 text-lg">{seller.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Sold by {seller.name}</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => navigate(`/sellers/${seller.id}`)}
                    >
                      View profile
                    </Button>
                  </div>
                </div>
              ) : null}
              
              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={handleBuyNow} 
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Processing..." : "Buy Now"}
                </Button>
                
                <Button size="lg" variant="outline" className="gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                
                <Button size="icon" variant="outline" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                
                {seller && user && seller.id !== user.id && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 ml-auto"
                    onClick={() => navigate(`/messages/${seller.id}`)}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Contact Seller
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="details" className="mb-12">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Product Details</h3>
                <div className="space-y-4">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Condition</h4>
                      <p>{product.condition}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Category</h4>
                      <p>{product.categoryId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Customer Reviews</h3>
                
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-4">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center mb-2">
                          <StarRating rating={review.rating} />
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}
                
                {/* Add Review Form */}
                {user && (
                  <div className="mt-8">
                    <h4 className="font-medium mb-4">Write a Review</h4>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-4">
                        <div className="flex items-center mb-2">
                          <span className="mr-2">Your Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => form.setValue('rating', star)}
                                className={`text-2xl ${
                                  star <= form.watch('rating') ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  placeholder="Share your thoughts about this product..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          disabled={submitReviewMutation.isPending}
                        >
                          {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <p>Standard shipping: 3-5 business days</p>
                  <p>Express shipping: 1-2 business days (additional fee)</p>
                  <p>Free shipping on orders over $50</p>
                  <p>Returns accepted within 30 days of delivery</p>
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
