-- Voeg yearlyTarget kolom toe aan users tabel
ALTER TABLE users
ADD COLUMN yearlyTarget DECIMAL(10, 2) DEFAULT 150000;

-- Update bestaande gebruikers met een standaardwaarde als ze nog geen yearlyTarget hebben
UPDATE users
SET yearlyTarget = 150000
WHERE yearlyTarget IS NULL; 