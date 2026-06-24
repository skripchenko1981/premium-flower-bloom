import type { IContactService } from "@/core/domain/services";
import type { IContactRepository } from "@/core/domain/repositories";
import type { ContactMessage } from "@/core/domain/entities";

export class ContactService implements IContactService {
  constructor(private readonly contactRepo: IContactRepository) {}

  submit(data: Pick<ContactMessage, "name" | "email" | "phone" | "message">): void {
    this.contactRepo.submit(data);
  }

  getMessages(): ContactMessage[] {
    return this.contactRepo.getAll();
  }
}
