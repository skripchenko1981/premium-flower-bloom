import { Link } from "react-router";
import { Flower2 } from "lucide-react";

const footerCategories = [
  { label: "Троянди", to: "/catalog?category=roses" },
  { label: "Тюльпани", to: "/catalog?category=tulips" },
  { label: "Півонії", to: "/catalog?category=peonies" },
  { label: "Орхідеї", to: "/catalog?category=orchids" },
  { label: "Весілля", to: "/catalog?category=wedding" },
  { label: "Подарунки", to: "/catalog?category=gifts" },
];

const footerInfo = [
  { label: "Про нас", to: "/about" },
  { label: "Доставка та оплата", to: "/delivery" },
  { label: "Контакти", to: "/contacts" },
  { label: "FAQ", to: "/delivery" },
];

export function Footer() {
  return (
    <footer className="bg-stone-900 text-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flower2 className="w-7 h-7 text-rose-400" />
              <span className="text-xl font-light font-serif tracking-wide">
                Flower <span className="text-rose-400">Bloom</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Преміум букети, створені з любов'ю. Доставка по місту — сьогодні, вчасно та з усмішкою.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Каталог</h4>
            <div className="space-y-2.5">
              {footerCategories.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  className="block text-stone-400 hover:text-rose-400 text-sm transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Інформація</h4>
            <div className="space-y-2.5">
              {footerInfo.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block text-stone-400 hover:text-rose-400 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Контакти</h4>
            <div className="space-y-2.5 text-stone-400 text-sm">
              <p>+380 (44) 123-45-67</p>
              <p>hello@flowerbloom.ua</p>
              <p>Київ, вул. Хрещатик, 25</p>
              <p className="text-stone-500 text-xs mt-3">Пн—Нд: 8:00 – 22:00</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-xs">© 2025 Flower Bloom. Усі права захищено.</p>
          <div className="flex gap-6">
            <span className="text-stone-500 text-xs hover:text-rose-400 cursor-pointer transition-colors">
              Instagram
            </span>
            <span className="text-stone-500 text-xs hover:text-rose-400 cursor-pointer transition-colors">
              Telegram
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
