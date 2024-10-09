import axios from 'axios';

const api_key = import.meta.env.VITE_API_KEY
console.log(api_key)

// Create an instance of axios with the base URL and headers for the Alpha Vantage API
const instance = axios.create({
    baseURL: 'https://alpha-vantage.p.rapidapi.com/query',
    headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
        'x-rapidapi-key': api_key // Your RapidAPI key from .env
    },
});

// Define an API object to hold the method for fetching stock prices
const stockAPI = {
    getDailyStockPrices: (symbol) =>
      instance({
        method: 'GET',
        params: {
          function: 'TIME_SERIES_DAILY_ADJUSTED', // API function for daily stock data
          symbol: symbol, // Stock symbol provided by user input
          outputsize: 'compact', // Retrieves compact data (last 100 data points)
          datatype: 'json',
        },
        // Transform the response to make it more usable for the chart
        transformResponse: [
          function (data) {
            console.log(data)
            const json = JSON.parse(data);
            console.log(json)
            const timeSeries = json['Time Series (Daily)'];

            // Map over the time series data to extract date and closing price
            const chartData = Object.keys(timeSeries).map((date) => ({
              date: date, // Date of stock data
              closePrice: Number(timeSeries[date]['4. close']), // Close price for the day
            })).reverse();  // Reverse to get dates in ascending order

            return chartData; // Return formatted data for the chart
          },
        ],
      }),
};

export default stockAPI;
