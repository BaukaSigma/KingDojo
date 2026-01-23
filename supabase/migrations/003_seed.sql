-- Insert ONE settings row
insert into public.settings (whatsapp_phone, telegram_username, instagram_url)
values ('77771234567', 'kingdojo_admin', 'https://instagram.com/kingdojo');

-- Insert Sample Content (Optional)
insert into public.products (title, slug, price, description, is_active)
values 
('Кимоно Enshin', 'kimono-enshin', 25000, 'Официальное кимоно для тренировок и соревнований.', true),
('Защита голени', 'shinguards', 12000, 'Профессиональная защита для спаррингов.', true);

insert into public.news (title, slug, content, is_published, published_at)
values
('Открытие сезона 2026', 'season-opening-2026', 'Мы рады объявить о начале нового тренировочного сезона!', true, now());

-- Insert YOUR email as admin (PLACEHOLDER - User must change this)
insert into public.admin_allowlist (email)
values ('admin@kingdojo.kz'); 
