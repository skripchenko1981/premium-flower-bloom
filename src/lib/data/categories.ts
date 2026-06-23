import { images } from "./images";

export interface Category {
  name: string;
  slug: string;
  image: string;
  count: number;
}

export const categories: Category[] = [
  { name: "Троянди", slug: "roses", image: images.rose, count: 24 },
  { name: "Тюльпани", slug: "tulips", image: images.tulip, count: 16 },
  { name: "Півонії", slug: "peonies", image: images.peony, count: 12 },
  { name: "Орхідеї", slug: "orchids", image: images.orchid, count: 18 },
  { name: "Весілля", slug: "wedding", image: images.wedding, count: 30 },
  { name: "Авторські", slug: "author", image: images.bouquet1, count: 15 },
  { name: "Рослини", slug: "plants", image: images.plants, count: 10 },
  { name: "Подарунки", slug: "gifts", image: images.gifts, count: 20 },
];

/** For filter tabs that include "All" option */
export const categoriesWithAll = [
  { name: "Усі", slug: "" },
  ...categories,
];

/** Lookup by slug */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
