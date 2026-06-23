import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flower2,
  Heart,
  Award,
  Star,
  Users,
  ArrowRight,
  Leaf,
  ShieldCheck,
  GraduationCap,
  Medal,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router";

const images = {
  florist1: "https://images.unsplash.com/photo-1557428894-56bcc97113fe?w=600&q=80",
  florist2: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&q=80",
  florist3: "https://images.unsplash.com/photo-1607749092259-5e70e7b6e081?w=600&q=80",
  workshop: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
};

const florists = [
  { name: "Olena Ivanova", role: "Head Florist", experience: "12 years", image: images.florist1, bio: "Graduated from the Kyiv School of Floristry. Participant and winner of international floristry competitions. Specializes in wedding arrangements." },
  { name: "Maria Kovalenko", role: "Senior Florist", experience: "8 years", image: images.florist2, bio: "Expert in Dutch techniques of bouquet arrangement. Creates author's compositions that become the highlight of any event." },
  { name: "Kateryna Shevchenko", role: "Florist-Decorator", experience: "6 years", image: images.florist3, bio: "Specialist in event and wedding decoration. Transforms spaces into flower fairy tales." },
];

const certificates = [
  { title: "European Floristry Certificate", org: "EFDE (European Floral Design Education)", year: "2022" },
  { title: "Diploma of Professional Florist", org: "Kyiv School of Floristry & Design", year: "2018" },
  { title: "Winner — 'Flower Paradise' Competition", org: "Ukrainian Florists Association", year: "2023" },
  { title: "Quality Service Award", org: "Ukrainian E-commerce Award", year: "2024" },
];

const milestones = [
  { year: "2017", title: "First Studio", desc: "Started with a small studio of 20 m² and a huge love for flowers." },
  { year: "2019", title: "First 1000 Orders", desc: "Reached 1,000 fulfilled orders and hired the first 3 florists." },
  { year: "2021", title: "Own Delivery", desc: "Launched our own delivery service to ensure freshness at every stage." },
  { year: "2023", title: "Rebranding", desc: "Became 'Flower Bloom' — a premium brand known across the city." },
  { year: "2025", title: "Today", desc: "Over 15,000 happy clients, 300+ unique designs, and we keep growing." },
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

export default function About() {
  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <Navbar />

      {/* Header */}
      <section className="pt-24 sm:pt-32 pb-8 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none">
              <Flower2 className="w-3.5 h-3.5 mr-2" />
              Our Story
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 font-serif tracking-tight">
              About <span className="text-rose-400 italic">Flower Bloom</span>
            </h1>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto">
              More than just a flower shop — a story of love, creativity, and the desire to make the world more beautiful.
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
                alt="Our workshop"
                className="rounded-3xl shadow-lg w-full aspect-[4/3] object-cover"
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
                How it all <span className="text-rose-400 italic">began</span>
              </h2>
              <div className="mt-6 space-y-4 text-stone-500 leading-relaxed">
                <p>
                  Flower Bloom was born in 2017 from a simple but powerful idea: to make fresh, beautiful flowers accessible to everyone. Our founder, Olena, started with 20 square meters and a relentless passion for floristry.
                </p>
                <p>
                  Over the years, we've grown into a team of 15 talented florists, designers, and logistics specialists. Each bouquet we create is a small work of art — handcrafted with love, attention to every petal, and the highest quality standards.
                </p>
                <p>
                  Today, Flower Bloom is one of the leading flower shops in Kyiv, delivering joy to thousands of homes every month. But what hasn't changed is our commitment to freshness, creativity, and the personal touch that makes every order special.
                </p>
              </div>
              <div className="mt-8 flex gap-8">
                {[
                  { icon: Heart, label: "15,000+", sub: "Happy clients" },
                  { icon: Flower2, label: "300+", sub: "Bouquet designs" },
                  { icon: Award, label: "15+", sub: "Awards won" },
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
              Our <span className="text-rose-400 italic">Journey</span>
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
          <FadeInSection className="text-center mb-14">
            <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none mx-auto">
              <Users className="w-3.5 h-3.5 mr-2" />
              Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-light text-stone-900 font-serif tracking-tight">
              Our <span className="text-rose-400 italic">Florists</span>
            </h2>
            <p className="mt-3 text-stone-500 max-w-lg mx-auto">
              Talented professionals who put their heart into every bouquet.
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
                      Experience: {florist.experience}
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
              Certificates & <span className="text-rose-400 italic">Awards</span>
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
              Ready to create{" "}
              <span className="text-rose-400 italic">something beautiful</span>?
            </h2>
            <p className="mt-3 text-stone-500">
              Choose a bouquet from our catalog or contact us for a custom arrangement.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl px-8 py-6 text-base font-normal shadow-lg shadow-rose-200/50">
                  Browse Catalog
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contacts">
                <Button variant="outline" className="border-stone-200 hover:border-rose-200 rounded-xl px-8 py-6 text-base font-normal text-stone-600">
                  Contact Us
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
