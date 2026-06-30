import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api as convexApi } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[а-яіїєґ]/g, (ch) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
        ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l",
        м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
        ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu",
        я: "ya",
      };
      return map[ch] ?? ch;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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
                {stats.recent_orders.map((order: { id: string; order_number: string; total_amount: number; status: string; created_at: number }) => (
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
      await updateStatus({ token, orderId: orderId as Id<"orders">, status });
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

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  oldPrice: string;
  category: string;
  imagesText: string;
  inStock: boolean;
};

const EMPTY_PRODUCT: ProductFormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  oldPrice: "",
  category: "",
  imagesText: "",
  inStock: true,
};

function ProductsTab({ token }: { token: string }) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doc<"products"> | null>(null);
  const products = useQuery(convexApi.adminData.adminGetAllProducts, { token });
  const createProduct = useMutation(convexApi.adminData.adminCreateProduct);
  const updateProduct = useMutation(convexApi.adminData.adminUpdateProduct);
  const deleteProduct = useMutation(convexApi.adminData.adminDeleteProduct);

  if (!products) return <TabLoading />;

  const filtered = search
    ? products.filter((p: Doc<"products">) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (product: Doc<"products">) => {
    setEditing(product);
    setDialogOpen(true);
  };
  const handleDelete = async (product: Doc<"products">) => {
    if (!window.confirm(`Видалити товар "${product.name}"?`)) return;
    try {
      await deleteProduct({ token, id: product._id });
      toast.success("Товар видалено");
    } catch (e) {
      console.error("Failed to delete product:", e);
      toast.error((e as Error).message || "Не вдалося видалити товар");
    }
  };

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
            onClick={openCreate}
            className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl"
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
            const image = product.images?.[0];
            return (
              <Card key={product._id} className="hover:shadow-md transition-shadow group">
                <CardContent className="p-4">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-xl mb-3"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-xl bg-stone-100 mb-3 flex items-center justify-center">
                      <Package className="w-10 h-10 text-stone-300" />
                    </div>
                  )}
                  <h3 className="font-medium text-stone-800 text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-medium text-stone-800 mt-1">₴{product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={product.inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}>
                      {product.inStock ? "В наявності" : "Немає"}
                    </Badge>
                    <span className="text-xs text-stone-400">{product.category}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-stone-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-8 text-xs"
                      onClick={() => openEdit(product)}
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Змінити
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditing(null);
        }}
        token={token}
        editing={editing}
        onSave={async (form) => {
          const payload = {
            token,
            name: form.name,
            slug: form.slug,
            description: form.description,
            price: Number(form.price) || 0,
            oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
            category: form.category,
            images: form.imagesText
              .split(/\r?\n/)
              .map((s) => s.trim())
              .filter(Boolean),
            inStock: form.inStock,
          };
          try {
            if (editing) {
              await updateProduct({ ...payload, id: editing._id });
            } else {
              await createProduct(payload);
            }
            setDialogOpen(false);
            setEditing(null);
          } catch (e) {
            console.error("Failed to save product:", e);
            throw e;
          }
        }}
      />
    </motion.div>
  );
}

