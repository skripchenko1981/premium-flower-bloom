import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  Truck,
  ShieldCheck,
  Clock,
  Flower2,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/Layout";
import { getProductBySlug } from "@/lib/data/products";

const reviews = [
  { id: "1", userName: "Anna K.", rating: 5, text: "The most beautiful bouquet I've ever received! Flowers were fresh for almost 2 weeks.", createdAt: Date.now() - 86400000 * 3 },
  { id: "2", userName: "Maria S.", rating: 5, text: "Ordered for my mother's birthday. She was delighted! Beautiful packaging and fast delivery.", createdAt: Date.now() - 86400000 * 7 },
  { id: "3", userName: "Ivan P.", rating: 4, text: "Very beautiful bouquet, exactly as in the photo. Slightly smaller than expected but still gorgeous.", createdAt: Date.now() - 86400000 * 14 },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [withCard, setWithCard] = useState(false);
  const [cardMessage, setCardMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Try backend first
  const product = useQuery(api.shop.getProductBySlug, { slug: slug || "" });
  const data = product ?? getProductBySlug(slug || "");

  if (!data) {
    return (
      <div className="min-h-screen bg-[#fefdfb] flex items-center justify-center">
        <div className="text-center">
          <Flower2 className="w-16 h-16 text-rose-300 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-stone-800 font-serif">Товар не знайдено</h1>
          <Button onClick={() => navigate("/catalog")} className="mt-4 bg-rose-400 hover:bg-rose-500 text-white rounded-xl">
            До каталогу
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = data.sizes?.find((s: any) => s.name === selectedSize)?.price || data.price;

  return (
    <Layout>

      <section className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-stone-400 hover:text-rose-500 text-sm mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Назад
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={data.images?.[activeImage] || data.images?.[0]}
                    alt={data.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                {data.oldPrice && (
                  <Badge className="absolute top-4 left-4 bg-rose-400 text-white border-none text-sm px-3 py-1.5">
                    -{Math.round((1 - data.price / data.oldPrice) * 100)}%
                  </Badge>
                )}
              </div>
              {data.images?.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {data.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                        activeImage === i ? "border-rose-400" : "border-transparent hover:border-stone-200"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-2">
                {data.categoryName || data.category}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
                {data.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-stone-400">4.9 (128 відгуків)</span>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                {data.oldPrice && (
                  <span className="text-xl text-stone-300 line-through">₴{data.oldPrice}</span>
                )}
                <span className="text-3xl sm:text-4xl font-medium text-stone-800">₴{currentPrice}</span>
              </div>

              {/* Description */}
              <p className="mt-5 text-stone-500 leading-relaxed">{data.description}</p>

              {/* Sizes */}
              {data.sizes && (
                <div className="mt-8">
                  <label className="text-sm font-medium text-stone-700 mb-3 block">Розмір:</label>
                  <div className="flex flex-wrap gap-3">
                    {data.sizes.map((size: any) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={cn(
                          "px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                          selectedSize === size.name
                            ? "border-rose-400 bg-rose-50 text-rose-500"
                            : "border-stone-200 text-stone-600 hover:border-rose-200 hover:bg-rose-50/50"
                        )}
                      >
                        <div>{size.name}</div>
                        <div className="text-xs opacity-60 mt-0.5">{size.label}</div>
                        <div className="text-xs mt-0.5 font-medium">₴{size.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Greeting Card */}
              <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withCard}
                    onChange={(e) => setWithCard(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-rose-400 focus:ring-rose-400"
                  />
                  <Gift className="w-5 h-5 text-rose-400" />
                  <span className="text-sm font-medium text-stone-700">Додати листівку</span>
                  <span className="text-xs text-stone-400 ml-auto">+ ₴50</span>
                </label>
                {withCard && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3"
                  >
                    <Textarea
                      placeholder="Напишіть повідомлення..."
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value)}
                      className="text-sm border-stone-200 rounded-xl resize-none h-20"
                      maxLength={200}
                    />
                    <p className="text-[10px] text-stone-400 mt-1 text-right">{cardMessage.length}/200</p>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={() => setAddedToCart(true)}
                  className="flex-1 bg-stone-800 hover:bg-rose-400 text-white rounded-xl py-6 text-base font-normal transition-all duration-300 shadow-lg shadow-stone-200/50 hover:shadow-rose-200/50"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {addedToCart ? "Додано ✓" : "У кошик"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={cn(
                    "rounded-xl py-6 transition-all duration-300",
                    isWishlisted
                      ? "border-rose-400 text-rose-400 bg-rose-50"
                      : "border-stone-200 text-stone-500 hover:border-rose-200 hover:text-rose-500"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-stone-200 text-stone-500 rounded-xl py-6 transition-all hover:border-stone-300"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "Доставка сьогодні", sub: "від 2 годин" },
                  { icon: ShieldCheck, label: "Свіжість", sub: "100% гарантія" },
                  { icon: Clock, label: "Цілодобово", sub: "у будь-який час" },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <item.icon className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
                    <div className="text-xs font-medium text-stone-700">{item.label}</div>
                    <div className="text-[10px] text-stone-400">{item.sub}</div>
                  </div>
                ))}
              </div>

              {/* Care Tips */}
              {data.careTips && (
                <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100">
                  <h4 className="text-sm font-medium text-green-800 flex items-center gap-2">
                    <Flower2 className="w-4 h-4" />
                    Догляд за квітами
                  </h4>
                  <p className="text-xs text-green-700 mt-1.5 leading-relaxed">{data.careTips}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20">
            <h2 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight mb-8">
              Відгуки <span className="text-rose-400 italic">клієнтів</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                  <div className="flex mb-2">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">"{review.text}"</p>
                  <div className="mt-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-400 font-medium text-xs">
                      {review.userName[0]}
                    </div>
                    <span className="text-sm font-medium text-stone-700">{review.userName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <h2 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight mb-8">
              Вам також <span className="text-rose-400 italic">сподобається</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {["royal-velvet", "spring-symphony", "pearl-peony"].map((s) => {
                const rp = getProductBySlug(s);
                if (!rp || rp.slug === slug) return null;
                return (
                  <Link key={s} to={`/product/${rp.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img src={rp.images[0]} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] text-rose-400 font-medium uppercase tracking-wider">{rp.categoryName || rp.category}</div>
                      <h3 className="font-medium text-stone-800 text-sm mt-1">{rp.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {rp.oldPrice && <span className="text-xs text-stone-300 line-through">₴{rp.oldPrice}</span>}
                        <span className="font-medium text-stone-800">₴{rp.price}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
