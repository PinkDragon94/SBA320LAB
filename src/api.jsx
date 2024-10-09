// api.js
import axios from 'axios';

const api_key = import.meta.env.VITE_API_KEY;
console.log(api_key); // Log API key to verify it's loaded correctly

// Create an instance of axios with the base URL and headers for the Alpha Vantage API
const instance = axios.create({
    baseURL: 'https://alpha-vantage.p.rapidapi.com/query',
    headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
        'x-rapidapi-key': api_key, // Your RapidAPI key from .env
    },
});

// Define an API object to hold the method for fetching stock prices
const stockAPI = {
    getDailyStockPrices: async (symbol) => {
        const response = await instance({
            method: 'GET',
            params: {
                function: 'TIME_SERIES_DAILY_ADJUSTED', // API function for daily stock data
                symbol: symbol, // Stock symbol provided by user input
                outputsize: 'compact', // Retrieves compact data (last 100 data points)
                datatype: 'json',
            },
        });

        const timeSeries = response.data['Time Series (Daily)'];

        // Check if the time series data exists
        if (!timeSeries) {
            throw new Error('No data found for the specified stock symbol.');
        }

        // Map over the time series data to extract date and relevant stock prices
        const chartData = Object.keys(timeSeries).map((date) => ({
            date: date, // Date of stock data
            openPrice: Number(timeSeries[date]['1. open']), // Open price for the day
            closePrice: Number(timeSeries[date]['4. close']), // Close price for the day
            highPrice: Number(timeSeries[date]['2. high']), // High price for the day
            lowPrice: Number(timeSeries[date]['3. low']), // Low price for the day
            volume: Number(timeSeries[date]['6. volume']), // Volume for the day
        })).reverse();  // Reverse to get dates in ascending order

        return chartData; // Return formatted data for the chart
    },
};

export default stockAPI;

