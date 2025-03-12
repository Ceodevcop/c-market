import { useState } from "react";
import { useLocation } from "wouter";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StarRating from "./ui/star-rating";
import { Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const createOrderMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/orders", { productId });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: "Product added to your cart successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product to cart",
        variant: "destructive",
      });
    }
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    createOrderMutation.mutate(product.id);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "Product removed from your favorites" 
        : "Product added to your favorites",
    });
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden pb-[75%]">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Action Buttons */}
          <div className="absolute top-2 right-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-white shadow-sm text-gray-500 hover:text-primary focus:outline-none"
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
            </Button>
          </div>
          
          {/* Badges */}
          {(product.trending || product.featured) && (
            <div className="absolute top-2 left-2">
              {product.trending && (
                <Badge variant="secondary" className="mb-1 block">HOT</Badge>
              )}
              {product.featured && (
                <Badge>Featured</Badge>
              )}
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center mb-3">
            <StarRating rating={4.5} />
            <span className="text-xs text-gray-500 ml-1">(42)</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-9 w-9 p-0 hover:bg-gray-100"
              onClick={handleAddToCart}
              disabled={createOrderMutation.isPending}
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
