import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Flower2,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { FadeInSection } from "@/components/FadeInSection";

export default function Contacts() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setIsSubmitting(false);
    toast("Повідомлення надіслано!", { description: "Ми відповімо вам найближчим часом." });
  };

  return (
    <Layout>

      {/* Header */}
      <section className="pt-24 sm:pt-32 pb-8 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none">
              <MessageCircle className="w-3.5 h-3.5 mr-2" />
              Зв'язок
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              <span className="text-rose-400 italic">Напишіть</span> нам
            </h1>
            <p className="mt-3 text-stone-500 max-w-lg mx-auto">
              Ми завжди раді допомогти! Залиште повідомлення, і наш менеджер зв'яжеться з вами.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <FadeInSection>
              <h2 className="text-2xl sm:text-3xl font-light text-stone-900 font-serif tracking-tight mb-8">
                Наші <span className="text-rose-400 italic">контакти</span>
              </h2>

              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Телефон", value: "+380 (44) 123-45-67", desc: "Пн–Нд, 8:00–22:00" },
                  { icon: Mail, label: "Email", value: "hello@flowerbloom.ua", desc: "Відповідаємо протягом 2 годин" },
                  { icon: MapPin, label: "Адреса", value: "м. Київ, вул. Хрещатик, 25", desc: "Центр міста" },
                  { icon: Clock, label: "Години роботи", value: "Щодня 8:00 – 22:00", desc: "Без вихідних" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 font-medium mb-0.5">{item.label}</div>
                      <div className="text-base font-medium text-stone-800">{item.value}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-2 mb-2">
                  <Flower2 className="w-5 h-5 text-rose-400" />
                  <span className="text-base font-medium text-stone-800">Соціальні мережі</span>
                </div>
                <p className="text-sm text-stone-500 mb-4">Слідкуйте за нами в соціальних мережах, щоб бачити наші новинки!</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-xl border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-200 transition-all">
                    Instagram
                  </Button>
                  <Button variant="outline" className="rounded-xl border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-200 transition-all">
                    Telegram
                  </Button>
                </div>
              </div>
            </FadeInSection>

            {/* Contact Form */}
            <FadeInSection delay={0.2}>
              <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
                <h3 className="text-xl font-medium text-stone-800 mb-6">Форма зворотного зв'язку</h3>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h4 className="text-lg font-medium text-stone-800 mb-1">Дякуємо!</h4>
                    <p className="text-sm text-stone-500 mb-6">Ваше повідомлення надіслано. Ми відповімо вам найближчим часом.</p>
                    <Button
                      variant="outline"
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                      className="rounded-xl border-stone-200 text-stone-600"
                    >
                      Надіслати ще одне
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs text-stone-400 font-medium mb-1.5 block">Ім'я *</label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Як до вас звертатися?"
                        className="rounded-xl border-stone-200 h-11"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-stone-400 font-medium mb-1.5 block">Email *</label>
                        <Input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="email@example.com"
                          className="rounded-xl border-stone-200 h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400 font-medium mb-1.5 block">Телефон</label>
                        <Input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+380 (__) ___-__-__"
                          className="rounded-xl border-stone-200 h-11"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-stone-400 font-medium mb-1.5 block">Повідомлення *</label>
                      <Textarea
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Напишіть ваше повідомлення..."
                        className="rounded-xl border-stone-200 resize-none h-32"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-rose-400 hover:bg-rose-500 text-white rounded-xl h-12 text-base font-normal transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Надсилання...
                        </>
                      ) : (
                        <>
                          Надіслати повідомлення
                          <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </Layout>
  );
}
