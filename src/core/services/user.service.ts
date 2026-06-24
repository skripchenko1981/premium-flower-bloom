import type { IUserService } from "@/core/domain/services";
import type { IUserRepository } from "@/core/domain/repositories";
import type { UserProfile } from "@/core/domain/entities";

export class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepository) {}

  getCurrentUser(): UserProfile | null {
    return this.userRepo.getCurrent();
  }

  updateProfile(data: Partial<Pick<UserProfile, "name" | "phone" | "address">>): void {
    this.userRepo.update(data);
  }
}
