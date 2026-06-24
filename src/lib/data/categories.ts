import { images } from "./images";

export interface Category {
  name: string;
  slug: string;
  image: string;
  count: number;
  description: string;
  order: number;
}

export const categories: Category[] = [
  {
    name: "Троянди",
    slug: "roses",
    image: images.rose,
    count: 6,
    order: 1,
    description:
      "Королева квітів — троянди завжди залишаються поза часом. Від червоних еквадорських до ніжних кремових та білих. Кожна троянда в наших букетах — ручного відбору.",
  },
  {
    name: "Тюльпани",
    slug: "tulips",
    image: images.tulip,
    count: 4,
    order: 2,
    description:
      "Голландські тюльпани — символ весни та оновлення. Наші букети складаються зі свіжозрізаних квітів найкращих сортів з Нідерландів.",
  },
  {
    name: "Півонії",
    slug: "peonies",
    image: images.peony,
    count: 3,
    order: 3,
    description:
      "Пивонії — втілення ніжності та розкоші. Неймовірно пишні, ароматні квіти, що стають окрасою будь-якої події.",
  },
  {
    name: "Орхідеї",
    slug: "orchids",
    image: images.orchid,
    count: 3,
    order: 4,
    description:
      "Екзотичні орхідеї фаленопсис та дендробіум — вишуканий подарунок для особливих людей. Живуть і квітнуть місяцями.",
  },
  {
    name: "Авторські",
    slug: "author",
    image: images.bouquet1,
    count: 5,
    order: 5,
    description:
      "Унікальні композиції від наших флористів. Кожен букет — авторська робота, створена з урахуванням ваших побажань.",
  },
  {
    name: "Весілля",
    slug: "wedding",
    image: images.wedding,
    count: 3,
    order: 6,
    description:
      "Все для найважливішого дня: букети нареченої, бутоньєрки, оформлення залу та арки. Індивідуальний підхід до кожної пари.",
  },
  {
    name: "Рослини",
    slug: "plants",
    image: images.plants,
    count: 3,
    order: 7,
    description:
      "Кімнатні рослини, які оживлять ваш простір. Монстери, фікуси, сукуленти — доглянуті та здорові, у стильних горщиках.",
  },
  {
    name: "Подарунки",
    slug: "gifts",
    image: images.gifts,
    count: 3,
    order: 8,
    description:
      "Готові подарункові набори з квітами, солодощами та шампанським. Ідеальне рішення, коли хочеться здивувати.",
  },
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
