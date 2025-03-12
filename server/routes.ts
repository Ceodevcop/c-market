import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertProductSchema, insertReviewSchema, insertMessageSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // ==== Product Routes ====
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to get products" });
    }
  });

  // Get featured products
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to get featured products" });
    }
  });

  // Get trending products
  app.get("/api/products/trending", async (req, res) => {
    try {
      const products = await storage.getTrendingProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to get trending products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to get product" });
    }
  });

  // Get products by category
  app.get("/api/categories/:categoryId/products", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to get products by category" });
    }
  });

  // Get products by seller
  app.get("/api/sellers/:sellerId/products", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const products = await storage.getProductsBySeller(sellerId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to get products by seller" });
    }
  });

  // Search products
  app.get("/api/products/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to search products" });
    }
  });

  // Create new product (authenticated & seller only)
  app.post("/api/products", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = req.user;
      if (!user.isSeller) {
        return res.status(403).json({ error: "Seller account required" });
      }

      const productData = insertProductSchema.parse({
        ...req.body,
        sellerId: user.id
      });

      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Update product (authenticated & seller only)
  app.put("/api/products/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const user = req.user;
      if (product.sellerId !== user.id) {
        return res.status(403).json({ error: "You don't have permission to update this product" });
      }

      const updatedProduct = await storage.updateProduct(id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Delete product (authenticated & seller only)
  app.delete("/api/products/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const user = req.user;
      if (product.sellerId !== user.id) {
        return res.status(403).json({ error: "You don't have permission to delete this product" });
      }

      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ==== Category Routes ====
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to get categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to get category" });
    }
  });

  // ==== Review Routes ====
  
  // Get reviews by product
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getReviewsByProduct(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  // Create review (authenticated only)
  app.post("/api/products/:productId/reviews", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const productId = parseInt(req.params.productId);
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId: req.user.id
      });

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // ==== Order Routes ====
  
  // Get orders for the current user
  app.get("/api/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const orders = await storage.getOrdersByUser(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  // Get seller orders (authenticated & seller only)
  app.get("/api/seller/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = req.user;
      if (!user.isSeller) {
        return res.status(403).json({ error: "Seller account required" });
      }

      const orders = await storage.getOrdersBySeller(user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to get seller orders" });
    }
  });

  // Create order (authenticated only)
  app.post("/api/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const productId = req.body.productId;
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const orderData = insertOrderSchema.parse({
        userId: req.user.id,
        productId,
        sellerId: product.sellerId,
        status: "pending"
      });

      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Update order status (authenticated & seller only)
  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !["pending", "shipped", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // ==== Message Routes ====
  
  // Get messages between users
  app.get("/api/messages/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = parseInt(req.params.userId);
      const messages = await storage.getMessagesBetweenUsers(req.user.id, userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  // Send message (authenticated only)
  app.post("/api/messages", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user.id,
        read: false
      });

      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Mark message as read (authenticated only)
  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      const success = await storage.markMessageAsRead(id);
      
      if (!success) {
        return res.status(404).json({ error: "Message not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // ==== User Profile Routes ====

  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Remove sensitive information
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user profile" });
    }
  });

  // Update user profile (authenticated)
  app.put("/api/users/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { name, email, bio, avatar, isSeller } = req.body;
      const updateData: any = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (bio !== undefined) updateData.bio = bio;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (isSeller !== undefined) updateData.isSeller = isSeller;

      const updatedUser = await storage.updateUser(req.user.id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Update the session
      req.login(updatedUser, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update session" });
        }
        res.json(updatedUser);
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Get all sellers
  app.get("/api/sellers", async (req, res) => {
    try {
      const sellers = await storage.getSellers();
      
      // Remove sensitive information
      const safeSellers = sellers.map(({ password, ...seller }) => seller);
      res.json(safeSellers);
    } catch (error) {
      res.status(500).json({ error: "Failed to get sellers" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
