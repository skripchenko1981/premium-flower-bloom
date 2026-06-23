import { productImages, images } from "./images";

export interface ProductSize {
  name: string;
  label?: string;
  price: number;
}

export interface DemoProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  category: string;
  categoryName?: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  popular?: boolean;
  description: string;
  careTips?: string;
  sizes: ProductSize[];
}

export const demoProducts: DemoProduct[] = [
  {
    _id: "1", name: "Рожева мрія", slug: "pink-dream", price: 1299, oldPrice: 1599,
    category: "author", categoryName: "Авторські",
    images: [productImages.author, images.default, images.bouquet3],
    inStock: true, featured: true, popular: true,
    description: "Ніжний букет рожевих троянд з евкаліптом і гіпсофілою. Ідеально для романтичної зустрічі, дня народження або просто щоб подарувати радість.",
    careTips: "Міняйте воду щодня, підрізайте стебла під кутом кожні 2 дні. Уникайте прямих сонячних променів.",
    sizes: [
      { name: "S", label: "Малий (15 стебел)", price: 999 },
      { name: "M", label: "Середній (25 стебел)", price: 1299 },
      { name: "L", label: "Великий (35 стебел)", price: 1699 },
    ],
  },
  {
    _id: "2", name: "Royal Velvet", slug: "royal-velvet", price: 1899,
    category: "roses", categoryName: "Троянди",
    images: [productImages.roses, images.bouquet2],
    inStock: true, featured: true, popular: true,
    description: "Розкішний букет з 25 червоних еквадорських троянд. Оксамитова текстура пелюсток створює незабутнє враження.",
    careTips: "Використовуйте підкормку для квітів. Міняйте воду кожні 1-2 дні. Зберігайте в прохолодному місці.",
    sizes: [
      { name: "M", label: "Середній (25 троянд)", price: 1899 },
      { name: "L", label: "Великий (51 троянда)", price: 3499 },
    ],
  },
  {
    _id: "3", name: "Весняна мелодія", slug: "spring-symphony", price: 899, oldPrice: 1199,
    category: "tulips", categoryName: "Тюльпани",
    images: [productImages.tulips, images.bouquet3],
    inStock: true, popular: true,
    description: "Яскравий мікс різнокольорових голландських тюльпанів, що приносить радість весни.",
    sizes: [
      { name: "S", label: "Малий (11 тюльпанів)", price: 699 },
      { name: "M", label: "Середній (21 тюльпан)", price: 899 },
    ],
  },
  {
    _id: "4", name: "Перлина Півонія", slug: "pearl-peony", price: 1499,
    category: "peonies", categoryName: "Півонії",
    images: [productImages.peonies],
    inStock: true, featured: true,
    description: "Ніжна композиція з півоній — втілення елегантності та жіночності.",
    sizes: [
      { name: "M", label: "Середній", price: 1499 },
      { name: "L", label: "Великий", price: 1999 },
    ],
  },
  {
    _id: "5", name: "Біла Орхідея", slug: "white-orchid", price: 2199, oldPrice: 2699,
    category: "orchids", categoryName: "Орхідеї",
    images: [productImages.orchids],
    inStock: true, featured: true,
    description: "Преміум орхідея фаленопсис у вишуканому горщику. Стильний подарунок для особливих випадків.",
    sizes: [
      { name: "M", label: "Середній", price: 2199 },
      { name: "L", label: "Великий", price: 2799 },
    ],
  },
  {
    _id: "6", name: "Мрія Нареченої", slug: "brides-dream", price: 3499,
    category: "wedding", categoryName: "Весілля",
    images: [productImages.wedding],
    inStock: true, popular: true,
    description: "Розкішний весільний букет, створений спеціально для найважливішого дня.",
    sizes: [
      { name: "M", label: "Середній", price: 3499 },
      { name: "L", label: "Великий", price: 4499 },
    ],
  },
  {
    _id: "7", name: "Елегантний Фікус", slug: "ficus-elegance", price: 799,
    category: "plants", categoryName: "Рослини",
    images: [productImages.plants],
    inStock: true,
    description: "Красива кімнатна рослина фікус, що прикрасить будь-який інтер'єр.",
    sizes: [{ name: "S", label: "Стандарт", price: 799 }],
  },
  {
    _id: "8", name: "Подарунковий набір Делюкс", slug: "gift-box-deluxe", price: 1599,
    category: "gifts", categoryName: "Подарунки",
    images: [productImages.gifts],
    inStock: true, featured: true,
    description: "Преміум подарунковий набір із квітами та солодощами.",
    sizes: [{ name: "M", label: "Стандарт", price: 1599 }],
  },
  {
    _id: "9", name: "Червона пристрасть", slug: "scarlet-passion", price: 2499,
    category: "roses", categoryName: "Троянди",
    images: [images.bouquet2],
    inStock: true,
    description: "51 червона троянда в коробці — максимальний ефект.",
    sizes: [{ name: "L", label: "Великий", price: 2499 }],
  },
  {
    _id: "10", name: "Тюльпанові поля", slug: "tulip-fields", price: 1099,
    category: "tulips", categoryName: "Тюльпани",
    images: [images.bouquet3],
    inStock: true,
    description: "Композиція з голландських тюльпанів.",
    sizes: [{ name: "M", label: "Середній", price: 1099 }],
  },
  {
    _id: "11", name: "Лавандові мрії", slug: "lavender-dreams", price: 1799,
    category: "author", categoryName: "Авторські",
    images: [images.bouquet4],
    inStock: true,
    description: "Авторська композиція флориста з лавандовими акцентами.",
    sizes: [
      { name: "M", label: "Середній", price: 1799 },
      { name: "L", label: "Великий", price: 2299 },
    ],
  },
  {
    _id: "12", name: "Тропічний рай", slug: "tropical-paradise", price: 2899,
    category: "orchids", categoryName: "Орхідеї",
    images: [images.tropical],
    inStock: false,
    description: "Екзотична композиція з орхідей.",
    sizes: [{ name: "L", label: "Великий", price: 2899 }],
  },
];

export function getProductBySlug(slug: string): DemoProduct | undefined {
  return demoProducts.find((p) => p.slug === slug);
}

export const popularProducts: DemoProduct[] = demoProducts.filter((p) => p.popular).slice(0, 4);

/** For the cart demo */
export const demoCartItems = [
  {
    _id: "c1",
    productId: "1",
    productName: "Рожева мрія",
    productImage: images.bouquet1,
    price: 1299,
    quantity: 1,
    size: "M",
    withCard: false,
  },
  {
    _id: "c2",
    productId: "2",
    productName: "Royal Velvet",
    productImage: images.rose,
    price: 1899,
    quantity: 2,
    size: "L",
    withCard: true,
  },
];

/** For the wishlist demo */
export const demoWishlistItems = [
  { _id: "w1", productId: "pink-dream", name: "Рожева мрія", price: 1299, oldPrice: 1599, image: images.bouquet1, category: "Авторські", inStock: true },
  { _id: "w2", productId: "royal-velvet", name: "Royal Velvet", price: 1899, image: images.rose, category: "Троянди", inStock: true },
  { _id: "w3", productId: "pearl-peony", name: "Перлина Півонія", price: 1499, image: images.peony, category: "Півонії", inStock: false },
];
