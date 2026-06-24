import type { IReviewRepository } from "@/core/domain/repositories";
import type { Review } from "@/core/domain/entities";

const DEMO_REVIEWS: Review[] = [
  {
    _id: "r1",
    userName: "Anna K.",
    rating: 5,
    text: "The most beautiful bouquet I've ever received!",
    productId: "1",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    _id: "r2",
    userName: "Maria S.",
    rating: 5,
    text: "Ordered for my mother's birthday. She was delighted!",
    productId: "1",
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    _id: "r3",
    userName: "Ivan P.",
    rating: 4,
    text: "Very beautiful bouquet, exactly as in the photo.",
    productId: "1",
    createdAt: Date.now() - 86400000 * 14,
  },
];

export class ReviewRepository implements IReviewRepository {
  getByProduct(productId: string): Review[] | Promise<Review[]> {
    return DEMO_REVIEWS.filter((r) => r.productId === productId);
  }

  async add(_review: Omit<Review, "_id" | "createdAt"> & { createdAt?: number }): Promise<string> {
    return `review_${Date.now()}`;
  }
}
