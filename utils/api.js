const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

export const fetchStockData = async (symbol, timeframe) => {
    let url = '';
    let timeSeriesKey = '';

    switch (timeframe) {
        case '1d':
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;
            timeSeriesKey = 'Time Series (5min)';
            break;
        case '1w':
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=30min&apikey=${API_KEY}`;
            timeSeriesKey = 'Time Series (30min)';
            break;
        case '1m':
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
            timeSeriesKey = 'Time Series (Daily)';
            break;
        case '6m':
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${API_KEY}`;
            timeSeriesKey = 'Weekly Time Series';
            break;
        case '1y':
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${API_KEY}`;
            timeSeriesKey = 'Monthly Time Series';
            break;
        default:
            throw new Error('Invalid timeframe');
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data[timeSeriesKey]) {
        return Object.entries(data[timeSeriesKey]).map(([date, values]) => ({
            date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'], 10),
        }));
    }

    return [];
};

export const searchStockSymbol = async (query) => {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.bestMatches) {
        return data.bestMatches.map((match) => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            type: match['3. type'],
            region: match['4. region'],
            marketOpen: match['5. marketOpen'],
            marketClose: match['6. marketClose'],
            timezone: match['7. timezone'],
            currency: match['8. currency'],
            matchScore: match['9. matchScore'],
        }));
    }

    return [];
};
