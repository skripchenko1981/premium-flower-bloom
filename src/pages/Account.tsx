import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  User,
  Package,
  Heart,
  LogOut,
  MapPin,
  Phone,
  ShoppingCart,
  Clock,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/Layout";
import { FadeInSection } from "@/components/FadeInSection";

type Tab = "profile" | "orders" | "wishlist";

const demoOrders = [
  {
    _id: "o1",
    createdAt: Date.now() - 86400000 * 3,
    items: [{ name: "Рожева мрія (M)", price: 1299, quantity: 1, image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=100&q=80" }],
    total: 1449,
    status: "delivered",
  },
  {
    _id: "o2",
    createdAt: Date.now() - 86400000 * 10,
    items: [
      { name: "Royal Velvet (L)", price: 1899, quantity: 1, image: "https://images.unsplash.com/photo-1548586196-aa5823b77379?w=100&q=80" },
      { name: "Spring Symphony (M)", price: 899, quantity: 2, image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=100&q=80" },
    ],
    total: 3698,
    status: "shipped",
  },
];

const demoWishlist = [
  { _id: "w1", name: "Pearl Peony (L)", price: 1999, image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=100&q=80" },
  { _id: "w2", name: "White Orchid", price: 2199, image: "https://images.unsplash.com/photo-1524592527185-606a436cc4a6?w=100&q=80" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Check }> = {
  pending: { label: "Очікує", color: "bg-amber-100 text-amber-700", icon: Clock },
  confirmed: { label: "Підтверджено", color: "bg-blue-100 text-blue-700", icon: Check },
  processing: { label: "В обробці", color: "bg-indigo-100 text-indigo-700", icon: Package },
  shipped: { label: "Відправлено", color: "bg-purple-100 text-purple-700", icon: Package },
  delivered: { label: "Доставлено", color: "bg-green-100 text-green-700", icon: Check },
  cancelled: { label: "Скасовано", color: "bg-red-100 text-red-700", icon: X },
};

export default function Account() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Not authenticated - redirect
  if (!isLoading && !isAuthenticated) {
    return (
      <Layout showFooter={false}>
        <section className="pt-24 sm:pt-32 pb-16">
          <div className="max-w-lg mx-auto px-4 text-center py-20">
            <User className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h1 className="text-2xl font-light text-stone-800 font-serif">Увійдіть, щоб продовжити</h1>
            <p className="text-stone-400 mt-1 mb-6">Зареєструйтесь або увійдіть, щоб переглянути свій профіль</p>
            <Button onClick={() => navigate("/auth")} className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl">
              Увійти / Зареєструватися
            </Button>
          </div>
        </section>
    </Layout>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Профіль", icon: User },
    { id: "orders", label: "Замовлення", icon: Package },
    { id: "wishlist", label: "Обрані", icon: Heart },
  ];

  return (
    <Layout showFooter={false}>

      <section className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Мій <span className="text-rose-400 italic">профіль</span>
            </h1>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar */}
            <div className="lg:w-56 shrink-0">
              <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200",
                        activeTab === tab.id
                          ? "bg-rose-50 text-rose-500"
                          : "text-stone-500 hover:text-rose-500 hover:bg-stone-50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-stone-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Вийти
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activeTab === "profile" && <ProfileTab user={user} />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "wishlist" && <WishlistTab />}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function ProfileTab({ user }: { user: any }) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <FadeInSection>
      <div className="bg-white rounded-2xl border border-stone-100 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-medium text-stone-800 mb-6">Особисті дані</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-stone-400 font-medium mb-1.5 block">Ім'я</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-stone-200 h-11"
              placeholder="Ваше ім'я"
            />
          </div>
          <div>
            <label className="text-xs text-stone-400 font-medium mb-1.5 block">Email</label>
            <Input
              value={user?.email || "user@example.com"}
              className="rounded-xl border-stone-200 h-11 bg-stone-50 text-stone-400"
              disabled
            />
            <p className="text-[10px] text-stone-400 mt-1">Email не можна змінити</p>
          </div>
          <div>
            <label className="text-xs text-stone-400 font-medium mb-1.5 block">
              <Phone className="w-3 h-3 inline mr-1" />
              Телефон
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border-stone-200 h-11"
              placeholder="+380 (__) ___-__-__"
            />
          </div>
          <div>
            <label className="text-xs text-stone-400 font-medium mb-1.5 block">
              <MapPin className="w-3 h-3 inline mr-1" />
              Адреса доставки
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl border-stone-200 h-11"
              placeholder="Ваша адреса"
            />
          </div>
          <Button
            onClick={handleSave}
            className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl transition-all duration-300"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Збережено
              </>
            ) : (
              "Зберегти зміни"
            )}
          </Button>
        </div>
      </div>
    </FadeInSection>
  );
}

function OrdersTab() {
  return (
    <FadeInSection>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-stone-800 mb-1">Мої замовлення</h3>
        <p className="text-sm text-stone-400 mb-4">Історія ваших замовлень</p>

        {demoOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center shadow-sm">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">У вас ще немає замовлень</p>
          </div>
        ) : (
          demoOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const date = new Date(order.createdAt);

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium text-stone-800">
                      Замовлення #{order._id.toUpperCase()}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {date.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                  <Badge className={cn("flex items-center gap-1 border-none", status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs text-stone-600">{item.name}</div>
                        <div className="text-[10px] text-stone-400">×{item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-stone-50">
                  <span className="text-sm text-stone-500">Сума замовлення</span>
                  <span className="text-base font-medium text-stone-800">₴{order.total}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </FadeInSection>
  );
}

function WishlistTab() {
  const navigate = useNavigate();
  return (
    <FadeInSection>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-stone-800 mb-1">Обрані букети</h3>
        <p className="text-sm text-stone-400 mb-4">Збережені для вас</p>

        {demoWishlist.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center shadow-sm">
            <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 mb-4">Список бажань порожній</p>
            <Button onClick={() => navigate("/catalog")} className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl">
              До каталогу
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {demoWishlist.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-800">{item.name}</div>
                  <div className="text-base font-medium text-stone-800 mt-0.5">₴{item.price}</div>
                </div>
                <Button size="sm" className="bg-stone-800 hover:bg-rose-400 text-white rounded-xl shrink-0 transition-all duration-300">
                  <ShoppingCart className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FadeInSection>
  );
}
