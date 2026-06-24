import type { IContactService } from "@/core/domain/services";
import type { IContactRepository } from "@/core/domain/repositories";
import type { ContactMessage } from "@/core/domain/entities";

export class ContactService implements IContactService {
  private contactRepo: IContactRepository;

  constructor(contactRepo: IContactRepository) {
    this.contactRepo = contactRepo;
  }

  submit(data: Pick<ContactMessage, "name" | "email" | "phone" | "message">): void | Promise<void> {
    return this.contactRepo.submit(data);
  }

  getMessages(): ContactMessage[] | Promise<ContactMessage[]> {
    return this.contactRepo.getAll();
  }
}
