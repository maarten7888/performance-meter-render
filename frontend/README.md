# Performance Meter Frontend

Dit is de frontend voor de Performance Meter applicatie. De applicatie maakt gebruik van:

- React
- TypeScript
- Material-UI
- Chart.js
- React Router
- Axios

## Installatie

1. Installeer de dependencies:
```bash
npm install
```

2. Maak een `.env` file aan met de volgende variabelen:
```
REACT_APP_API_URL=https://pm.tothepointcompany.nl/api
```

3. Start de development server:
```bash
npm start
```

4. Build de applicatie voor productie:
```bash
npm run build
```

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

## Project Structuur

```
src/
├── components/     # Herbruikbare componenten
├── pages/         # Pagina componenten
├── services/      # API services
├── types/         # TypeScript types
├── utils/         # Utility functies
└── App.tsx        # Hoofd component
```

## Development

De applicatie maakt gebruik van:
- TypeScript voor type checking
- ESLint voor code kwaliteit
- Prettier voor code formatting
- Jest voor testing

## Deployment

De applicatie kan worden gehost op elke statische hosting service zoals:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- etc.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
