-- Initial seed data for the flower shop

-- Promocodes
INSERT INTO promocodes (id, code, discount_percent, max_uses, used_count, is_active)
VALUES
    (gen_random_uuid(), 'FLOWER10', 10, 100, 0, true),
    (gen_random_uuid(), 'LOVE15', 15, 50, 0, true),
    (gen_random_uuid(), 'WELCOME20', 20, 200, 0, true)
ON CONFLICT (code) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, slug, description, sort_order, is_active)
VALUES
    (gen_random_uuid(), 'Троянди', 'roses', 'Королева квітів. Еквадорські, кенійські та місцеві троянди найвищої якості.', 1, true),
    (gen_random_uuid(), 'Тюльпани', 'tulips', 'Весняна свіжість у кожній квітці. Яскраві голландські тюльпани.', 2, true),
    (gen_random_uuid(), 'Півонії', 'peonies', 'Пишні та ніжні півонії для особливих моментів.', 3, true),
    (gen_random_uuid(), 'Орхідеї', 'orchids', 'Екзотична елегантність. Фаленопсиси та інші види орхідей.', 4, true),
    (gen_random_uuid(), 'Весілля', 'wedding', 'Весільні букети та композиції. Індивідуальний дизайн для вашого свята.', 5, true),
    (gen_random_uuid(), 'Авторські', 'author', 'Ексклюзивні авторські роботи наших флористів. Унікальні композиції.', 6, true),
    (gen_random_uuid(), 'Рослини', 'plants', 'Кімнатні рослини в горщиках. Фікуси, монстери, сукуленти.', 7, true),
    (gen_random_uuid(), 'Подарунки', 'gifts', 'Подарункові набори з квітами, солодощами та листівками.', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Note: Admin user must be created via the registration API, then promote to admin role.
-- To create an admin user:
--   1. Register via POST /api/v1/auth/register with email admin@flowershop.ua
--   2. Update the user's role in the database to 'admin'
