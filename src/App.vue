<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Cryptocurrency List</h1>
    <table class="table">
      <thead>
        <tr>
          <th v-for="column in visibleColumns" :key="column.key" @click="column.sortable && sortByColumn(column.key)">
            {{ column.label }}
            <i v-if="column.sortable" :class="[
              'fa-solid',
              {
                'fa-arrow-up-a-z': column.key === 'name' && column.sortDirection === 'asc',
                'fa-arrow-down-a-z': column.key === 'name' && column.sortDirection === 'desc',
                'fa-arrow-up-1-9': (column.key === 'percentChange24h' || column.key === 'marketPrice' || column.key === 'volume24h') && column.sortDirection === 'asc',
                'fa-arrow-down-1-9': (column.key === 'percentChange24h' || column.key === 'marketPrice' || column.key === 'volume24h') && column.sortDirection === 'desc',
              }
            ]" :title="getTooltipText(column.key)"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cryptocurrency, index) in cryptocurrencies" :key="index">
          <td v-for="column in visibleColumns" :key="column.key" class="text-center">
            <div v-if="column.key === 'number' && !isMobile">
              {{ cryptocurrency[column.key] }}
            </div>
            <div v-else-if="column.key === 'logo'">
              <div v-if="!isMobile">
                <img :src="cryptocurrency[column.key]" alt="Crypto Logo" height="50">
              </div>
              <div v-else>
                <div class="d-flex align-items-left justify-content-start">
                  <img :src="cryptocurrency[column.key]" alt="Crypto Logo" height="50">
                </div>
              </div>
            </div>
            <div v-else-if="column.key === 'name' && !isMobile">
              {{ cryptocurrency[column.key] }}
            </div>
            <div v-else>
              <i v-if="column.key === 'percentChange24h' && cryptocurrency.changeDirection24h === 'down'" class="fas fa-arrow-down text-danger"></i>
              <i v-else-if="column.key === 'percentChange24h' && cryptocurrency.changeDirection24h === 'up'" class="fas fa-arrow-up text-success"></i>
              <span v-if="column.key === 'percentChange24h'">{{ cryptocurrency[column.key] }}</span>
              <span v-else>{{ cryptocurrency[column.key] }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  data() {
    return {
      cryptocurrencies: [],
      page: 1,
      perPage: 20,
      isLoading: false,
      isEndOfList: false,
      isMobile: false,
      tableColumns: [
        { key: 'number', label: '#', sortable: false, showDesktop: true },
        { key: 'logo', label: '', showDesktop: false },
        { key: 'name', label: 'Name', sortable: true, sortDirection: 'asc', showDesktop: false },
        { key: 'percentChange24h', label: '24h Change', sortable: true, sortDirection: 'asc', showDesktop: true },
        { key: 'marketPrice', label: 'Market Price', sortable: true, sortDirection: 'asc', showDesktop: false },
        { key: 'volume24h', label: '24h Volume', sortable: true, sortDirection: 'asc', showDesktop: false },
      ],
    };
  },

  computed: {
    visibleColumns() {
      if (this.isMobile) {
        return this.tableColumns.filter((column) => column.showDesktop || column.key === 'logo' || column.key === 'number' || column.key === 'name');
      } else {
        return this.tableColumns;
      }
    },
    getTooltipText() {
      return (columnKey) => {
        switch (columnKey) {
          case 'name':
            return 'Sort by Name';
          case 'percentChange24h':
            return 'Sort by 24h Change';
          case 'marketPrice':
            return 'Sort by Market Price';
          case 'volume24h':
            return 'Sort by 24h Volume';
          default:
            return '';
        }
      };
    },
  },

  methods: {
    fetchCryptocurrencies() {
      const cache = setupCache({
        maxAge: 15 * 60 * 10000,
      });

      const api = axios.create({
        adapter: cache.adapter,
      });
      const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
      const params = {
        vs_currency: 'usd',
        per_page: this.perPage,
        page: this.page,
      };

      this.isLoading = true;

      api
        .get(apiUrl, { params })
        .then((response) => {
          console.log('Response:', response);

          this.cryptocurrencies = response.data.map((crypto, index) => {
            console.log('Crypto:', crypto);

            return {
              id: crypto.id,
              logo: crypto.image,
              number: index + 1,
              name: crypto.name,
              percentChange24h: crypto.price_change_percentage_24h.toFixed(2) + '%',
              marketPrice: '$' + crypto.current_price.toLocaleString(),
              volume24h: '$' + crypto.total_volume.toLocaleString(),
              changeDirection24h: crypto.price_change_percentage_24h < 0 ? 'down' : 'up',
            };
          });

          this.sortByColumn('number');
          this.isLoading = false;
        })
        .catch((error) => {
          console.error('Failed to fetch cryptocurrencies:', error);
          this.isLoading = false;
        });
    },

    handleScroll() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !this.isLoading &&
        !this.isEndOfList
      ) {
        this.fetchMoreCryptocurrencies();
      }
    },

    handleResize() {
      this.isMobile = this.checkIsMobile();
    },

    checkIsMobile() {
      return window.innerWidth < 768;
    },

    fetchMoreCryptocurrencies() {
      console.log('Fetching more cryptocurrencies...');
      const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
      const params = {
        vs_currency: 'usd',
        per_page: this.perPage,
        page: this.page + 1,
      };

      this.isLoading = true;

      axios
    .get(apiUrl, { params })
    .then((response) => {
      console.log('Response2:', response);

      const newCryptocurrencies = response.data.map((crypto, index) => ({
        id: crypto.id,
        logo: crypto.image,
        number: this.cryptocurrencies.length + index + 1,
        name: crypto.name,
        percentChange24h: crypto.price_change_percentage_24h.toFixed(2) + '%',
        marketPrice: '$' + crypto.current_price.toLocaleString(),
        volume24h:'$' + crypto.total_volume.toLocaleString(),
        changeDirection24h: crypto.price_change_percentage_24h < 0 ? 'down' : 'up',
      }));

      console.log('New Cryptocurrencies:', newCryptocurrencies);

      this.cryptocurrencies = [...this.cryptocurrencies, ...newCryptocurrencies];

      if (newCryptocurrencies.length < this.perPage) {
        this.isEndOfList = true;
      } else {
        this.isEndOfList = false;
      }

      this.tableColumns.forEach((column) => {
        if (column.sortable) {
          column.sortDirection = 'asc';
        }
      });

      this.page++;
      this.isLoading = false;
    })
    .catch((error) => {
      console.error('Failed to fetch more cryptocurrencies:', error);
      this.isLoading = false;
    });
},

