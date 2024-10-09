import React, { useState } from 'react'; 
import stockAPI from '../api'; // Import the API call function

const StockTable = () => {
  const [responseData, setResponseData] = useState([]); // Store stock price data
  const [ticker, setTicker] = useState(''); // Store stock ticker input
  const [message, setMessage] = useState(''); // Message to show loading/error

  const fetchData = async (e) => {
    e.preventDefault();

    // Validate that ticker is non-empty and alphanumeric
    if (!ticker.trim() || !/^[A-Za-z]+$/.test(ticker)) {
      setMessage('Please enter a valid stock ticker (letters only).');
      return;
    }

    setMessage('Loading...');
    
    try {
      const response = await stockAPI.getDailyStockPrices(ticker);
      if (response.length === 0) {
        setMessage(`No data available for the stock ticker "${ticker.toUpperCase()}".`);
      } else {
        setResponseData(response);
        setMessage(''); // Clear message
      }
    } catch (error) {
      setMessage('Error fetching stock data. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div
      style={{
        background: '#EEE',
        padding: '5%',
        fontFamily: '"Lucida Console", Monaco, monospace',
      }}
    >
      <h1
        style={{
          background: 'HotPink',
          color: 'Black',
          padding: '1rem',
          display: 'inline-block',
        }}
      >
        PinkDragon Stock Market App
      </h1>
      <h2>Analyze Stock Data</h2>

      <form onSubmit={fetchData}>
        <fieldset>
          <legend>Search Stock Market</legend>
          <label htmlFor="ticker">
            Enter stock ticker
            <input
              required
              name="ticker"
              id="ticker"
              type="text"
              placeholder="AAPL"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </fieldset>
      </form>

      {/* Show loading/error message */}
      <p>{message}</p>

      {/* Display table if responseData is not empty */}
      {responseData.length > 0 && (
        <>
          <h3>Symbol: {ticker.toUpperCase()}</h3>
          <p>Daily Time Series with Splits and Dividend Events</p>

          {/* Display data in a table format */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '1rem 0',
            }}
          >
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Open Price</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Close Price</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>High Price</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Low Price</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {responseData.map((data, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{data.date}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{data.openPrice}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{data.closePrice}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{data.highPrice}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{data.lowPrice}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{data.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default StockTable;
