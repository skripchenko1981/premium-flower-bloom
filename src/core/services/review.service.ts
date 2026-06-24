import type { IReviewService } from "@/core/domain/services";
import type { IReviewRepository } from "@/core/domain/repositories";
import type { Review } from "@/core/domain/entities";

export class ReviewService implements IReviewService {
  constructor(private readonly reviewRepo: IReviewRepository) {}

  getByProduct(productId: string): Review[] {
    return this.reviewRepo.getByProduct(productId);
  }

  addReview(productId: string, rating: number, text: string, userName?: string): string {
    return this.reviewRepo.add({
      productId,
      rating,
      text,
      userName: userName ?? "Anonymous",
      userId: undefined,
    });
  }
}
