import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Gift,
  Package,
  Truck,
  Percent,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const demoCartItems = [
  {
    _id: "c1",
    productId: "1",
    productName: "Pink Dream",
    productImage: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=400&q=80",
    price: 1299,
    quantity: 1,
    size: "M",
    withCard: false,
  },
  {
    _id: "c2",
    productId: "2",
    productName: "Royal Velvet",
    productImage: "https://images.unsplash.com/photo-1548586196-aa5823b77379?w=400&q=80",
    price: 1899,
    quantity: 2,
    size: "L",
    withCard: true,
  },
];

export default function Cart() {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [useLocalData, setUseLocalData] = useState(true);

  const cartItems = useQuery(api.shop.getCartItems);
  const updateQuantity = useMutation(api.shop.updateCartItemQuantity);
  const removeItem = useMutation(api.shop.removeFromCart);

  const items = cartItems && cartItems.length > 0 ? cartItems.map((item: any) => ({
    ...item,
    productName: "Product",
    productImage: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80",
    size: item.size || "M",
    price: 1299,
  })) : demoCartItems;

  const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * (promoDiscount / 100)) : 0;
  const shippingCost = subtotal > 2000 ? 0 : 150;
  const total = subtotal - discount + shippingCost;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      // Check common promocodes locally
      if (promoCode.toUpperCase() === "FLOWER10") {
        setPromoDiscount(10);
        setPromoApplied(true);
      } else if (promoCode.toUpperCase() === "LOVE15") {
        setPromoDiscount(15);
        setPromoApplied(true);
      } else {
        setPromoError("Invalid promocode");
      }
    } catch {
      setPromoError("Invalid promocode");
    }
    setPromoLoading(false);
  };

  const handleQuantity = (id: string, qty: number) => {
    if (useLocalData) return;
    updateQuantity({ cartItemId: id as any, quantity: qty });
  };

  const handleRemove = (id: string) => {
    if (useLocalData) return;
    removeItem({ cartItemId: id as any });
  };

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <Navbar />

      <section className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Your <span className="text-rose-400 italic">Cart</span>
            </h1>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h2 className="text-xl font-light text-stone-800 font-serif">Your cart is empty</h2>
              <p className="text-stone-400 mt-1 mb-6">Add beautiful bouquets to get started</p>
              <Button onClick={() => navigate("/catalog")} className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl">
                Browse Catalog
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item: any) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="flex gap-4 sm:gap-6 bg-white rounded-2xl border border-stone-100 p-4 sm:p-5 shadow-sm"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-stone-800 text-base sm:text-lg">
                          {item.productName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                          <span className="bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100">
                            Size: {item.size}
                          </span>
                          {item.withCard && (
                            <span className="bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
                              <Gift className="w-3 h-3" /> Card
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-stone-50 rounded-full p-0.5">
                            <button
                              onClick={() => handleQuantity(item._id, item.quantity - 1)}
                              className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
                            >
                              <Minus className="w-3.5 h-3.5 text-stone-500" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-stone-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantity(item._id, item.quantity + 1)}
                              className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
                            >
                              <Plus className="w-3.5 h-3.5 text-stone-500" />
                            </button>
                          </div>
                          <span className="text-lg font-medium text-stone-800">
                            ₴{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="self-start p-2 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-all shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-rose-500 transition-colors mt-4">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Summary */}
              <div>
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm sticky top-24">
                  <h3 className="text-lg font-medium text-stone-800 mb-5">Order Summary</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Subtotal ({items.length} items)</span>
                      <span className="text-stone-700 font-medium">₴{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({promoDiscount}%)</span>
                        <span>-₴{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone-500 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" /> Delivery
                      </span>
                      <span className="text-stone-700 font-medium">
                        {shippingCost === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `₴${shippingCost}`
                        )}
                      </span>
                    </div>
                    {subtotal < 2000 && shippingCost > 0 && (
                      <p className="text-[10px] text-stone-400">
                        Free delivery for orders over ₴2,000
                      </p>
                    )}
                    <hr className="border-stone-100" />
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-stone-800">Total</span>
                      <span className="text-stone-900">₴{total}</span>
                    </div>
                  </div>

                  {/* Promocode */}
                  <div className="mt-5">
                    {!promoApplied ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <Input
                            value={promoCode}
                            onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                            placeholder="Promocode"
                            className="pl-9 h-10 text-sm rounded-xl border-stone-200"
                          />
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleApplyPromo}
                          disabled={!promoCode.trim() || promoLoading}
                          className="border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-200 rounded-xl h-10"
                        >
                          {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-2.5 border border-green-100">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <Check className="w-4 h-4" />
                          <span className="font-medium">{promoCode.toUpperCase()}</span>
                          <span>-{promoDiscount}%</span>
                        </div>
                        <button
                          onClick={() => { setPromoApplied(false); setPromoCode(""); setPromoDiscount(0); }}
                          className="text-green-500 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-xs text-red-400 mt-1.5">{promoError}</p>
                    )}
                    {!promoApplied && !promoError && (
                      <p className="text-[10px] text-stone-400 mt-1.5">
                        Try: FLOWER10 or LOVE15
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => navigate("/checkout")}
                    size="lg"
                    className="w-full mt-6 bg-stone-800 hover:bg-rose-400 text-white rounded-xl py-6 text-base font-normal transition-all duration-300"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <div className="mt-4 flex items-center gap-2 justify-center text-xs text-stone-400">
                    <Package className="w-3.5 h-3.5" />
                    Secure packaging & guaranteed freshness
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
