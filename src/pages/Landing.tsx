import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Flower2,
  ArrowRight,
  Star,
  Truck,
  ShieldCheck,
  Clock,
  Gift,
  Sparkles,
  ChevronRight,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Send,
  Leaf,
  Palette,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

// Unsplash flower images
const images = {
  hero: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80",
  rose: "https://images.unsplash.com/photo-1548586196-aa5823b77379?w=600&q=80",
  tulip: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=600&q=80",
  peony: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600&q=80",
  orchid: "https://images.unsplash.com/photo-1524592527185-606a436cc4a6?w=600&q=80",
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  bouquet1: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&q=80",
  bouquet2: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80",
  bouquet3: "https://images.unsplash.com/photo-1508610041839-e022ab75315e?w=600&q=80",
  bouquet4: "https://images.unsplash.com/photo-1599733589046-10c7f0c3e069?w=600&q=80",
  florist: "https://images.unsplash.com/photo-1557428894-56bcc97113fe?w=600&q=80",
  delivery: "https://images.unsplash.com/photo-1602607177721-485855ad6072?w=600&q=80",
};

const categories = [
  { name: "Троянди", slug: "roses", image: images.rose, count: 24 },
  { name: "Тюльпани", slug: "tulips", image: images.tulip, count: 16 },
  { name: "Півонії", slug: "peonies", image: images.peony, count: 12 },
  { name: "Орхідеї", slug: "orchids", image: images.orchid, count: 18 },
  { name: "Весілля", slug: "wedding", image: images.wedding, count: 30 },
  { name: "Подарунки", slug: "gifts", image: images.bouquet4, count: 20 },
];

const advantages = [
  {
    icon: Truck,
    title: "Швидка доставка",
    desc: "Безкоштовна доставка по місту протягом 2 годин. Дбайливо запаковано для свіжості.",
  },
  {
    icon: ShieldCheck,
    title: "Гарантія свіжості",
    desc: "100% гарантія свіжості. Якщо квіти зів'януть протягом 3 днів — ми замінимо їх.",
  },
  {
    icon: Clock,
    title: "Замовлення 24/7",
    desc: "Замовляйте будь-коли! Квіти завжди доступні для вас і ваших близьких.",
  },
  {
    icon: Gift,
    title: "Гарне пакування",
    desc: "Кожен букет запакований у преміум дизайнерську обгортку з листівкою.",
  },
];

const reviews = [
  {
    name: "Анна К.",
    text: "Найкрасивіший букет, який я коли-небудь отримувала! Квіти були свіжими та неймовірно пахли. Доставка вчасно з чудовою листівкою.",
    rating: 5,
  },
  {
    name: "Олександр М.",
    text: "Замовив букет на річницю. Дружина була в захваті! Чудовий сервіс і неймовірно гарна композиція.",
    rating: 5,
  },
  {
    name: "Катерина Л.",
    text: "Замовляю квіти тут регулярно. Завжди свіжі, завжди красиві. Дизайнери — справжні художники!",
    rating: 5,
  },
  {
    name: "Дмитро П.",
    text: "Швидка доставка, розкішний букет, а троянди простояли майже два тижні! Неймовірна якість.",
    rating: 5,
  },
];

const popularBouquets = [
  {
    id: "1",
    name: "Рожева мрія",
    price: 1299,
    oldPrice: 1599,
    image: images.bouquet1,
    category: "Авторські",
    sizes: ["S", "M", "L"],
    withCard: false,
  },
  {
    id: "2",
    name: "Ніжний ранок",
    price: 1499,
    image: images.bouquet2,
    category: "Троянди",
    sizes: ["M", "L"],
    withCard: false,
  },
  {
    id: "3",
    name: "Весняна мелодія",
    price: 999,
    image: images.bouquet3,
    category: "Тюльпани",
    sizes: ["S", "M", "L"],
    withCard: false,
  },
  {
    id: "4",
    name: "Королівська розкіш",
    price: 2499,
    oldPrice: 2999,
    image: images.bouquet4,
    category: "Півонії",
    sizes: ["L", "XL"],
    withCard: false,
  },
];

