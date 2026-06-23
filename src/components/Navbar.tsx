import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  Flower2,
  Search,
  ChevronDown,
  LogOut,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  {
    href: "#",
    label: "Квіти",
    children: [
      { href: "/catalog?category=roses", label: "Троянди" },
      { href: "/catalog?category=tulips", label: "Тюльпани" },
      { href: "/catalog?category=peonies", label: "Півонії" },
      { href: "/catalog?category=orchids", label: "Орхідеї" },
      { href: "/catalog?category=wedding", label: "Весілля" },
      { href: "/catalog?category=author", label: "Авторські" },
      { href: "/catalog?category=plants", label: "Рослини" },
      { href: "/catalog?category=gifts", label: "Подарунки" },
    ],
  },
  { href: "/delivery", label: "Доставка та оплата" },
  { href: "/about", label: "Про нас" },
  { href: "/contacts", label: "Контакти" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, signOut } = useAuth();

  const cartItems = useQuery(api.shop.getCartItems) ?? [];
  const wishlistItems = useQuery(api.shop.getWishlist) ?? [];
  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-100"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="relative">
                <Flower2
                  className={cn(
                    "w-8 h-8 transition-all duration-300",
                    isScrolled ? "text-rose-400" : "text-rose-500"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-xl md:text-2xl font-light tracking-wide transition-colors duration-300 font-serif",
                  isScrolled ? "text-stone-800" : "text-stone-900"
                )}
              >
                Flower{" "}
                <span className="text-rose-400 font-medium">Bloom</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all duration-200",
                        location.pathname === "/catalog"
                          ? "text-rose-500"
                          : "text-stone-600 hover:text-rose-500 hover:bg-rose-50/50"
                      )}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-stone-100 py-2 overflow-hidden"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="block px-4 py-2.5 text-sm text-stone-600 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      location.pathname === link.href
                        ? "text-rose-500"
                        : "text-stone-600 hover:text-rose-500 hover:bg-rose-50/50"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => navigate("/catalog")}
                className="p-2.5 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 hidden sm:block"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-400 text-white rounded-full text-[10px] font-medium flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-400 text-white rounded-full text-[10px] font-medium flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Auth */}
              {!isLoading &&
                (isAuthenticated ? (
                  <div className="relative group hidden sm:block">
                    <button className="p-2.5 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200">
                      <User className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/account"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 hover:text-rose-500 hover:bg-rose-50"
                      >
                        <User className="w-4 h-4" /> Профіль
                      </Link>
                      <Link
                        to="/account?tab=orders"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 hover:text-rose-500 hover:bg-rose-50"
                      >
                        <Package className="w-4 h-4" /> Замовлення
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 hover:text-red-500 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Вийти
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/auth" className="hidden sm:block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all">Увійти</Button>
                  </Link>
                ))}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 lg:hidden"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-white border-b border-stone-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <div
                      className={cn(
                        "px-3 py-3 rounded-lg text-base font-medium",
                        location.pathname === "/catalog"
                          ? "text-rose-500 bg-rose-50"
                          : "text-stone-700"
                      )}
                    >
                      {link.label}
                    </div>
                    <div className="ml-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-rose-500 hover:bg-rose-50/50"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "block px-3 py-3 rounded-lg text-base font-medium",
                      location.pathname === link.href
                        ? "text-rose-500 bg-rose-50"
                        : "text-stone-700 hover:text-rose-500 hover:bg-rose-50/50"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <hr className="my-2 border-stone-100" />
              {!isLoading && !isAuthenticated && (
                <Link
                  to="/auth"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-rose-500 hover:bg-rose-50"
                >
                  Увійти / Зареєструватися
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:text-rose-500 hover:bg-rose-50"
                  >
                    <User className="w-4 h-4" /> Профіль
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:text-red-500 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Вийти
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
