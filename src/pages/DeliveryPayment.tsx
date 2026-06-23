import { useState } from "react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
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
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const faqs = [
  { q: "What is the minimum order amount?", a: "The minimum order is ₴500. For orders over ₴2,000, delivery within the city is free." },
  { q: "Can I change the delivery address after placing an order?", a: "Yes, you can change the address before the courier departs. Please call us at +380 (44) 123-45-67." },
  { q: "What payment methods are available?", a: "We accept online card payments (Visa, Mastercard), cash on delivery, and Apple/Google Pay." },
  { q: "How are flowers packed?", a: "Each bouquet is packed in a premium kraft paper wrapper with a hydration pack. We also add fresh flower food for longevity." },
  { q: "Can I return the bouquet?", a: "According to Ukrainian law, flowers are not subject to return or exchange. However, if the flowers arrive wilted, we will replace them." },
  { q: "Do you deliver outside the city?", a: "Yes, we deliver to the suburbs and region for an additional fee. Check with our manager for rates." },
  { q: "How long do flowers last?", a: "With proper care (daily water change, trimmed stems), roses can last 7–14 days, tulips 5–7 days, and orchids several weeks." },
  { q: "Can I order anonymously for a recipient?", a: "Of course! In the order notes, simply specify that you don't want to reveal your name to the recipient." },
];

function FadeInSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function DeliveryPayment() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <Navbar />

      {/* Header */}
      <section className="pt-24 sm:pt-32 pb-8 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none">
              <Truck className="w-3.5 h-3.5 mr-2" />
              Information
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              Delivery & <span className="text-rose-400 italic">Payment</span>
            </h1>
            <p className="mt-3 text-stone-500 max-w-lg mx-auto">
              We make sure your flowers arrive fresh, on time, and beautifully presented.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Delivery Methods */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Delivery <span className="text-rose-400 italic">Methods</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Clock,
                title: "Express Delivery",
                price: "₴300",
                desc: "Within 60–90 minutes of order confirmation. The fastest way to send flowers.",
                features: ["Delivery in 60–90 min", "SMS notification", "Courier tracking"],
              },
              {
                icon: Truck,
                title: "Standard Delivery",
                price: "₴150 / Free from ₴2000",
                desc: "Within 2–4 hours. Available throughout the city every day.",
                features: ["Delivery in 2–4 hours", "Free for orders over ₴2000", "Contactless delivery available"],
              },
              {
                icon: Store,
                title: "Pickup",
                price: "Free",
                desc: "Pick up your bouquet at our store. We'll have it ready at the agreed time.",
                features: ["Khreshchatyk St, 25", "Mon–Sun, 8:00–22:00", "Pre-order recommended"],
              },
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

      {/* Delivery Zones */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Delivery <span className="text-rose-400 italic">Zones</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { zone: "Center", price: "from ₴150", areas: "Shevchenkivskyi, Pecherskyi, Podilskyi", time: "60–90 min" },
              { zone: "Near Center", price: "from ₴200", areas: "Holosiivskyi, Solomianskyi, Darnytskyi", time: "90–120 min" },
              { zone: "Outskirts", price: "from ₴300", areas: "Obolonskyi, Desnianskyi, Sviatoshynskyi", time: "2–3 hours" },
              { zone: "Suburbs", price: "from ₴500", areas: "Brovary, Boryspil, Irpin, Vyshneve", time: "3–5 hours" },
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

      {/* Payment Methods */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Payment <span className="text-rose-400 italic">Methods</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: CreditCard, title: "Card Online", desc: "Visa, Mastercard. Secure payment via LiqPay." },
              { icon: Wallet, title: "Cash on Delivery", desc: "Pay the courier upon receiving your order." },
              { icon: Smartphone, title: "Apple / Google Pay", desc: "Quick and secure one-tap payment." },
              { icon: Banknote, title: "Bank Transfer", desc: "For corporate clients. Invoice provided." },
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

      {/* Guarantees */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Our <span className="text-rose-400 italic">Guarantees</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: ShieldCheck, title: "Freshness Guarantee", desc: "If the flowers wilt within 3 days, we will replace the bouquet free of charge." },
              { icon: Package, title: "Secure Packaging", desc: "Each bouquet is packed in a hydration pack and kraft wrapper. Protected from wind, cold, and heat." },
              { icon: Flower2, title: "Photo Before Delivery", desc: "We send a photo of the finished bouquet before the courier departs so you know exactly what's being delivered." },
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

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Frequently Asked <span className="text-rose-400 italic">Questions</span>
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
    </div>
  );
}
