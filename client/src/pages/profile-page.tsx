import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Order, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Package, 
  Settings, 
  User, 
  LogOut, 
  Edit, 
  Trash2, 
  Plus, 
  ShoppingBag,
  Store,
  AlertCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductGrid from "@/components/product-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  isSeller: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const [_, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const { data: userProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/sellers/${user?.id}/products`],
    enabled: !!user?.id && user.isSeller
  });

  const { data: userOrders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user?.id
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
      isSeller: user?.isSeller || false,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/users/profile", data);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.setQueryData(["/api/user"], updatedUser);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/sellers/${user?.id}/products`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
  }

  function handleDeleteProduct(productId: number) {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProductMutation.mutate(productId);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                Please log in to view your profile.
              </AlertDescription>
              <div className="mt-4">
                <Button onClick={() => navigate("/auth")}>
                  Go to Login
                </Button>
              </div>
            </Alert>
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
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                      <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                    {user.isSeller && (
                      <Badge className="mt-2" variant="secondary">Seller</Badge>
                    )}
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#orders">
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </a>
                    </Button>
                    
                    {user.isSeller && (
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <a href="#products">
                          <Store className="mr-2 h-4 w-4" />
                          My Products
                        </a>
                      </Button>
                    )}
                    
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                      </a>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="orders">
                <TabsList className="mb-6">
                  <TabsTrigger value="orders">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  
                  {user.isSeller && (
                    <TabsTrigger value="products">
                      <Store className="mr-2 h-4 w-4" />
                      My Products
                    </TabsTrigger>
                  )}
                  
                  <TabsTrigger value="settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                {/* Orders Tab */}
                <TabsContent value="orders" id="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Orders</CardTitle>
                      <CardDescription>
                        View and manage your orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {ordersLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12 rounded-md" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-8 w-24 ml-auto" />
                            </div>
                          ))}
                        </div>
                      ) : userOrders && userOrders.length > 0 ? (
                        <div className="space-y-4">
                          {userOrders.map((order) => (
                            <div key={order.id} className="flex items-center border rounded-md p-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                                <ShoppingBag className="h-8 w-8 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">Order #{order.id}</h4>
                                <p className="text-sm text-gray-500">
                                  Product ID: {order.productId}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge 
                                variant={
                                  order.status === "delivered" ? "success" : 
                                  order.status === "shipped" ? "default" : 
                                  order.status === "pending" ? "secondary" : 
                                  "destructive"
                                }
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                            <Package className="h-6 w-6 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                          <Button onClick={() => navigate("/products")}>
                            Browse Products
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Products Tab (Sellers only) */}
                {user.isSeller && (
                  <TabsContent value="products" id="products">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>My Products</CardTitle>
                          <CardDescription>
                            Manage your product listings
                          </CardDescription>
                        </div>
                        <Button onClick={() => navigate("/create-listing")}>
                          <Plus className="mr-2 h-4 w-4" />
                          New Listing
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {productsLoading ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                            ))}
                          </div>
                        ) : userProducts && userProducts.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {userProducts.map((product) => (
                              <Card key={product.id}>
                                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-medium truncate">{product.name}</h3>
                                  <p className="text-sm text-gray-500 truncate">{product.description}</p>
                                  <p className="font-medium text-primary mt-2">${product.price.toFixed(2)}</p>
                                  
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <Badge variant="outline">{product.condition}</Badge>
                                    {product.trending && <Badge variant="secondary">Trending</Badge>}
                                    {product.featured && <Badge>Featured</Badge>}
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between p-4 pt-0">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-blue-600"
                                    onClick={() => navigate(`/products/${product.id}`)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    disabled={deleteProductMutation.isPending}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                              <Store className="h-6 w-6 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No products yet</h3>
                            <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
                            <Button onClick={() => navigate("/create-listing")}>
                              Create Your First Listing
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
                
                {/* Settings Tab */}
                <TabsContent value="settings" id="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Update your account information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Profile Picture URL</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://..." />
                                </FormControl>
                                <FormDescription>
                                  Enter a URL for your profile picture
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Tell us about yourself"
                                  />
                                </FormControl>
                                <FormDescription>
                                  This will be displayed on your profile
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isSeller"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Seller Account</FormLabel>
                                  <FormDescription>
                                    Enable this to sell products on Central-M
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Used in render
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
