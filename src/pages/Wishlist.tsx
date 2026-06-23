import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { demoWishlistItems } from "@/lib/data/products";

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState(demoWishlistItems);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <Layout showFooter={false}>
      <section className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-2"
          >
            <Heart className="w-7 h-7 text-rose-400" />
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Обрані <span className="text-rose-400 italic">букети</span>
            </h1>
          </motion.div>
          <p className="text-stone-400 text-sm mb-8">
            {items.length} {items.length === 1 ? "букет" : "букетів"} у списку бажань
          </p>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h2 className="text-xl font-light text-stone-800 font-serif">Список бажань порожній</h2>
              <p className="text-stone-400 mt-1 mb-6">Зберігайте улюблені букети, щоб не забути</p>
              <Button onClick={() => navigate("/catalog")} className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl">
                Переглянути каталог
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    layout
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-1"
                  >
                    <Link to={`/product/${item.productId}`} className="block relative aspect-[4/5] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      {item.oldPrice && (
                        <Badge className="absolute top-3 left-3 bg-rose-400 text-white border-none text-xs">
                          -{Math.round((1 - item.price / item.oldPrice) * 100)}%
                        </Badge>
                      )}
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <Badge className="bg-stone-200 text-stone-600 border-none text-sm px-4 py-2">
                            Немає в наявності
                          </Badge>
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <div className="text-[10px] text-rose-400 font-medium uppercase tracking-wider mb-1">
                        {item.category}
                      </div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="block font-medium text-stone-800 hover:text-rose-500 transition-colors text-base"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1.5 flex items-center gap-2">
                        {item.oldPrice && (
                          <span className="text-xs text-stone-300 line-through">₴{item.oldPrice}</span>
                        )}
                        <span className="text-lg font-medium text-stone-800">₴{item.price}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          disabled={!item.inStock}
                          onClick={() => navigate(`/product/${item.productId}`)}
                          className="flex-1 bg-stone-800 hover:bg-rose-400 text-white rounded-xl text-xs transition-all duration-300"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                          У кошик
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(item._id)}
                          className="px-3 border-stone-200 text-stone-400 hover:text-red-400 hover:border-red-200 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-rose-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Продовжити покупки
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
