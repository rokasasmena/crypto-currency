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
      isMobile: false,
      tableColumns: [
        { key: 'number', label: '#', sortable: false, showDesktop: true },
        { key: 'logo', label: '', showDesktop: false },
        { key: 'name', label: 'Name', sortable: true, sortDirection: 'asc', showDesktop: false },
        { key: 'percentChange24h', label: '24h Change', sortable: true, sortDirection: 'asc', showDesktop: true },
        { key: 'marketPrice', label: 'Market Price', sortable: true, sortDirection: 'asc', showDesktop: false },
        { key: 'volume24h', label: '24h Volume', sortable: true, sortDirection: 'asc', showDesktop: false },
      ],
      error: null,
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
      this.error = null;

      api
        .get(apiUrl, { params })
        .then((response) => {
          console.log('Response:', response);

          this.cryptocurrencies = response.data.map((crypto, index) => {
            console.log('Crypto:', crypto);

          const percentChange24h = crypto.price_change_percentage_24h
            ? crypto.price_change_percentage_24h.toFixed(2) + '%'
            : '-';

          const marketPrice = '$' + crypto.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return {
              id: crypto.id,
              logo: crypto.image,
              number: index + 1,
              name: crypto.name,
              symbol: crypto.symbol,
              percentChange24h: percentChange24h,
              marketPrice: marketPrice,
              volume24h: '$' + crypto.total_volume.toLocaleString(),
              changeDirection24h: crypto.price_change_percentage_24h < 0 ? 'down' : 'up',
            };
          });

          this.sortByColumn('number');
          this.isLoading = false;
        })
        .catch((error) => {
            this.error = error;
            this.isLoading = false;
          });
    },

    handleScrollEvent() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !this.isLoading &&
        !this.isEndOfList &&
        !this.error
      ) {
        this.page++;
        this.fetchMoreCryptocurrencies().catch((error) => {
          this.error = error;
          this.isLoading = false;
        });
      }
    },

    handleResizeEvent() {
      this.isMobile = this.checkIsMobile();
    },

    checkIsMobile() {
      return window.innerWidth < 768;
    },

    fetchMoreCryptocurrencies() {
      const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
      const params = {
        vs_currency: 'usd',
        per_page: 20,
        page: Math.ceil(this.cryptocurrencies.length / 20) + 1,
      };
      
      this.isLoading = true;
      this.error = null;
      
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      
      return delay(1000)
        .then(() => axios.get(apiUrl, { params }))
        .then((response) => {
        const newCryptocurrencies = response.data.map((crypto, index) => ({
            id: crypto.id,
            logo: crypto.image,
            number: this.cryptocurrencies.length + index + 1,
            name: crypto.name,
            percentChange24h: crypto.price_change_percentage_24h.toFixed(2) + '%',
            marketPrice: '$' + crypto.current_price.toLocaleString(),
            volume24h: '$' + crypto.total_volume.toLocaleString(),
            changeDirection24h: crypto.price_change_percentage_24h < 0 ? 'down' : 'up',
        }));

      this.cryptocurrencies = [...this.cryptocurrencies, ...newCryptocurrencies];

      this.tableColumns.forEach((column) => {
        if (column.sortable) {
          column.sortDirection = 'asc';
        }
      });

      this.isLoading = false;
    })
    .catch((error) => {
        if (error.response && error.response.status === 429) {
          this.error = "You've exceeded the Rate Limit. Please visit https://www.coingecko.com/en/api/pricing to subscribe to our API plans for higher rate limits.";
        } else {
          this.error = 'Failed to fetch more cryptocurrencies';
          console.error(error);
        }
        throw error;
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
    window.addEventListener('scroll', this.handleScrollEvent);
    window.addEventListener('resize', this.handleResizeEvent);
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScrollEvent);
    window.removeEventListener('resize', this.handleResizeEvent);
  },
};