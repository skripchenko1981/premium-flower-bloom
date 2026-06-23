import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  Package,
  Flower2,
  Wallet,
  Banknote,
  Smartphone,
  Store,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/Layout";
import { FadeInSection } from "@/components/FadeInSection";

const faqs = [
  { q: "Яка мінімальна сума замовлення?", a: "Мінімальне замовлення — ₴500. Для замовлень понад ₴2 000 доставка по місту безкоштовна." },
  { q: "Чи можна змінити адресу доставки після оформлення замовлення?", a: "Так, ви можете змінити адресу до виїзду кур'єра. Зателефонуйте нам за номером +380 (44) 123-45-67." },
  { q: "Які способи оплати доступні?", a: "Приймаємо онлайн-оплату картками (Visa, Mastercard), готівкою при отриманні та Apple/Google Pay." },
  { q: "Як упаковуються квіти?", a: "Кожен букет упаковується в преміум крафтовий папір із гідратаційним пакетом. Також додаємо свіжу підкормку для квітів." },
  { q: "Чи можна повернути букет?", a: "Відповідно до українського законодавства, квіти не підлягають поверненню чи обміну. Однак, якщо квіти прибули зів'ялими, ми їх замінимо." },
  { q: "Чи доставляєте ви за межі міста?", a: "Так, доставляємо в передмістя та область за додаткову плату. Уточнюйте вартість у менеджера." },
  { q: "Як довго стоять квіти?", a: "При належному догляді (щоденна зміна води, підрізання стебел) троянди можуть стояти 7–14 днів, тюльпани 5–7 днів, орхідеї — кілька тижнів." },
  { q: "Чи можна замовити анонімно для отримувача?", a: "Звісно! У примітках до замовлення просто вкажіть, що не хочете розкривати своє ім'я отримувачу." },
];

export default function DeliveryPayment() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <section className="pt-24 sm:pt-32 pb-8 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none">
              <Truck className="w-3.5 h-3.5 mr-2" />
              Інформація
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              Доставка та <span className="text-rose-400 italic">Оплата</span>
            </h1>
            <p className="mt-3 text-stone-500 max-w-lg mx-auto">
              Ми дбаємо про те, щоб ваші квіти прибули свіжими, вчасно та в гарному оформленні.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Способи <span className="text-rose-400 italic">доставки</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Clock, title: "Експрес доставка", price: "₴300", desc: "Протягом 60–90 хвилин після підтвердження замовлення.", features: ["Доставка за 60–90 хв", "SMS-сповіщення", "Відстеження кур'єра"] },
              { icon: Truck, title: "Стандартна доставка", price: "₴150 / Безкоштовно від ₴2000", desc: "Протягом 2–4 годин. Доступна по всьому місту щодня.", features: ["Доставка за 2–4 години", "Безкоштовно для замовлень від ₴2000", "Доступна безконтактна доставка"] },
              { icon: Store, title: "Самовивіз", price: "Безкоштовно", desc: "Заберіть свій букет у нашому магазині.", features: ["вул. Хрещатик, 25", "Пн–Нд, 8:00–22:00", "Рекомендуємо попереднє замовлення"] },
            ].map((method, i) => (
              <FadeInSection key={method.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-5">
                    <method.icon className="w-6 h-6 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-800 mb-1">{method.title}</h3>
                  <p className="text-xl font-medium text-rose-400 mb-3">{method.price}</p>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">{method.desc}</p>
                  <ul className="space-y-2">
                    {method.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-stone-500">
                        <div className="w-1 h-1 rounded-full bg-rose-300 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Зони <span className="text-rose-400 italic">доставки</span>
            </h2>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { zone: "Центр", price: "від ₴150", areas: "Шевченківський, Печерський, Подільський", time: "60–90 хв" },
              { zone: "Ближче до центру", price: "від ₴200", areas: "Голосіївський, Солом'янський, Дарницький", time: "90–120 хв" },
              { zone: "Околиці", price: "від ₴300", areas: "Оболонський, Деснянський, Святошинський", time: "2–3 години" },
              { zone: "Передмістя", price: "від ₴500", areas: "Бровари, Бориспіль, Ірпінь, Вишневе", time: "3–5 годин" },
            ].map((zone, i) => (
              <FadeInSection key={zone.zone} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-stone-100 bg-[#fefdfb] hover:border-rose-100 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span className="font-medium text-stone-800">{zone.zone}</span>
                  </div>
                  <p className="text-2xl font-medium text-stone-800 mb-2">{zone.price}</p>
                  <p className="text-xs text-stone-400 mb-1">{zone.areas}</p>
                  <p className="text-xs text-rose-400 font-medium">{zone.time}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Способи <span className="text-rose-400 italic">оплати</span>
            </h2>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: CreditCard, title: "Картка онлайн", desc: "Visa, Mastercard. Безпечний платіж через LiqPay." },
              { icon: Wallet, title: "Готівка при отриманні", desc: "Оплатіть кур'єру при отриманні замовлення." },
              { icon: Smartphone, title: "Apple / Google Pay", desc: "Швидкий і безпечний платіж в один дотик." },
              { icon: Banknote, title: "Банківський переказ", desc: "Для корпоративних клієнтів. Надається рахунок." },
            ].map((method, i) => (
              <FadeInSection key={method.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-medium text-stone-800 mb-1.5">{method.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{method.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Наші <span className="text-rose-400 italic">Гарантії</span>
            </h2>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: ShieldCheck, title: "Гарантія свіжості", desc: "Якщо квіти зів'януть протягом 3 днів, ми замінимо букет безкоштовно." },
              { icon: Package, title: "Надійне пакування", desc: "Кожен букет упакований у гідратаційний пакет та крафтову обгортку." },
              { icon: Flower2, title: "Фото перед відправкою", desc: "Надсилаємо фото готового букета перед виїздом кур'єра." },
            ].map((g, i) => (
              <FadeInSection key={g.title} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-stone-100 bg-[#fefdfb] hover:border-green-100 transition-all duration-300 text-center">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                    <g.icon className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-800 mb-2">{g.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{g.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Часті <span className="text-rose-400 italic">Запитання</span>
            </h2>
          </FadeInSection>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeInSection key={i} delay={i * 0.05}>
                <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-stone-800 pr-4">{faq.q}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200",
                      openFaq === i && "rotate-180"
                    )} />
                  </button>
                  <div className={cn(
                    "grid transition-all duration-200",
                    openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-stone-500 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
