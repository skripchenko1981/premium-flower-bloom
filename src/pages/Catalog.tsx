import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  SlidersHorizontal,
  X,
  ShoppingCart,
  Heart,
  ChevronDown,
  Star,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const categoriesList = [
  { name: "Усі", slug: "" },
  { name: "Троянди", slug: "roses" },
  { name: "Тюльпани", slug: "tulips" },
  { name: "Півонії", slug: "peonies" },
  { name: "Орхідеї", slug: "orchids" },
  { name: "Весілля", slug: "wedding" },
  { name: "Авторські", slug: "author" },
  { name: "Рослини", slug: "plants" },
  { name: "Подарунки", slug: "gifts" },
];

const sortOptions = [
  { label: "Новинки", value: "" },
  { label: "Ціна: Низька–Висока", value: "price-asc" },
  { label: "Ціна: Висока–Низька", value: "price-desc" },
  { label: "Назва: А–Я", value: "name" },
];

const productImages = {
  roses: "https://images.unsplash.com/photo-1548586196-aa5823b77379?w=600&q=80",
  tulips: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=600&q=80",
  peonies: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600&q=80",
  orchids: "https://images.unsplash.com/photo-1524592527185-606a436cc4a6?w=600&q=80",
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  author: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&q=80",
  plants: "https://images.unsplash.com/photo-1483794344563-d27a8d18014e?w=600&q=80",
  gifts: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
  default: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80",
};

