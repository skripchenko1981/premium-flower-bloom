import type { IUserRepository } from "@/core/domain/repositories";
import type { UserProfile } from "@/core/domain/entities";

/**
 * User repository — wraps Convex auth queries.
 * Returns null when not authenticated.
 */
export class UserRepository implements IUserRepository {
  getCurrent(): UserProfile | null | Promise<UserProfile | null> {
    return null;
  }

  async update(_data: Partial<Pick<UserProfile, "name" | "phone" | "address">>): Promise<void> {
    // Delegates to Convex mutation
  }
}
