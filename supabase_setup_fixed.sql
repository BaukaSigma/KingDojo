-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create admin_allowlist table
CREATE TABLE IF NOT EXISTS admin_allowlist (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create settings table (Single Row Pattern)
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    social_links JSONB,
    phone TEXT,
    address TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price NUMERIC,
    currency TEXT DEFAULT 'KZT',
    description TEXT,
    image_url TEXT,
    gallery TEXT[],
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create news table
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    gallery TEXT[],
    published_at TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    date DATE,
    cover_image TEXT,
    gallery TEXT[],
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable RLS
ALTER TABLE admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- 7. Helper function is_admin using auth.email()
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_allowlist 
    WHERE email = auth.email()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Policies

-- Settings
CREATE POLICY "Public read settings" ON settings FOR SELECT TO public USING (true);
CREATE POLICY "Admin update settings" ON settings FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Products
CREATE POLICY "Public read active products" ON products FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admin insert products" ON products FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin update products" ON products FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete products" ON products FOR DELETE TO authenticated USING (is_admin());

-- News
CREATE POLICY "Public read published news" ON news FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Admin insert news" ON news FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin update news" ON news FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete news" ON news FOR DELETE TO authenticated USING (is_admin());

-- Achievements
CREATE POLICY "Public read published achievements" ON achievements FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Admin insert achievements" ON achievements FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin update achievements" ON achievements FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete achievements" ON achievements FOR DELETE TO authenticated USING (is_admin());

-- Admin Allowlist (Self-read/Admin-read)
CREATE POLICY "Admin read allowlist" ON admin_allowlist FOR SELECT TO authenticated USING (is_admin());

-- 9. Auto-update Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_news_modtime BEFORE UPDATE ON news FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_achievements_modtime BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 10. Default settings
INSERT INTO settings (id, phone, address)
VALUES (1, '+7 (700) 000-00-00', 'Kazakhstan, Almaty')
ON CONFLICT (id) DO NOTHING;