// Demo products until backend has real data
const demoProducts = [
  { _id: "1", name: "Pink Dream", slug: "pink-dream", price: 1299, oldPrice: 1599, category: "author", images: [productImages.author], inStock: true, featured: true, popular: true, description: "Delicate bouquet of pink roses", sizes: [{ name: "S", price: 999 }, { name: "M", price: 1299 }, { name: "L", price: 1699 }] },
  { _id: "2", name: "Royal Velvet", slug: "royal-velvet", price: 1899, category: "roses", images: [productImages.roses], inStock: true, featured: true, popular: true, description: "25 red Ecuadorian roses", sizes: [{ name: "M", price: 1899 }, { name: "L", price: 2399 }] },
  { _id: "3", name: "Spring Symphony", slug: "spring-symphony", price: 899, oldPrice: 1199, category: "tulips", images: [productImages.tulips], inStock: true, popular: true, description: "Mix of colorful tulips", sizes: [{ name: "S", price: 699 }, { name: "M", price: 899 }] },
  { _id: "4", name: "Pearl Peony", slug: "pearl-peony", price: 1499, category: "peonies", images: [productImages.peonies], inStock: true, featured: true, description: "Delicate peony arrangement", sizes: [{ name: "M", price: 1499 }, { name: "L", price: 1999 }] },
  { _id: "5", name: "White Orchid", slug: "white-orchid", price: 2199, oldPrice: 2699, category: "orchids", images: [productImages.orchids], inStock: true, featured: true, description: "Premium phalaenopsis orchid", sizes: [{ name: "M", price: 2199 }, { name: "L", price: 2799 }] },
  { _id: "6", name: "Bride's Dream", slug: "brides-dream", price: 3499, category: "wedding", images: [productImages.wedding], inStock: true, popular: true, description: "Luxurious wedding bouquet", sizes: [{ name: "M", price: 3499 }, { name: "L", price: 4499 }] },
  { _id: "7", name: "Ficus Elegance", slug: "ficus-elegance", price: 799, category: "plants", images: [productImages.plants], inStock: true, description: "Beautiful indoor ficus plant", sizes: [{ name: "S", price: 799 }] },
  { _id: "8", name: "Gift Box Deluxe", slug: "gift-box-deluxe", price: 1599, category: "gifts", images: [productImages.gifts], inStock: true, featured: true, description: "Premium gift set with flowers", sizes: [{ name: "M", price: 1599 }] },
  { _id: "9", name: "Scarlet Passion", slug: "scarlet-passion", price: 2499, category: "roses", images: ["https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80"], inStock: true, description: "51 red roses in a box", sizes: [{ name: "L", price: 2499 }] },
  { _id: "10", name: "Tulip Fields", slug: "tulip-fields", price: 1099, category: "tulips", images: ["https://images.unsplash.com/photo-1508610041839-e022ab75315e?w=600&q=80"], inStock: true, description: "Dutch tulip arrangement", sizes: [{ name: "M", price: 1099 }] },
  { _id: "11", name: "Lavender Dreams", slug: "lavender-dreams", price: 1799, category: "author", images: ["https://images.unsplash.com/photo-1599733589046-10c7f0c3e069?w=600&q=80"], inStock: true, description: "Florist's signature arrangement", sizes: [{ name: "M", price: 1799 }, { name: "L", price: 2299 }] },
  { _id: "12", name: "Tropical Paradise", slug: "tropical-paradise", price: 2899, category: "orchids", images: ["https://images.unsplash.com/photo-1534885320675-b08aa131cc5e?w=600&q=80"], inStock: false, description: "Exotic orchid arrangement", sizes: [{ name: "L", price: 2899 }] },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState(true);

  // Try real data first
  const backendProducts = useQuery(api.shop.getProducts, {
    category: activeCategory || undefined,
    search: search || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
    sortBy: sortBy || undefined,
  });

  const products = backendProducts && backendProducts.length > 0 ? backendProducts : demoProducts;

  // Filter demo products when backend is empty
  const filteredProducts = backendProducts && backendProducts.length > 0
    ? products
    : demoProducts.filter((p) => {
        if (activeCategory && p.category !== activeCategory) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description?.toLowerCase().includes(search.toLowerCase())) return false;
        if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
        return true;
      }).sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (search) params.set("search", search);
    setSearchParams(params, { replace: true });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 sm:pt-32 sm:pb-12 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              Наш <span className="text-rose-400 italic">Каталог</span>
            </h1>
            <p className="mt-2 text-stone-500">
              {filteredProducts.length} букетів та квіткових композицій
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-none">
            {/* Category pills */}
            {categoriesList.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeCategory === cat.slug
                    ? "bg-rose-400 text-white shadow-sm"
                    : "bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-500"
                )}
              >
                {cat.name}
              </button>
            ))}

            <div className="w-px h-6 bg-stone-200 shrink-0" />

            {/* Sort */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-stone-50 text-sm font-medium text-stone-600 pl-4 pr-8 py-2 rounded-full border-none outline-none cursor-pointer hover:bg-rose-50 hover:text-rose-500 transition-all"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex bg-stone-50 rounded-full p-0.5 shrink-0">
              <button
                onClick={() => setGridView(true)}
                className={cn("p-1.5 rounded-full transition-all", gridView ? "bg-white shadow-sm" : "")}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridView(false)}
                className={cn("p-1.5 rounded-full transition-all", !gridView ? "bg-white shadow-sm" : "")}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "shrink-0 p-2 rounded-full transition-all",
                showFilters ? "bg-rose-100 text-rose-500" : "bg-stone-50 text-stone-500 hover:bg-rose-50 hover:text-rose-500"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Extended Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="py-4 border-t border-stone-100 flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-stone-400 font-medium mb-1.5 block">Ціна: від</label>
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="h-10 rounded-xl border-stone-200"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-stone-400 font-medium mb-1.5 block">Ціна: до</label>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="h-10 rounded-xl border-stone-200"
                      placeholder="5000"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => { setPriceRange([0, 5000]); setSortBy(""); }}
                    className="text-stone-400 hover:text-rose-500"
                  >
                    Скинути все
                    <X className="ml-1 w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-400 text-lg">Товарів не знайдено.</p>
              <Button
                variant="link"
                onClick={() => { setActiveCategory(""); setSearch(""); setPriceRange([0, 5000]); }}
                className="text-rose-400 mt-2"
              >
                Очистити фільтри
              </Button>
            </div>
          ) : gridView ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <ProductCard product={product} categoriesList={categoriesList} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <ProductRow product={product} categoriesList={categoriesList} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, categoriesList }: { product: any; categoriesList: any[] }) {
  const catName = categoriesList.find((c) => c.slug === product.category)?.name || product.category;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-1">
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images?.[0] || productImages.default}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        {product.oldPrice && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-rose-400 text-white border-none text-xs">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </Badge>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Badge className="bg-stone-200 text-stone-600 border-none text-sm px-4 py-2">
              Немає в наявності
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button size="icon" variant="secondary" className="rounded-full bg-white/90 hover:bg-white shadow-md h-9 w-9">
            <Heart className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      </Link>
      <div className="p-4">
        <div className="text-[10px] text-rose-400 font-medium mb-1 uppercase tracking-wider">{catName}</div>
        <Link to={`/product/${product.slug}`} className="block font-medium text-stone-800 hover:text-rose-500 transition-colors text-sm sm:text-base line-clamp-1">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          {product.oldPrice && <span className="text-xs text-stone-300 line-through">₴{product.oldPrice}</span>}
          <span className="text-base sm:text-lg font-medium text-stone-800">₴{product.price}</span>
        </div>
        {product.sizes && (
          <div className="mt-2 flex gap-1">
            {product.sizes.map((s: any) => (
              <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-50 text-stone-400 border border-stone-100">{s.name}</span>
            ))}
          </div>
        )}
        <Button className="w-full mt-3 bg-stone-800 hover:bg-rose-400 text-white rounded-xl transition-all duration-300 text-xs sm:text-sm" size="sm">
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          У кошик
        </Button>
      </div>
    </div>
  );
}

function ProductRow({ product, categoriesList }: { product: any; categoriesList: any[] }) {
  const catName = categoriesList.find((c) => c.slug === product.category)?.name || product.category;
  return (
    <div className="flex items-center gap-4 sm:gap-6 bg-white rounded-2xl border border-stone-100 p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden">
        <img src={product.images?.[0] || productImages.default} alt={product.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-rose-400 font-medium uppercase tracking-wider">{catName}</div>
        <Link to={`/product/${product.slug}`} className="font-medium text-stone-800 hover:text-rose-500 transition-colors">
          {product.name}
        </Link>
        <p className="text-xs text-stone-400 mt-1 line-clamp-1">{product.description}</p>
      </div>
      <div className="text-right shrink-0">
        {product.oldPrice && <div className="text-xs text-stone-300 line-through">₴{product.oldPrice}</div>}
        <div className="text-lg font-medium text-stone-800">₴{product.price}</div>
        {product.inStock ? (
          <Button size="sm" className="mt-2 bg-stone-800 hover:bg-rose-400 text-white rounded-xl text-xs transition-all">
            <ShoppingCart className="w-3 h-3 mr-1" /> Купити
          </Button>
        ) : (
          <Badge className="mt-2 bg-stone-100 text-stone-400 border-none">Out of stock</Badge>
        )}
      </div>
    </div>
  );
}
