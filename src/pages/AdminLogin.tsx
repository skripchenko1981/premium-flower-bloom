import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useAction } from "convex/react";
import { api as convexApi } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flower2, Lock, User as UserIcon, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

const TOKEN_STORAGE_KEY = "admin_token";
const USERNAME_STORAGE_KEY = "admin_username";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const verify = useAction(convexApi.adminAuth.verifyAdminCredentials);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await verify({ username, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      localStorage.setItem(USERNAME_STORAGE_KEY, result.username);
      const redirectTo =
        (location.state as { from?: string } | null)?.from || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не вдалося увійти. Перевірте логін і пароль.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefdfb] flex flex-col">
      {/* Decorative backdrop */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, oklch(0.92 0.06 10 / 0.5), transparent 45%), radial-gradient(circle at 85% 80%, oklch(0.9 0.05 80 / 0.45), transparent 45%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md px-4"
        >
          <Card className="border-stone-200 shadow-xl shadow-stone-900/5">
            <CardHeader className="text-center space-y-3">
              <div className="flex justify-center pt-2">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-50 flex items-center justify-center border border-rose-200">
                    <Flower2 className="w-7 h-7 text-rose-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-serif font-light tracking-tight text-stone-900">
                  Вхід до адмінпанелі
                </CardTitle>
                <CardDescription className="text-stone-500 mt-1.5">
                  Flower Bloom Admin Panel
                </CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-login"
                    className="text-xs font-medium text-stone-600 mb-1.5 block"
                  >
                    Логін
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                      id="admin-login"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9 h-11 rounded-xl"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-medium text-stone-600 mb-1.5 block"
                  >
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 h-11 rounded-xl"
                      disabled={isLoading}
                      required
                      minLength={1}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Сховати пароль" : "Показати пароль"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    {error}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex-col gap-3 pb-6">
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-rose-400 hover:bg-rose-500 text-white shadow-sm"
                  disabled={isLoading || !username || !password}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Вхід...
                    </>
                  ) : (
                    <>
                      Увійти
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-stone-400 text-center">
                  Доступ тільки для авторизованих адміністраторів. Логін і пароль
                  зберігаються в змінних середовища сервера.
                </p>
              </CardFooter>
            </form>
          </Card>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-stone-500 hover:text-rose-500 transition-colors"
            >
              ← Повернутися на головну
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USERNAME_STORAGE_KEY);
}

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
