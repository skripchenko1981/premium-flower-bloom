import type { IUserService } from "@/core/domain/services";
import type { IUserRepository } from "@/core/domain/repositories";
import type { UserProfile } from "@/core/domain/entities";

export class UserService implements IUserService {
  private userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  getCurrentUser(): UserProfile | null | Promise<UserProfile | null> {
    return this.userRepo.getCurrent();
  }

  updateProfile(data: Partial<Pick<UserProfile, "name" | "phone" | "address">>): void | Promise<void> {
    return this.userRepo.update(data);
  }
}