sortByColumn(columnKey) {
  const column = this.tableColumns.find((col) => col.key === columnKey);
  column.sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';

  this.cryptocurrencies.sort((a, b) => {
    const valueA = columnKey === 'marketPrice' || columnKey === 'volume24h'
      ? parseFloat(a[columnKey].replace('$', '').replace(/,/g, ''))
      : a[columnKey];
    const valueB = columnKey === 'marketPrice' || columnKey === 'volume24h'
      ? parseFloat(b[columnKey].replace('$', '').replace(/,/g, ''))
      : b[columnKey];

    if (column.sortDirection === 'asc') {
      if (columnKey === 'percentChange24h') {
        return parseFloat(valueA) - parseFloat(valueB);
      } else {
        return this.compareValues(valueA, valueB);
      }
    } else {
      if (columnKey === 'percentChange24h') {
        return parseFloat(valueB) - parseFloat(valueA);
      } else {
        return this.compareValues(valueB, valueA);
      }
    }
  });
},

compareValues(valueA, valueB) {
  if (valueA < valueB) {
    return -1;
  } else if (valueA > valueB) {
    return 1;
  } else {
    return 0;
  }
},
  },

  created() {
    this.isMobile = this.checkIsMobile();
    this.fetchCryptocurrencies();
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background-image: url('./assets/images/crypto-image.jpg');
  background-size: contain;
}

.table {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  overflow: hidden;
}

.table thead th,
.table tbody td {
  background-color: rgba(255, 255, 255, 0.6);
}

th {
  font-size: 18px;
}

thead tr {
  height: 60px !important;
  text-align: center;
  vertical-align: middle;
}

h1.text-center {
  font-size: 55px;
  font-weight: bold;
  color: #00FA9B;
  text-shadow: 2px 4px 7px;
}

.text-center {
  text-align: center;
  vertical-align: middle;
}

.sort-icon {
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  transition: opacity 0.2s;
  margin-left: 0.5rem;
}

.fa-solid {
  border-bottom: 1px solid #000000;
}

.fa-solid:hover {
  cursor: pointer;
}
</style>