-- Voeg role kolom toe als deze nog niet bestaat
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('admin', 'user') NOT NULL DEFAULT 'user';

-- Update de gebruiker met het specifieke email adres naar admin rol
UPDATE users 
SET role = 'admin' 
WHERE email = 'maarten.jansen@tothepointcompany.nl';

-- Bevestig de update
SELECT id, email, role 
FROM users 
WHERE email = 'maarten.jansen@tothepointcompany.nl'; 