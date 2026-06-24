import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect, lazy, Suspense, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import "./types/global.d.ts";

// ─── Clean Architecture DI ─────────────────────────────────────────────────
import { DiProvider } from "@/core/di/container";
import { ProductRepository } from "@/core/repositories/product.repository";
import { CategoryRepository } from "@/core/repositories/category.repository";
import { CartRepository } from "@/core/repositories/cart.repository";
import { OrderRepository } from "@/core/repositories/order.repository";
import { ReviewRepository } from "@/core/repositories/review.repository";
import { UserRepository } from "@/core/repositories/user.repository";
import { PromocodeRepository } from "@/core/repositories/promocode.repository";
import { ContactRepository } from "@/core/repositories/contact.repository";
import { ProductService } from "@/core/services/product.service";
import { CategoryService } from "@/core/services/category.service";
import { CartService } from "@/core/services/cart.service";
import { OrderService } from "@/core/services/order.service";
import { ReviewService } from "@/core/services/review.service";
import { UserService } from "@/core/services/user.service";
import { PromocodeService } from "@/core/services/promocode.service";
import { ContactService } from "@/core/services/contact.service";


// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Catalog = lazy(() => import("./pages/Catalog.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const DeliveryPayment = lazy(() => import("./pages/DeliveryPayment.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const Contacts = lazy(() => import("./pages/Contacts.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


function AppWithDi() {
  const deps = useMemo(() => {
    const productRepo = new ProductRepository();
    const categoryRepo = new CategoryRepository();
    const cartRepo = new CartRepository();
    const orderRepo = new OrderRepository();
    const reviewRepo = new ReviewRepository();
    const userRepo = new UserRepository();
    const promocodeRepo = new PromocodeRepository();
    const contactRepo = new ContactRepository();

    const categoryService = new CategoryService(categoryRepo);
    const productService = new ProductService(productRepo, categoryRepo);

    return {
      productRepository: productRepo,
      categoryRepository: categoryRepo,
      cartRepository: cartRepo,
      orderRepository: orderRepo,
      reviewRepository: reviewRepo,
      userRepository: userRepo,
      promocodeRepository: promocodeRepo,
      contactRepository: contactRepo,
      productService,
      categoryService,
      cartService: new CartService(cartRepo),
      orderService: new OrderService(orderRepo),
      reviewService: new ReviewService(reviewRepo),
      userService: new UserService(userRepo),
      promocodeService: new PromocodeService(promocodeRepo),
      contactService: new ContactService(contactRepo),
    };
  }, []);

  return (
    <DiProvider dependencies={deps}>
      <StrictMode>
        <VlyToolbar />
        <InstrumentationProvider>
          <ConvexAuthProvider client={convex}>
            <BrowserRouter>
              <RouteSyncer />
              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<AuthPage redirectAfterAuth="/" />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/delivery" element={<DeliveryPayment />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/auth/redirect" element={<AuthPage redirectAfterAuth="/account" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster />
          </ConvexAuthProvider>
        </InstrumentationProvider>
      </StrictMode>
    </DiProvider>
  );
}

createRoot(document.getElementById("root")!).render(<AppWithDi />);
