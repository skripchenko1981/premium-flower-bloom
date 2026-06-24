import type { IReviewService } from "@/core/domain/services";
import type { IReviewRepository } from "@/core/domain/repositories";
import type { Review } from "@/core/domain/entities";

export class ReviewService implements IReviewService {
  private reviewRepo: IReviewRepository;

  constructor(reviewRepo: IReviewRepository) {
    this.reviewRepo = reviewRepo;
  }

  getByProduct(productId: string): Review[] | Promise<Review[]> {
    return this.reviewRepo.getByProduct(productId);
  }

  addReview(productId: string, rating: number, text: string, userName?: string): string | Promise<string> {
    return this.reviewRepo.add({
      productId,
      rating,
      text,
      userName: userName ?? "Anonymous",
    });
  }
}
