# Performance Meter

Performance Meter is een webapplicatie voor Tothepoint Company waarmee consultants hun uren kunnen registreren en hun jaarlijkse doelen kunnen bijhouden.

## Features

### Authenticatie
- Login
- Registratie
- Profiel beheer

### Dashboard
- Overzicht van totale omzet
- Maandelijkse omzet grafiek
- Cumulatieve omzet grafiek
- Jaarlijks doel voortgang

### Projecten
- Project overzicht
- Project details
- Project aanmaken
- Project bewerken
- Project verwijderen

### Urenregistratie
- Uren overzicht
- Uren registreren
- Uren bewerken
- Uren verwijderen

### Jaarlijkse Doelen
- Doel overzicht
- Doel aanmaken
- Doel bewerken
- Doel verwijderen

## Technologieën

### Frontend
- React
- TypeScript
- Material-UI
- Chart.js
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MySQL
- JWT

## Installatie

1. Clone de repository:
```bash
git clone https://github.com/maarten7888/performance-meter-render.git
cd performance-meter
```

2. Installeer alle dependencies:
```bash
npm run install-all
```

3. Maak de `.env` files aan:

Frontend (`frontend/.env`):
```
REACT_APP_API_URL=https://pm.tothepointcompany.nl/api
```

Backend (`backend/.env`):
```
PORT=8080
NODE_ENV=production
DB_HOST=mysql.tothepointcompany.nl
DB_USER=tothepoi_pm
DB_PASSWORD=63@1Cy9dz
DB_NAME=tothepoi_performance_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

4. Start de development servers:

Backend:
```bash
npm start
```

Frontend (in een nieuwe terminal):
```bash
npm run start-frontend
```

## Build

Om de applicatie te builden voor productie:
```bash
npm run build
```

Dit zal zowel de frontend als de backend builden.

## Testing

Om de tests uit te voeren:
```bash
npm test
```

Dit zal zowel de frontend als de backend tests uitvoeren.

## Deployment

### Backend
De backend draait op een Node.js server met een MySQL database.

### Frontend
De frontend is een statische React applicatie die kan worden gehost op elke statische hosting service zoals:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- etc.

## Database Schema

### Users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Projects
```sql
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  hourlyRate DECIMAL(10, 2) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Hour Registrations
```sql
CREATE TABLE hour_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  projectId INT NOT NULL,
  date DATE NOT NULL,
  hours DECIMAL(5, 2) NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Yearly Targets
```sql
CREATE TABLE yearly_targets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL UNIQUE,
  target DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
``` 