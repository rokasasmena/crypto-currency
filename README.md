# cryptocurrency-app

# Cryptocurrency List Component

This is a Vue.js component that displays a list of cryptocurrencies. It fetches data from the CoinGecko API and provides sorting functionality based on different columns such as name, 24h change, market price, and volume.

## Data

The Cryptocurrency List component defines the following data properties:

cryptocurrencies: An array of objects representing the fetched cryptocurrency data.
page: The current page number for pagination.
perPage: The number of cryptocurrencies to fetch per page.
isLoading: A boolean indicating whether data is being loaded.
isMobile: A boolean indicating whether the component is being viewed on a mobile device.
tableColumns: An array of objects defining the table columns to display.
error: Any error that occurred during data fetching.
tooltip: small pop-up box that provides additional information about a specific element when it is hovered.

## Technologies Used

Vue.js: A JavaScript framework for building user interfaces.
Axios: A library for making HTTP requests to the CoinGecko API and handling data fetching.
Font Awesome: A library of scalable vector icons used for visual elements in the app.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