function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={images.hero}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fefdfb] via-transparent to-transparent" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full"
        >
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Badge className="mb-6 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none px-4 py-2 text-sm">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Преміум букети з доставкою
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-stone-900 leading-[1.05] font-serif">
                Квіти, що{" "}
                <span className="text-rose-400 italic">говорять</span>{" "}
                мовою серця
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-stone-500 leading-relaxed max-w-lg">
                Авторські букети, створені з любов'ю та увагою до кожної пелюстки.
                Доставка по місту — сьогодні, вчасно та з усмішкою.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate("/catalog")}
                className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl px-8 py-6 text-base font-normal shadow-lg shadow-rose-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-rose-300/50 hover:-translate-y-0.5"
              >
                Обрати букет
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/catalog?category=wedding")}
                className="border-stone-200 hover:border-rose-200 rounded-xl px-8 py-6 text-base font-normal text-stone-600 hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-300"
              >
                Весільні квіти
              </Button>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 flex gap-8 sm:gap-12"
            >
              {[
                { num: "1500+", label: "Задоволених клієнтів" },
                { num: "300+", label: "Дизайнів букетів" },
                { num: "5★", label: "Середній рейтинг" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-medium text-stone-800 font-serif">
                    {stat.num}
                  </div>
                  <div className="text-sm text-stone-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-stone-300 flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none">
              Каталог
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              Обери свою{" "}
              <span className="text-rose-400 italic">категорію</span>
            </h2>
            <p className="mt-3 text-stone-500 max-w-lg mx-auto">
              Від класичних троянд до екзотичних орхідей — знайдіть саме те, що шукаєте.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat, i) => (
              <FadeInSection key={cat.slug} delay={i * 0.08}>
                <Link
                  to={`/catalog?category=${cat.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-sm">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-medium text-sm sm:text-base">
                        {cat.name}
                      </h3>
                      <p className="text-white/70 text-xs mt-0.5">
                        {cat.count} варіантів
                      </p>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Bouquets */}
      <section className="py-20 sm:py-28 bg-[#fefdfb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none">
              <Flower2 className="w-3.5 h-3.5 mr-2" />
              Популярне
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              Найулюбленіші{" "}
              <span className="text-rose-400 italic">букети</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {popularBouquets.map((bouquet, i) => (
              <FadeInSection key={bouquet.id} delay={i * 0.1}>
                <div className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-1">
                  <Link to={`/product/${bouquet.id}`} className="block relative aspect-[4/5] overflow-hidden">
                    <img
                      src={bouquet.image}
                      alt={bouquet.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    {bouquet.oldPrice && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-rose-400 text-white border-none text-xs">
                          -{Math.round((1 - bouquet.price / bouquet.oldPrice) * 100)}%
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full bg-white/90 hover:bg-white shadow-md h-9 w-9"
                      >
                        <Heart className="w-4 h-4 text-rose-400" />
                      </Button>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="text-xs text-rose-400 font-medium mb-1.5 uppercase tracking-wider">
                      {bouquet.category}
                    </div>
                    <Link
                      to={`/product/${bouquet.id}`}
                      className="block font-medium text-stone-800 hover:text-rose-500 transition-colors text-lg"
                    >
                      {bouquet.name}
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                      {bouquet.oldPrice && (
                        <span className="text-sm text-stone-300 line-through">
                          ₴{bouquet.oldPrice}
                        </span>
                      )}
                      <span className="text-xl font-medium text-stone-800">
                        ₴{bouquet.price}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      {bouquet.sizes.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-1 rounded-full bg-stone-50 text-stone-500 border border-stone-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-4 bg-stone-800 hover:bg-rose-400 text-white rounded-xl transition-all duration-300"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      У кошик
                    </Button>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.3} className="text-center mt-12">
            <Button
              variant="outline"
              onClick={() => navigate("/catalog")}
              className="border-stone-200 hover:border-rose-200 text-stone-600 hover:text-rose-500 hover:bg-rose-50/50 rounded-xl transition-all duration-300"
            >
              Переглянути всі букети
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </FadeInSection>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100 border-none">
              <Leaf className="w-3.5 h-3.5 mr-2" />
              Чому ми
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              Ми дбаємо про{" "}
              <span className="text-green-500 italic">кожну деталь</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {advantages.map((adv, i) => (
              <FadeInSection key={adv.title} delay={i * 0.1}>
                <div className="relative p-6 sm:p-8 rounded-2xl bg-[#fefdfb] border border-stone-100 hover:border-rose-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-5 group-hover:bg-rose-100 transition-colors">
                    <adv.icon className="w-6 h-6 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-800 mb-2">
                    {adv.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 sm:py-28 bg-[#fefdfb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none">
              <ThumbsUp className="w-3.5 h-3.5 mr-2" />
              Відгуки
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              Що кажуть{" "}
              <span className="text-rose-400 italic">клієнти</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {reviews.map((review, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-5">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-400 font-medium text-sm">
                      {review.name[0]}
                    </div>
                    <span className="font-medium text-stone-800 text-sm">
                      {review.name}
                    </span>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Order */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src={images.delivery}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-stone-900/40" />
            <div className="relative z-10 py-16 sm:py-20 px-6 sm:px-12 lg:px-20">
              <div className="max-w-xl">
                <FadeInSection>
                  <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20 border-none backdrop-blur-sm">
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Швидке замовлення
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-serif tracking-tight">
                    Не знаєте, що обрати?
                  </h2>
                  <p className="mt-3 text-white/70 text-lg">
                    Залиште номер телефону — наш флорист передзвонить вам і допоможе підібрати ідеальний букет.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
                    <Input
                      placeholder="+380 (__) ___-__-__"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12"
                    />
                    <Button className="bg-white text-stone-800 hover:bg-rose-100 rounded-xl px-6 h-12 transition-all duration-300">
                      Замовити дзвінок
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </FadeInSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flower2 className="w-7 h-7 text-rose-400" />
                <span className="text-xl font-light font-serif tracking-wide">
                  Flower <span className="text-rose-400">Bloom</span>
                </span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                Преміум букети, створені з любов'ю.
                Доставка по місту — сьогодні, вчасно та з усмішкою.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Каталог</h4>
              <div className="space-y-2.5">
                {["Троянди", "Тюльпани", "Півонії", "Орхідеї", "Весілля", "Подарунки"].map((c) => (
                  <Link
                    key={c}
                    to={`/catalog?category=${c.toLowerCase()}`}
                    className="block text-stone-400 hover:text-rose-400 text-sm transition-colors"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Інформація</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Про нас", to: "/about" },
                  { label: "Доставка та оплата", to: "/delivery" },
                  { label: "Контакти", to: "/contacts" },
                  { label: "FAQ", to: "/delivery" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block text-stone-400 hover:text-rose-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Контакти</h4>
              <div className="space-y-2.5 text-stone-400 text-sm">
                <p>+380 (44) 123-45-67</p>
                <p>hello@flowerbloom.ua</p>
                <p>Київ, вул. Хрещатик, 25</p>
                <p className="text-stone-500 text-xs mt-3">
                  Пн—Нд: 8:00 – 22:00
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-xs">
              © 2025 Flower Bloom. Усі права захищено.
            </p>
            <div className="flex gap-6">
              <span className="text-stone-500 text-xs hover:text-rose-400 cursor-pointer transition-colors">
                Instagram
              </span>
              <span className="text-stone-500 text-xs hover:text-rose-400 cursor-pointer transition-colors">
                Telegram
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
