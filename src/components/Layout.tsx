import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  /** Whether to show the footer. Default true. */
  showFooter?: boolean;
  className?: string;
}

export function Layout({ children, showFooter = true, className }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-[#fefdfb]", className)}>
      <Navbar />
      {children}
      {showFooter && <Footer />}
    </div>
  );
}
