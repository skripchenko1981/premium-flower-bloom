import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Truck,
  Store,
  Clock,
  MapPin,
  Flower2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/Layout";

const deliveryMethods = [
  {
    id: "standard",
    name: "Стандартна доставка",
    desc: "Протягом 2–4 годин з моменту замовлення",
    price: 150,
    icon: Truck,
  },
  {
    id: "express",
    name: "Експрес доставка",
    desc: "Протягом 60–90 хвилин",
    price: 300,
    icon: Clock,
  },
  {
    id: "pickup",
    name: "Самовивіз",
    desc: "З нашого магазину на Хрещатику, 25",
    price: 0,
    icon: Store,
  },
];

const paymentMethods = [
  { id: "card", name: "Картка онлайн", icon: CreditCard },
  { id: "cash", name: "Готівка при отриманні", icon: CreditCard },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "success">("form");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDelivery = deliveryMethods.find((d) => d.id === deliveryMethod)!;

  const subtotal = 3198;
  const total = subtotal + selectedDelivery.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate order creation
    await new Promise((r) => setTimeout(r, 1000));
    setStep("success");
    setIsSubmitting(false);
  };

  if (step === "success") {
    return (
      <Layout showFooter={false}>
        <section className="pt-24 sm:pt-32 pb-16">
          <div className="max-w-lg mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-green-500" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif">
              Order <span className="text-rose-400 italic">Підтверджено!</span>
            </h1>
            <p className="text-stone-500 mt-3">
              Дякуємо за замовлення! Наш флорист зв'яжеться з вами найближчим часом для підтвердження деталей.
            </p>
            <p className="text-sm text-stone-400 mt-1 mb-8">
              Order #FB-{Math.floor(Math.random() * 9000) + 1000}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/catalog")} className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl">
                Продовжити покупки
                <Flower2 className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate("/account?tab=orders")} className="border-stone-200 rounded-xl">
                Мої замовлення
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <section className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-stone-400 hover:text-rose-500 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> До кошика
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Оформлення замовлення
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-6">
                {/* Recipient Info */}
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-stone-800 mb-4">Отримувач</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-stone-400 font-medium mb-1.5 block">Ім'я *</label>
                      <Input
                        required
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        className="rounded-xl border-stone-200 h-11"
                        placeholder="Ім'я Прізвище"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-400 font-medium mb-1.5 block">Телефон *</label>
                      <Input
                        required
                        value={formData.recipientPhone}
                        onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                        className="rounded-xl border-stone-200 h-11"
                        placeholder="+380 (__) ___-__-__"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-stone-400 font-medium mb-1.5 block">Email</label>
                      <Input
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                        className="rounded-xl border-stone-200 h-11"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-stone-800 mb-4">Спосіб доставки</h3>
                  <div className="space-y-3">
                    {deliveryMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                          deliveryMethod === method.id
                            ? "border-rose-400 bg-rose-50"
                            : "border-stone-100 hover:border-rose-200"
                        )}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={method.id}
                          checked={deliveryMethod === method.id}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="text-rose-400 focus:ring-rose-400"
                        />
                        <method.icon className={cn(
                          "w-5 h-5",
                          deliveryMethod === method.id ? "text-rose-400" : "text-stone-400"
                        )} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-stone-700">{method.name}</div>
                          <div className="text-xs text-stone-400">{method.desc}</div>
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          method.price === 0 ? "text-green-600" : "text-stone-600"
                        )}>
                          {                          method.price === 0 ? "Безкоштовно" : `₴${method.price}`}
                        </span>
                      </label>
                    ))}
                  </div>

                  {deliveryMethod !== "pickup" && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-stone-400 font-medium mb-1.5 block">Адреса доставки *</label>
                        <Input
                          required
                          value={formData.deliveryAddress}
                          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                          className="rounded-xl border-stone-200 h-11"
                          placeholder="Вулиця, будинок, квартира"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-stone-400 font-medium mb-1.5 block">Дата</label>
                          <Input
                            type="date"
                            value={formData.deliveryDate}
                            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            className="rounded-xl border-stone-200 h-11"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-stone-400 font-medium mb-1.5 block">Час</label>
                          <Input
                            type="time"
                            value={formData.deliveryTime}
                            onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                            className="rounded-xl border-stone-200 h-11"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-stone-800 mb-4">Спосіб оплати</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                          paymentMethod === method.id
                            ? "border-rose-400 bg-rose-50"
                            : "border-stone-100 hover:border-rose-200"
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-rose-400 focus:ring-rose-400"
                        />
                        <method.icon className={cn(
                          "w-5 h-5",
                          paymentMethod === method.id ? "text-rose-400" : "text-stone-400"
                        )} />
                        <span className="text-sm font-medium text-stone-700">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-stone-800 mb-4">Додаткові примітки</h3>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Особливі побажання до замовлення..."
                    className="rounded-xl border-stone-200 resize-none h-24"
                  />
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div>
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm sticky top-24">
                  <h3 className="text-lg font-medium text-stone-800 mb-5">Ваше замовлення</h3>

                  {/* Demo items */}
                  <div className="space-y-3 mb-5">
                    {[
                      { name: "Pink Dream (M)", price: 1299, qty: 1 },
                      { name: "Royal Velvet (L)", price: 1899, qty: 1 },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-stone-500">{item.name} × {item.qty}</span>
                        <span className="text-stone-700">₴{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-stone-100 mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Сума</span>
                      <span className="text-stone-700">₴{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Доставка</span>
                      <span className="text-stone-700">
                        {selectedDelivery.price === 0 ? "Free" : `₴${selectedDelivery.price}`}
                      </span>
                    </div>
                    <hr className="border-stone-100" />
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-stone-800">Разом</span>
                      <span className="text-stone-900">₴{total}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-stone-800 hover:bg-rose-400 text-white rounded-xl py-6 text-base font-normal transition-all duration-300"
                  >
                    {isSubmitting ? "Обробка..." : `Оплатити ₴${total}`}
                    {!isSubmitting && <Check className="ml-2 w-5 h-5" />}
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-6 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Kyiv
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2–4 hrs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
