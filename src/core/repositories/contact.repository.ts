import type { IContactRepository } from "@/core/domain/repositories";
import type { ContactMessage } from "@/core/domain/entities";

export class ContactRepository implements IContactRepository {
  async submit(
    _data: Pick<ContactMessage, "name" | "email" | "phone" | "message">,
  ): Promise<void> {
    // Delegates to Convex mutation in production
  }

  getAll(): ContactMessage[] | Promise<ContactMessage[]> {
    return [];
  }
}
