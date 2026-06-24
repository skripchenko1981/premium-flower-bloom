import type { IPromocodeRepository } from "@/core/domain/repositories";
import type { Promocode } from "@/core/domain/entities";

const LOCAL_PROMOCODES: Record<string, number> = {
  FLOWER10: 10,
  LOVE15: 15,
  WELCOME5: 5,
};

export class PromocodeRepository implements IPromocodeRepository {
  check(code: string): Pick<Promocode, "code" | "discount"> | null {
    const upper = code.toUpperCase().trim();
    const discount = LOCAL_PROMOCODES[upper];
    if (!discount) return null;
    return { code: upper, discount };
  }

  async apply(code: string): Promise<Pick<Promocode, "code" | "discount">> {
    const result = this.check(code);
    if (!result) throw new Error("Invalid promocode");
    return result;
  }
}
