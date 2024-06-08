// src/state/stockState.js

import { atom, selector } from 'recoil';
import { fetchStockData } from '../utils/api';

// Atom to hold the list of fetched stock data
export const stockState = atom({
    key: 'stockState',
    default: [], // Default is an empty array of stock data
});

// Atom to hold the selected timeframe for fetching stock data
export const selectedTimeframeState = atom({
    key: 'selectedTimeframeState',
    default: '1d', // Default to 1-day timeframe
});

// Atom to hold the selected stock symbol
export const selectedStockSymbolState = atom({
    key: 'selectedStockSymbolState',
    default: 'AAPL', // Default to Apple stock symbol
});

// Selector to fetch and return stock data based on selected symbol and timeframe
export const stockDataSelector = selector({
    key: 'stockDataSelector',
    get: async ({ get }) => {
        const symbol = get(selectedStockSymbolState);
        const timeframe = get(selectedTimeframeState);
        const data = await fetchStockData(symbol, timeframe);
        return data; // Data includes volume information
    },
});
