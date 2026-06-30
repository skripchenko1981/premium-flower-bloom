import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api as convexApi } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  LogOut,
  Flower2,
  LayoutDashboard,
  Star,
  MessageCircle,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { clearAdminSession, getAdminToken } from "@/pages/AdminLogin";

const STATUS_FILTERS = [
  { value: "", label: "Усі статуси" },
  { value: "pending", label: "Очікують" },
  { value: "confirmed", label: "Підтверджені" },
  { value: "processing", label: "В обробці" },
  { value: "shipped", label: "Відправлені" },
  { value: "delivered", label: "Доставлені" },
  { value: "cancelled", label: "Скасовані" },
];

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Замовлення", icon: ShoppingCart },
  { id: "products", label: "Товари", icon: Package },
  { id: "categories", label: "Категорії", icon: BarChart3 },
  { id: "reviews", label: "Відгуки", icon: Star },
  { id: "messages", label: "Повідомлення", icon: MessageCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [adminUsername, setAdminUsername] = useState<string | null>(null);

  // Check admin session on mount. If no token OR an invalid/expired session,
  // redirect to /admin-login so the admin shell is never shown to non-admins.
  const [token] = useState(() => getAdminToken());
  const session = useQuery(
    convexApi.adminAuth.verifyAdminSession,
    token ? { token } : "skip",
  );

  const logout = useMutation(convexApi.adminAuth.adminLogout);

  useEffect(() => {
    const noSession = !token || session === null;
    if (noSession) {
      clearAdminSession();
      navigate("/admin-login", { replace: true, state: { from: "/admin" } });
      return;
    }
    if (session) {
      setAdminUsername(session.username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, token]);

  const handleLogout = async () => {
    const t = getAdminToken();
    if (t) {
      try {
        await logout({ token: t });
      } catch (e) {
        console.error("Admin logout failed:", e);
      }
    }
    clearAdminSession();
    navigate("/admin-login");
  };

  // Avoid flashing the admin shell while we verify the session or while a
  // redirect to /admin-login is pending. The effect handles the navigation.
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
      </div>
    );
  }

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
          {adminUsername && (
            <div className="mt-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-100">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-xs text-stone-500 truncate">
                {adminUsername}
              </span>
            </div>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((tab) => (
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
          {activeTab === "dashboard" && <DashboardTab token={token!} />}
          {activeTab === "orders" && <OrdersTab token={token!} />}
          {activeTab === "products" && <ProductsTab token={token!} />}
          {activeTab === "categories" && <CategoriesTab token={token!} />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "messages" && <MessagesTab token={token!} />}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────── Dashboard ───────────────────────────

function DashboardTab({ token }: { token: string }) {
  const stats = useQuery(convexApi.adminData.getDashboardStats, { token });

  if (!stats) {
    return <TabLoading />;
  }

  const cards = [
    { label: "Усього товарів", value: stats.total_products, icon: Package, color: "bg-blue-50 text-blue-500" },
    { label: "Замовлень", value: stats.total_orders, icon: ShoppingCart, color: "bg-rose-50 text-rose-500" },
    { label: "Користувачів", value: stats.total_users, icon: Users, color: "bg-green-50 text-green-500" },
    { label: "Очікують", value: stats.pending_orders, icon: TrendingUp, color: "bg-amber-50 text-amber-500" },
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
            {stats.recent_orders?.length ? (
              <div className="space-y-3">
                {stats.recent_orders.map((order: { id: string; order_number: string; total_amount: number | undefined; status: string | undefined; created_at: number }) => (
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
            <p className="text-4xl font-medium text-stone-800">
              ₴{stats.total_revenue.toLocaleString()}
            </p>
            <p className="text-sm text-stone-400 mt-1">
              Загальний дохід (без скасованих)
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// ─────────────────────────── Orders ───────────────────────────

function OrdersTab({ token }: { token: string }) {
  const [statusFilter, setStatusFilter] = useState("");
  const orders = useQuery(convexApi.adminData.adminGetAllOrders, { token });
  const updateStatus = useMutation(convexApi.adminData.adminUpdateOrderStatus);

  if (!orders) return <TabLoading />;

  const filtered = statusFilter ? orders.filter((o: Doc<"orders">) => o.status === statusFilter) : orders;

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateStatus({ token, orderId: orderId as any, status });
    } catch (e) {
      console.error("Failed to update order status:", e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight">Замовлення</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-stone-200 rounded-xl px-3 py-2 bg-white"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
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
              {filtered.map((order: Doc<"orders">) => (
                <tr key={order._id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="p-4 font-medium text-stone-700">
                    #{String(order._id).slice(-6).toUpperCase()}
                  </td>
                  <td className="p-4 text-stone-600">
                    {order.recipientName || "—"}
                  </td>
                  <td className="p-4 font-medium text-stone-700">₴{order.total}</td>
                  <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                  <td className="p-4 text-stone-400 text-xs">
                    {new Date(order.createdAt ?? order._creationTime).toLocaleString("uk-UA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v) handleStatusChange(order._id, v);
                        e.currentTarget.value = "";
                      }}
                      className="text-xs border border-stone-200 rounded-lg px-2 py-1 bg-white"
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

// ─────────────────────────── Products ───────────────────────────

function ProductsTab({ token }: { token: string }) {
  const [search, setSearch] = useState("");
  const products = useQuery(convexApi.adminData.adminGetAllProducts, { token });

  if (!products) return <TabLoading />;

  const filtered = search
    ? products.filter((p: Doc<"products">) => p.name?.toLowerCase().includes(search.toLowerCase()))
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
          <Button
            disabled
            className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl disabled:opacity-60"
            title="Скоро: додавання товарів"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Додати
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone-400">
          {search ? "Товарів за пошуком не знайдено" : "Товарів ще немає"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product: Doc<"products">) => {
            const image = Array.isArray(product.images) ? product.images[0] : null;
            return (
              <Card key={product._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {image && (
                    <img
                      src={typeof image === "string" ? image : image.url}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-xl mb-3"
                    />
                  )}
                  <h3 className="font-medium text-stone-800 text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-medium text-stone-800 mt-1">₴{product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={product.inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}>
                      {product.inStock ? "В наявності" : "Немає"}
                    </Badge>
                    <span className="text-xs text-stone-400">{product.category}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────── Categories ───────────────────────────

function CategoriesTab({ token }: { token: string }) {
  const categories = useQuery(convexApi.adminData.adminGetAllCategories, { token });

  if (!categories) return <TabLoading />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight">Категорії</h1>
        <Button
          disabled
          variant="outline"
          className="rounded-xl disabled:opacity-60"
          title="Скоро: додавання категорій"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Додати
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-stone-400">Категорій ще немає</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: Doc<"categories">) => (
            <Card key={cat._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-800 truncate">{cat.name}</h3>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">slug: {cat.slug}</p>
                  {cat.description && (
                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{cat.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" disabled title="Скоро">
                    <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" disabled title="Скоро">
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

// ─────────────────────────── Reviews ───────────────────────────

function ReviewsTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight mb-8">Відгуки</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-400">Модерація відгуків незабаром</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─────────────────────────── Messages ───────────────────────────

function MessagesTab({ token }: { token: string }) {
  const messages = useQuery(convexApi.adminData.adminGetContactMessages, { token });
  const markRead = useMutation(convexApi.adminData.adminMarkContactRead);

  if (!messages) return <TabLoading />;

  const toggleRead = async (id: string, read: boolean) => {
    try {
      await markRead({ token, messageId: id as any, read });
    } catch (e) {
      console.error("Failed to mark message:", e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight">Повідомлення</h1>
        <span className="text-sm text-stone-500">            {messages.filter((m: Doc<"contactMessages">) => !m.read).length} непрочитаних
        </span>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-400">Повідомлень ще немає</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: Doc<"contactMessages">) => (
            <Card
              key={msg._id}
              className={`hover:shadow-md transition-shadow ${!msg.read ? "border-rose-200" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-stone-800">{msg.name}</h3>
                      {!msg.read && (
                        <Badge className="bg-rose-50 text-rose-600 border-rose-200">
                          нове
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      <a href={`mailto:${msg.email}`} className="hover:text-rose-500">
                        {msg.email}
                      </a>
                      {msg.phone && <span>{msg.phone}</span>}
                      <span className="text-stone-400">
                        {new Date(msg.createdAt).toLocaleString("uk-UA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-stone-700 mt-3 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl shrink-0"
                    onClick={() => toggleRead(msg._id, !msg.read)}
                  >
                    {msg.read ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                        Не прочитано
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Прочитано
                      </>
                    )}
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

// ─────────────────────────── Shared bits ───────────────────────────

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
    pending: "Очікує",
    confirmed: "Підтверджено",
    processing: "В обробці",
    shipped: "Відправлено",
    delivered: "Доставлено",
    cancelled: "Скасовано",
  };
  return (
    <Badge className={`${colors[status] || "bg-stone-50 text-stone-600"} border`} variant="outline">
      {labels[status] || status}
    </Badge>
  );
}

function TabLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
    </div>
  );
}
