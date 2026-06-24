import React, { createContext, useContext } from "react";
import type {
  IProductRepository,
  ICategoryRepository,
  ICartRepository,
  IOrderRepository,
  IReviewRepository,
  IUserRepository,
  IPromocodeRepository,
  IContactRepository,
} from "@/core/domain/repositories";
import type { IProductService, ICategoryService, ICartService, IOrderService, IReviewService, IUserService, IPromocodeService, IContactService } from "@/core/domain/services";

// ─── DI Container ──────────────────────────────────────────────────────────

export interface Dependencies {
  productRepository: IProductRepository;
  categoryRepository: ICategoryRepository;
  cartRepository: ICartRepository;
  orderRepository: IOrderRepository;
  reviewRepository: IReviewRepository;
  userRepository: IUserRepository;
  promocodeRepository: IPromocodeRepository;
  contactRepository: IContactRepository;
  productService: IProductService;
  categoryService: ICategoryService;
  cartService: ICartService;
  orderService: IOrderService;
  reviewService: IReviewService;
  userService: IUserService;
  promocodeService: IPromocodeService;
  contactService: IContactService;
}

// ─── React Context ─────────────────────────────────────────────────────────

const DiContext = createContext<Dependencies | null>(null);

export function DiProvider({
  dependencies,
  children,
}: {
  dependencies: Dependencies;
  children: React.ReactNode;
}) {
  return <DiContext.Provider value={dependencies}>{children}</DiContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useDi(): Dependencies {
  const ctx = useContext(DiContext);
  if (!ctx) {
    throw new Error(
      "useDi() must be used within a <DiProvider>. " +
        "Wrap your app root with <DiProvider dependencies={...}>.",
    );
  }
  return ctx;
}

// ─── Individual hooks for ergonomic access ─────────────────────────────────

export function useProductRepository(): IProductRepository {
  return useDi().productRepository;
}

export function useCategoryRepository(): ICategoryRepository {
  return useDi().categoryRepository;
}

export function useCartRepository(): ICartRepository {
  return useDi().cartRepository;
}

export function useProductService(): IProductService {
  return useDi().productService;
}

export function useCategoryService(): ICategoryService {
  return useDi().categoryService;
}

export function useCartService(): ICartService {
  return useDi().cartService;
}

export function useOrderService(): IOrderService {
  return useDi().orderService;
}

export function useReviewService(): IReviewService {
  return useDi().reviewService;
}

export function useUserService(): IUserService {
  return useDi().userService;
}

export function usePromocodeService(): IPromocodeService {
  return useDi().promocodeService;
}

export function useContactService(): IContactService {
  return useDi().contactService;
}