function ProductDialog({
  open,
  onOpenChange,
  token,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  token: string;
  editing: Doc<"products"> | null;
  onSave: (form: ProductFormState) => Promise<void>;
}) {
  const categories = useQuery(
    convexApi.adminData.adminGetAllCategories,
    open ? { token } : "skip",
  );
  const [form, setForm] = useState<ProductFormState>(EMPTY_PRODUCT);
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Reset form whenever the dialog opens for a specific record
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        name: editing.name,
        slug: editing.slug,
        description: editing.description,
        price: String(editing.price),
        oldPrice: editing.oldPrice != null ? String(editing.oldPrice) : "",
        category: editing.category,
        imagesText: (editing.images ?? []).join("\n"),
        inStock: editing.inStock,
      });
      setSlugTouched(true);
    } else {
      setForm(EMPTY_PRODUCT);
      setSlugTouched(false);
    }
    setErrMsg(null);
  }, [open, editing]);

  // Auto-derive slug from name if user hasn't manually edited it
  useEffect(() => {
    if (!slugTouched) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    if (!form.name.trim()) return setErrMsg("Введіть назву");
    if (!form.slug.trim()) return setErrMsg("Введіть slug");
    if (!form.category.trim()) return setErrMsg("Виберіть категорію");
    if (!form.description.trim()) return setErrMsg("Введіть опис");
    if (!form.imagesText.trim()) return setErrMsg("Додайте хоча б одне фото");
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) return setErrMsg("Введіть коректну ціну");

    setSubmitting(true);
    try {
      await onSave(form);
      toast.success(editing ? "Товар оновлено" : "Товар створено");
    } catch (e) {
      setErrMsg((e as Error).message || "Не вдалося зберегти");
      toast.error((e as Error).message || "Не вдалося зберегти");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {editing ? "Змінити товар" : "Новий товар"}
          </DialogTitle>
          <DialogDescription>
            Заповніть поля й натисніть «Зберегти».
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Назва</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Букет «Весна»"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-slug">Slug (URL)</Label>
              <Input
                id="p-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                placeholder="buket-vesna"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Опис</Label>
            <Textarea
              id="p-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Склад, настрій, для кого ідеально підходить…"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Ціна, ₴</Label>
              <Input
                id="p-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="650"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-old">Стара ціна, ₴</Label>
              <Input
                id="p-old"
                type="number"
                min="0"
                step="0.01"
                value={form.oldPrice}
                onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                placeholder="опц."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-cat">Категорія</Label>
              <select
                id="p-cat"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">— виберіть —</option>
                {(categories ?? []).map((c: Doc<"categories">) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-images">
              Фото (URL, по одному на рядок)
            </Label>
            <Textarea
              id="p-images"
              value={form.imagesText}
              onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
              placeholder={"https://...\nhttps://..."}
              rows={3}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="w-4 h-4 rounded accent-rose-400"
            />
            <span className="text-sm text-stone-700">В наявності</span>
          </label>

          {errMsg && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errMsg}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editing ? (
                "Зберегти зміни"
              ) : (
                "Створити"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────── Categories ───────────────────────────

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
  order: string;
};

const EMPTY_CATEGORY: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  image: "",
  order: "",
};

function CategoriesTab({ token }: { token: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doc<"categories"> | null>(null);
  const categories = useQuery(convexApi.adminData.adminGetAllCategories, { token });
  const createCategory = useMutation(convexApi.adminData.adminCreateCategory);
  const updateCategory = useMutation(convexApi.adminData.adminUpdateCategory);
  const deleteCategory = useMutation(convexApi.adminData.adminDeleteCategory);

  if (!categories) return <TabLoading />;

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (cat: Doc<"categories">) => {
    setEditing(cat);
    setDialogOpen(true);
  };
  const handleDelete = async (cat: Doc<"categories">) => {
    if (!window.confirm(`Видалити категорію "${cat.name}"?`)) return;
    try {
      await deleteCategory({ token, id: cat._id });
      toast.success("Категорію видалено");
    } catch (e) {
      console.error("Failed to delete category:", e);
      toast.error((e as Error).message || "Не вдалося видалити категорію");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight">Категорії</h1>
        <Button
          onClick={openCreate}
          variant="outline"
          className="rounded-xl"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Додати
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-stone-400">Категорій ще немає</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: Doc<"categories">) => (
            <Card key={cat._id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-6 h-6 text-stone-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-stone-800 truncate">{cat.name}</h3>
                    <p className="text-xs text-stone-400 mt-0.5 truncate">slug: {cat.slug}</p>
                    {cat.description && (
                      <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{cat.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-stone-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-8 text-xs"
                    onClick={() => openEdit(cat)}
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Змінити
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(cat)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditing(null);
        }}
        editing={editing}
        onSave={async (form) => {
          const payload = {
            token,
            name: form.name,
            slug: form.slug,
            description: form.description || undefined,
            image: form.image || undefined,
            order: form.order ? Number(form.order) : undefined,
          };
          try {
            if (editing) {
              await updateCategory({ ...payload, id: editing._id });
            } else {
              await createCategory(payload);
            }
            setDialogOpen(false);
            setEditing(null);
          } catch (e) {
            console.error("Failed to save category:", e);
            throw e;
          }
        }}
      />
    </motion.div>
  );
}

function CategoryDialog({
  open,
  onOpenChange,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Doc<"categories"> | null;
  onSave: (form: CategoryFormState) => Promise<void>;
}) {
  const [form, setForm] = useState<CategoryFormState>(EMPTY_CATEGORY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        name: editing.name,
        slug: editing.slug,
        description: editing.description ?? "",
        image: editing.image ?? "",
        order: editing.order != null ? String(editing.order) : "",
      });
      setSlugTouched(true);
    } else {
      setForm(EMPTY_CATEGORY);
      setSlugTouched(false);
    }
    setErrMsg(null);
  }, [open, editing]);

  useEffect(() => {
    if (!slugTouched) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    if (!form.name.trim()) return setErrMsg("Введіть назву");
    if (!form.slug.trim()) return setErrMsg("Введіть slug");
    if (form.order && !Number.isFinite(Number(form.order))) {
      return setErrMsg("Порядок має бути числом");
    }

    setSubmitting(true);
    try {
      await onSave(form);
      toast.success(editing ? "Категорію оновлено" : "Категорію створено");
    } catch (e) {
      setErrMsg((e as Error).message || "Не вдалося зберегти");
      toast.error((e as Error).message || "Не вдалося зберегти");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {editing ? "Змінити категорію" : "Нова категорія"}
          </DialogTitle>
          <DialogDescription>Назва, slug та зображення є обов'язковими.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Назва</Label>
              <Input
                id="c-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Букети"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-slug">Slug</Label>
              <Input
                id="c-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                placeholder="bukety"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-desc">Опис</Label>
            <Textarea
              id="c-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Короткий опис категорії (опц.)"
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-image">URL зображення</Label>
            <Input
              id="c-image"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-order">Порядок (опц.)</Label>
            <Input
              id="c-order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              placeholder="1"
            />
          </div>

          {errMsg && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errMsg}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editing ? (
                "Зберегти зміни"
              ) : (
                "Створити"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
      await markRead({ token, messageId: id as Id<"contactMessages">, read });
    } catch (e) {
      console.error("Failed to mark message:", e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight">Повідомлення</h1>
        <span className="text-sm text-stone-500">
          {messages.filter((m: Doc<"contactMessages">) => !m.read).length} непрочитаних
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
