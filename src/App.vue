<template>
  <div id="app">
    <CryptocurrencyList />
  </div>
</template>

<script>
import CryptocurrencyList from "./components/CryptocurrencyList.vue";

export default {
  name: "App",
  components: {
    CryptocurrencyList,
  },
};
</script>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>