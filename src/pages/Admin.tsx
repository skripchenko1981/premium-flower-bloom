import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Search,
  ChevronDown,
  LogOut,
  Flower2,
  LayoutDashboard,
  Star,
  MessageCircle,
} from "lucide-react";
import api from "@/lib/api";

interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_orders: number;
  total_users: number;
  total_revenue: number;
  pending_orders: number;
  recent_orders: any[];
}

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const s = await api.getDashboardStats();
        setStats(s);
      } else if (activeTab === "orders") {
        const o = await api.getAdminOrders(1, 50);
        setOrders(o.orders);
      } else if (activeTab === "products") {
        const p = await api.getProducts({ size: 50 });
        setProducts(p.products);
      } else if (activeTab === "categories") {
        const c = await api.getAdminCategories();
        setCategories(c);
      }
    } catch (e) {
      console.error("Failed to load admin data:", e);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await api.logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-stone-100">
          <div className="flex items-center gap-2.5" onClick={() => navigate("/")}>
            <Flower2 className="w-7 h-7 text-rose-400" />
            <span className="text-lg font-light font-serif tracking-wide">
              Flower <span className="text-rose-400">Admin</span>
            </span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "orders", label: "Замовлення", icon: ShoppingCart },
            { id: "products", label: "Товари", icon: Package },
            { id: "categories", label: "Категорії", icon: BarChart3 },
            { id: "reviews", label: "Відгуки", icon: Star },
            { id: "messages", label: "Повідомлення", icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-rose-50 text-rose-500"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut className="w-4 h-4" /> Вийти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8">
          {activeTab === "dashboard" && <DashboardTab stats={stats} loading={loading} />}
          {activeTab === "orders" && <OrdersTab orders={orders} loading={loading} onRefresh={loadData} />}
          {activeTab === "products" && <ProductsTab products={products} loading={loading} onRefresh={loadData} />}
          {activeTab === "categories" && <CategoriesTab categories={categories} loading={loading} onRefresh={loadData} />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "messages" && <MessagesTab />}
        </div>
      </main>
    </div>
  );
}

