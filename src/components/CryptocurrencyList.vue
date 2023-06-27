<template>
    <div class="container mt-4">
      <h1 class="text-center mb-5">Cryptocurrency List</h1>
      <table class="table">
        <thead>
          <tr>
            <th v-for="column in visibleColumns" :key="column.key">
              {{ column.label }}
              <i @click="column.sortable && sortByColumn(column.key)" v-if="column.sortable" :class="[
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
          <tr v-for="(cryptocurrency, index) in cryptocurrencies" :key="index" :class="{ 'hovered': cryptocurrency.hovered }" @mouseenter="cryptocurrency.hovered = true" @mouseleave="cryptocurrency.hovered = false">
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
                <span class="currency-symbol" v-if="cryptocurrency.symbol">{{ cryptocurrency.symbol.toUpperCase() }}</span>
              </div>
              <div v-else>
                <span
                  v-if="column.key === 'percentChange24h'"
                  :class="{
                    'text-success': cryptocurrency.changeDirection24h === 'up',
                    'text-danger': cryptocurrency.changeDirection24h === 'down'
                  }"
                >
                  <i v-if="cryptocurrency.changeDirection24h === 'down'" class="fas fa-arrow-down"></i>
                  <i v-else-if="cryptocurrency.changeDirection24h === 'up'" class="fas fa-arrow-up"></i>
                  {{ cryptocurrency[column.key] }}
                </span>
                <span v-else>{{ cryptocurrency[column.key] }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

<script src="../services/CryptocurrencyList.js"></script>

<style src="../assets/CryptocurrencyList.css"></style>