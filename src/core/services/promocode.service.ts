import type { IPromocodeService } from "@/core/domain/services";
import type { IPromocodeRepository } from "@/core/domain/repositories";
import type { Promocode } from "@/core/domain/entities";

export class PromocodeService implements IPromocodeService {
  constructor(private readonly promocodeRepo: IPromocodeRepository) {}

  check(code: string): Pick<Promocode, "code" | "discount"> | null {
    return this.promocodeRepo.check(code);
  }

  apply(code: string): Pick<Promocode, "code" | "discount"> {
    return this.promocodeRepo.apply(code);
  }
}