function DashboardTab({ stats, loading }: { stats: DashboardStats | null; loading: boolean }) {
  const cards = [
    { label: "Усього товарів", value: stats?.total_products ?? 0, icon: Package, color: "bg-blue-50 text-blue-500" },
    { label: "Замовлень", value: stats?.total_orders ?? 0, icon: ShoppingCart, color: "bg-rose-50 text-rose-500" },
    { label: "Користувачів", value: stats?.total_users ?? 0, icon: Users, color: "bg-green-50 text-green-500" },
    { label: "Очікують", value: stats?.pending_orders ?? 0, icon: TrendingUp, color: "bg-amber-50 text-amber-500" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-400 mb-1">{card.label}</p>
                  <p className="text-3xl font-medium text-stone-800">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-stone-800">Останні замовлення</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recent_orders?.length ? (
              <div className="space-y-3">
                {stats.recent_orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                    <div>
                      <span className="text-sm font-medium text-stone-700">#{order.order_number}</span>
                      <span className="text-xs text-stone-400 ml-2">₴{order.total_amount}</span>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400">Поки немає замовлень</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-stone-800">Дохід</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-medium text-stone-800">₴{stats?.total_revenue?.toLocaleString() ?? 0}</p>
            <p className="text-sm text-stone-400 mt-1">Загальний дохід від замовлень</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    confirmed: "bg-blue-50 text-blue-600 border-blue-200",
    processing: "bg-purple-50 text-purple-600 border-purple-200",
    shipped: "bg-cyan-50 text-cyan-600 border-cyan-200",
    delivered: "bg-green-50 text-green-600 border-green-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  };
  const labels: Record<string, string> = {
    pending: "Очікує", confirmed: "Підтверджено", processing: "В обробці",
    shipped: "Відправлено", delivered: "Доставлено", cancelled: "Скасовано",
  };
  return (
    <Badge className={`${colors[status] || "bg-stone-50 text-stone-600"} border`} variant="outline">
      {labels[status] || status}
    </Badge>
  );
}

function OrdersTab({ orders, loading, onRefresh }: { orders: any[]; loading: boolean; onRefresh: () => void }) {
  const [statusFilter, setStatusFilter] = useState("");
  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight">Замовлення</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-stone-200 rounded-xl px-3 py-2 bg-white"
          >
            <option value="">Усі статуси</option>
            <option value="pending">Очікують</option>
            <option value="confirmed">Підтверджені</option>
            <option value="processing">В обробці</option>
            <option value="shipped">Відправлені</option>
            <option value="delivered">Доставлені</option>
            <option value="cancelled">Скасовані</option>
          </select>
          <Button variant="outline" onClick={onRefresh} className="rounded-xl">Оновити</Button>
        </div>
      </div>

      {loading ? (
        <p className="text-stone-400">Завантаження...</p>
      ) : filtered.length === 0 ? (
        <p className="text-stone-400">Замовлень не знайдено</p>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left p-4 font-medium text-stone-500">№</th>
                <th className="text-left p-4 font-medium text-stone-500">Клієнт</th>
                <th className="text-left p-4 font-medium text-stone-500">Сума</th>
                <th className="text-left p-4 font-medium text-stone-500">Статус</th>
                <th className="text-left p-4 font-medium text-stone-500">Дата</th>
                <th className="text-left p-4 font-medium text-stone-500">Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => (
                <tr key={order.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="p-4 font-medium text-stone-700">#{order.order_number || order.id}</td>
                  <td className="p-4 text-stone-600">ID: {order.user_id || "Гість"}</td>
                  <td className="p-4 font-medium text-stone-700">₴{order.total_amount}</td>
                  <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                  <td className="p-4 text-stone-400 text-xs">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString("uk-UA") : "-"}
                  </td>
                  <td className="p-4">
                    <select
                      onChange={async (e) => {
                        await api.updateOrderStatus(order.id, e.target.value);
                        onRefresh();
                      }}
                      className="text-xs border border-stone-200 rounded-lg px-2 py-1"
                    >
                      <option value="">Змінити статус</option>
                      <option value="confirmed">Підтвердити</option>
                      <option value="processing">В обробку</option>
                      <option value="shipped">Відправити</option>
                      <option value="delivered">Доставлено</option>
                      <option value="cancelled">Скасувати</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

function ProductsTab({ products, loading, onRefresh }: { products: any[]; loading: boolean; onRefresh: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = search
    ? products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight">Товари</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук..."
              className="pl-9 h-10 w-48 rounded-xl"
            />
          </div>
          <Button className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-1.5" /> Додати
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-stone-400">Завантаження...</p>
      ) : filtered.length === 0 ? (
        <p className="text-stone-400">Товарів не знайдено</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product: any) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {product.images?.[0] && (
                  <img
                    src={product.images[0].url || product.images[0]}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-xl mb-3"
                  />
                )}
                <h3 className="font-medium text-stone-800 text-sm">{product.name}</h3>
                <p className="text-lg font-medium text-stone-800 mt-1">₴{product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={product.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}>
                    {product.is_active ? "Активний" : "Неактивний"}
                  </Badge>
                  <span className="text-xs text-stone-400">Stock: {product.stock}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function CategoriesTab({ categories, loading, onRefresh }: { categories: any[]; loading: boolean; onRefresh: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight">Категорії</h1>
        <Button className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" /> Додати
        </Button>
      </div>

      {loading ? (
        <p className="text-stone-400">Завантаження...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: any) => (
            <Card key={cat.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-stone-800">{cat.name}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">slug: {cat.slug}</p>
                  <Badge className={cat.is_active ? "bg-green-50 text-green-600 mt-2" : "bg-red-50 text-red-600 mt-2"}>
                    {cat.is_active ? "Активна" : "Неактивна"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ReviewsTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight mb-8">Відгуки</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-400">Підключіть бекенд для управління відгуками</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MessagesTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight mb-8">Повідомлення</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-400">Підключіть бекенд для перегляду повідомлень</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
