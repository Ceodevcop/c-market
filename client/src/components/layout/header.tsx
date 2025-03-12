import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Category } from "@shared/schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu,
  Store,
  Package,
  Settings,
  LogOut
} from "lucide-react";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white shadow-sm'} transition-all duration-200`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-primary text-2xl font-bold">Central-M</span>
            </a>
          </div>

          {/* Search Bar - Hidden on mobile, visible on larger screens */}
          <div className="hidden md:flex flex-1 mx-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg">
              <Input
                type="text"
                placeholder="Search for products"
                className="w-full pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute left-0 top-0 h-full px-3"
              >
                <Search className="h-4 w-4 text-gray-400" />
              </Button>
            </form>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="hidden sm:inline-block text-gray-700 hover:text-primary"
              onClick={() => navigate("/create-listing")}
            >
              <span>Sell</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-primary"
              onClick={() => navigate("/favorites")}
            >
              <span className="sr-only">Favorites</span>
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-primary relative"
              onClick={() => navigate("/cart")}
            >
              <span className="sr-only">Cart</span>
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                0
              </Badge>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile#orders")}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </DropdownMenuItem>
                  {user.isSeller && (
                    <DropdownMenuItem onClick={() => navigate("/profile#products")}>
                      <Store className="mr-2 h-4 w-4" />
                      <span>My Products</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/profile#settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-primary"
                onClick={() => navigate("/auth")}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/products");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Products
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/create-listing");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sell
                  </Button>
                  {!user && (
                    <Button
                      variant="default"
                      className="w-full mt-2"
                      onClick={() => {
                        navigate("/auth");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                  {user && (
                    <>
                      <div className="pt-2 pb-2">
                        <div className="text-sm font-medium text-gray-500">Account</div>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate("/profile");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate("/profile#orders");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </Button>
                      {user.isSeller && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate("/profile#products");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Store className="mr-2 h-4 w-4" />
                          My Products
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search - Only visible on mobile */}
        <div className="py-2 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Search for products"
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute left-0 top-0 h-full px-3"
            >
              <Search className="h-4 w-4 text-gray-400" />
            </Button>
          </form>
        </div>

        {/* Categories Navigation */}
        <nav className="py-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <div className="flex space-x-6">
            {categories?.map((category) => (
              <a
                key={category.id}
                href={`/categories/${category.slug}/products`}
                className="text-gray-700 hover:text-primary text-sm font-medium"
              >
                {category.name}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
