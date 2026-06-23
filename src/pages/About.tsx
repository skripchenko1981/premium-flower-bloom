import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flower2,
  Heart,
  Award,
  Users,
  ArrowRight,
  GraduationCap,
  Medal,
} from "lucide-react";
import { Link } from "react-router";
import { Layout } from "@/components/Layout";
import { FadeInSection } from "@/components/FadeInSection";
import { images } from "@/lib/data/images";

const florists = [
  { name: "Олена Іванова", role: "Головний флорист", experience: "12 років", image: images.florist1, bio: "Закінчила Київську школу флористики. Учасниця та переможниця міжнародних конкурсів флористики." },
  { name: "Марія Коваленко", role: "Старший флорист", experience: "8 років", image: images.florist2, bio: "Експерт з голландських технік аранжування букетів. Створює авторські композиції." },
  { name: "Катерина Шевченко", role: "Флорист-декоратор", experience: "6 років", image: images.florist3, bio: "Спеціаліст з оформлення заходів та весіль. Перетворює простори на квіткові казки." },
];

const certificates = [
  { title: "Європейський сертифікат флориста", org: "EFDE (European Floral Design Education)", year: "2022" },
  { title: "Диплом професійного флориста", org: "Київська школа флористики та дизайну", year: "2018" },
  { title: "Переможець конкурсу 'Квітковий рай'", org: "Асоціація флористів України", year: "2023" },
  { title: "Нагорода за якість сервісу", org: "Ukrainian E-commerce Award", year: "2024" },
];

const milestones = [
  { year: "2017", title: "Перша студія", desc: "Почали з маленької студії 20 м² і величезної любові до квітів." },
  { year: "2019", title: "Перші 1000 замовлень", desc: "Досягли 1 000 виконаних замовлень і найняли перших 3 флористів." },
  { year: "2021", title: "Власна доставка", desc: "Запустили власну службу доставки для забезпечення свіжості на кожному етапі." },
  { year: "2023", title: "Ребрендинг", desc: "Стали 'Flower Bloom' — преміум-брендом, відомим у всьому місті." },
  { year: "2025", title: "Сьогодні", desc: "Понад 15 000 задоволених клієнтів, 300+ унікальних дизайнів, і ми продовжуємо рости." },
];

export default function About() {
  return (
    <Layout>

      {/* Header */}
      <section className="pt-24 sm:pt-32 pb-8 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none">
              <Flower2 className="w-3.5 h-3.5 mr-2" />
              Наша історія
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              Про <span className="text-rose-400 italic">Flower Bloom</span>
            </h1>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto">
              Більше, ніж просто квітковий магазин — історія любові, творчості та бажання зробити світ красивішим.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeInSection>
              <img
                src={images.workshop}
                alt="Наша майстерня"
                className="rounded-3xl shadow-lg w-full aspect-[4/3] object-cover"
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
                Як усе <span className="text-rose-400 italic">починалося</span>
              </h2>
              <div className="mt-6 space-y-4 text-stone-500 leading-relaxed">
                <p>
                  Flower Bloom народився у 2017 році з простої, але потужної ідеї: зробити свіжі, красиві квіти доступними для кожного. Наша засновниця Олена почала з 20 квадратних метрів і невгамовної пристрасті до флористики.
                </p>
                <p>
                  За ці роки ми виросли в команду з 15 талановитих флористів, дизайнерів і фахівців з логістики. Кожен букет, який ми створюємо, — це маленький витвір мистецтва, створений вручну з любов'ю, увагою до кожної пелюстки та найвищими стандартами якості.
                </p>
                <p>
                  Сьогодні Flower Bloom — один із провідних квіткових магазинів Києва, який щомісяця дарує радість тисячам домівок. Але що не змінилося — це наша відданість свіжості, творчості та особистому підходу, який робить кожне замовлення особливим.
                </p>
              </div>
              <div className="mt-8 flex gap-8">
                {[
                  { icon: Heart, label: "15 000+", sub: "Задоволених клієнтів" },
                  { icon: Flower2, label: "300+", sub: "Дизайнів букетів" },
                  { icon: Award, label: "15+", sub: "Отриманих нагород" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                      <stat.icon className="w-4 h-4" />
                      <span className="text-2xl font-medium text-stone-800 font-serif">{stat.label}</span>
                    </div>
                    <div className="text-xs text-stone-400">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Наш <span className="text-rose-400 italic">Шлях</span>
            </h2>
          </FadeInSection>

          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <FadeInSection key={m.year} delay={i * 0.1}>
                  <div className={`flex items-center gap-6 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? "sm:text-right" : "sm:text-left"} hidden sm:block`}>
                      <div className="text-sm text-stone-400">{m.title}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{m.desc}</div>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-rose-400 text-white flex items-center justify-center text-xs font-medium z-10 shadow-md">
                      {i + 1}
                    </div>
                    <div className="flex-1 sm:hidden">
                      <div className="text-2xl font-light text-rose-400 font-serif mb-1">{m.year}</div>
                      <div className="text-sm font-medium text-stone-800">{m.title}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{m.desc}</div>
                    </div>
                    <div className={`flex-1 ${i % 2 === 0 ? "sm:text-left" : "sm:text-right"} hidden sm:block`}>
                      <div className="text-2xl font-light text-rose-400 font-serif">{m.year}</div>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Florists */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">              <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none mx-auto">
              <Users className="w-3.5 h-3.5 mr-2" />
              Команда
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Наші <span className="text-rose-400 italic">Флористи</span>
            </h2>
            <p className="mt-3 text-stone-500 max-w-lg mx-auto">
              Талановиті професіонали, які вкладають душу в кожен букет.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {florists.map((florist, i) => (
              <FadeInSection key={florist.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={florist.image}
                      alt={florist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-stone-800">{florist.name}</h3>
                    <p className="text-sm text-rose-400 font-medium mb-3">{florist.role}</p>
                    <p className="text-xs text-stone-400 flex items-center gap-1.5 mb-3">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Досвід: {florist.experience}
                    </p>
                    <p className="text-sm text-stone-500 leading-relaxed">{florist.bio}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Сертифікати та <span className="text-rose-400 italic">Нагороди</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {certificates.map((cert, i) => (
              <FadeInSection key={cert.title} delay={i * 0.1}>
                <div className="bg-[#fefdfb] rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                    <Medal className="w-7 h-7 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-medium text-stone-800 mb-1.5">{cert.title}</h4>
                  <p className="text-xs text-stone-400">{cert.org}</p>
                  <p className="text-xs text-rose-400 font-medium mt-2">{cert.year}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Готові створити{" "}
              <span className="text-rose-400 italic">щось прекрасне</span>?
            </h2>
            <p className="mt-3 text-stone-500">
              Оберіть букет з нашого каталогу або зв'яжіться з нами для індивідуального замовлення.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl px-8 py-6 text-base font-normal shadow-lg shadow-rose-200/50">
                  Переглянути каталог
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contacts">
                <Button variant="outline" className="border-stone-200 hover:border-rose-200 rounded-xl px-8 py-6 text-base font-normal text-stone-600">
                  Зв'язатися з нами
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </Layout>
  );
}
