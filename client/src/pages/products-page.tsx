import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product, Category } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  SlidersHorizontal,
  X
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductsPage() {
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [condition, setCondition] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [open, setOpen] = useState(false);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const conditionOptions = ["New", "Like New", "Good", "Fair", "Poor"];

  // Filter and sort products
  const filteredProducts = products
    ? products.filter((product) => {
        // Search filter
        const matchesSearch = searchQuery === "" || 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category filter
        const matchesCategory = categoryFilter.length === 0 || 
          categoryFilter.includes(product.categoryId);
        
        // Price filter
        const matchesPrice = product.price >= priceRange[0] && 
          product.price <= priceRange[1];
        
        // Condition filter
        const matchesCondition = condition.length === 0 || 
          condition.includes(product.condition);
        
        return matchesSearch && matchesCategory && matchesPrice && matchesCondition;
      })
    : [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Already filtered by searchQuery state
  }

  function handleCategoryChange(id: number) {
    setCategoryFilter(prev => 
      prev.includes(id) 
        ? prev.filter(catId => catId !== id) 
        : [...prev, id]
    );
  }

  function handleConditionChange(value: string) {
    setCondition(prev => 
      prev.includes(value) 
        ? prev.filter(c => c !== value) 
        : [...prev, value]
    );
  }

  function resetFilters() {
    setCategoryFilter([]);
    setPriceRange([0, 1000]);
    setCondition([]);
    setSortBy("newest");
    setSearchQuery("");
  }

  const maxPrice = products ? Math.max(...products.map(p => p.price), 1000) : 1000;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">All Products</h1>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="md:hidden" onClick={() => setOpen(true)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="hidden md:block">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filters */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-3">Search</h3>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                    <Button type="submit" size="icon" variant="ghost">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
                
                <Accordion type="multiple" defaultValue={["categories", "price", "condition"]}>
                  <AccordionItem value="categories">
                    <AccordionTrigger className="font-medium">Categories</AccordionTrigger>
                    <AccordionContent>
                      {categoriesLoading ? (
                        <div className="space-y-2">
                          {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-5 w-full" />
                          ))}
                        </div>
                      ) : categories ? (
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center">
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={categoryFilter.includes(category.id)}
                                onCheckedChange={() => handleCategoryChange(category.id)}
                              />
                              <label
                                htmlFor={`category-${category.id}`}
                                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="price">
                    <AccordionTrigger className="font-medium">Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={[0, maxPrice]}
                          max={maxPrice}
                          step={1}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange([value[0], value[1]])}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm">${priceRange[0]}</span>
                          <span className="text-sm">${priceRange[1]}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="condition">
                    <AccordionTrigger className="font-medium">Condition</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {conditionOptions.map((option) => (
                          <div key={option} className="flex items-center">
                            <Checkbox
                              id={`condition-${option}`}
                              checked={condition.includes(option)}
                              onCheckedChange={() => handleConditionChange(option)}
                            />
                            <label
                              htmlFor={`condition-${option}`}
                              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Mobile Filters Sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent side="left" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Sort By</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Search</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Accordion type="multiple" defaultValue={["categories", "price", "condition"]}>
                    <AccordionItem value="categories">
                      <AccordionTrigger className="font-medium">Categories</AccordionTrigger>
                      <AccordionContent>
                        {categoriesLoading ? (
                          <div className="space-y-2">
                            {[...Array(6)].map((_, i) => (
                              <Skeleton key={i} className="h-5 w-full" />
                            ))}
                          </div>
                        ) : categories ? (
                          <div className="space-y-2">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center">
                                <Checkbox
                                  id={`mobile-category-${category.id}`}
                                  checked={categoryFilter.includes(category.id)}
                                  onCheckedChange={() => handleCategoryChange(category.id)}
                                />
                                <label
                                  htmlFor={`mobile-category-${category.id}`}
                                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="price">
                      <AccordionTrigger className="font-medium">Price Range</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Slider
                            defaultValue={[0, maxPrice]}
                            max={maxPrice}
                            step={1}
                            value={priceRange}
                            onValueChange={(value) => setPriceRange([value[0], value[1]])}
                          />
                          <div className="flex justify-between">
                            <span className="text-sm">${priceRange[0]}</span>
                            <span className="text-sm">${priceRange[1]}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="condition">
                      <AccordionTrigger className="font-medium">Condition</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {conditionOptions.map((option) => (
                            <div key={option} className="flex items-center">
                              <Checkbox
                                id={`mobile-condition-${option}`}
                                checked={condition.includes(option)}
                                onCheckedChange={() => handleConditionChange(option)}
                              />
                              <label
                                htmlFor={`mobile-condition-${option}`}
                                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <SheetFooter className="flex-row gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button className="flex-1" onClick={() => setOpen(false)}>
                    Apply
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {/* Products */}
            <div className="flex-1">
              {/* Applied Filters */}
              {(categoryFilter.length > 0 || condition.length > 0 || searchQuery || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Applied Filters:</h3>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                        Search: {searchQuery}
                        <button onClick={() => setSearchQuery("")} className="ml-2">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    {categoryFilter.length > 0 && categories && (
                      categoryFilter.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? (
                          <div key={category.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                            Category: {category.name}
                            <button onClick={() => handleCategoryChange(category.id)} className="ml-2">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : null;
                      })
                    )}
                    
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                        Price: ${priceRange[0]} - ${priceRange[1]}
                        <button onClick={() => setPriceRange([0, maxPrice])} className="ml-2">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    {condition.map(cond => (
                      <div key={cond} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                        Condition: {cond}
                        <button onClick={() => handleConditionChange(cond)} className="ml-2">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    <Button variant="link" size="sm" onClick={resetFilters} className="text-primary">
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Products Count */}
              <div className="mb-6">
                <p className="text-gray-500">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              
              {/* Products Grid */}
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
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
              ) : sortedProducts.length > 0 ? (
                <ProductGrid products={sortedProducts} />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
