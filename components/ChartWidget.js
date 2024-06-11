import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    ComposedChart, Line, BarChart, Bar 
} from 'recharts';
import { stockState, selectedTimeframeState, selectedStockSymbolState } from '../state/stockState';
import { fetchStockData, searchStockSymbol } from '../utils/api';
import './ChartWidget.css';
import { ImCoinDollar } from "react-icons/im";

const timeframes = [
    { label: '1 Day', value: '1d' },
    { label: '1 Week', value: '1w' },
    { label: '1 Month', value: '1m' },
    { label: '6 Months', value: '6m' },
    { label: '1 Year', value: '1y' },
];

const ChartWidget = () => {
    const [stocks, setStocks] = useRecoilState(stockState);
    const [selectedTimeframe, setSelectedTimeframe] = useRecoilState(selectedTimeframeState);
    const [selectedStockSymbol, setSelectedStockSymbol] = useRecoilState(selectedStockSymbolState);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [stockName, setStockName] = useState('');
    const [currentPrice, setCurrentPrice] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedStockSymbol) {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await fetchStockData(selectedStockSymbol, selectedTimeframe);
                    
                    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
                    console.log('Fetched and sorted data:', sortedData);

                    setStocks(sortedData);

                    if (data.length > 0) {
                        setStockName(selectedStockSymbol);
                        setCurrentPrice(data[data.length - 1].close);
                    }
                } catch (err) {
                    console.error('Error fetching stock data:', err);
                    setError('Failed to fetch stock data. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [selectedStockSymbol, selectedTimeframe, setStocks]);

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value) {
            try {
                const results = await searchStockSymbol(value);
                setSearchResults(results);
            } catch (err) {
                console.error('Error searching stock symbol:', err);
                setError('Failed to search stock symbol. Please try again.');
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectStock = (symbol) => {
        setSelectedStockSymbol(symbol);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="chart-widget">
            <div className="search-bar">
                <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search for a stock..." />
                {searchResults.length > 0 && (
                    <ul className="search-results">
                        {searchResults.map(result => (
                            <li key={result.symbol} onClick={() => handleSelectStock(result.symbol)}>
                                {result.name} ({result.symbol})
                            </li>
                        ))}
                    </ul>
                )}
                <div className="timeframe-buttons">
                    {timeframes.map((timeframe) => (
                        <button
                            key={timeframe.value}
                            className={`timeframe-button ${selectedTimeframe === timeframe.value ? 'active' : ''}`}
                            onClick={() => setSelectedTimeframe(timeframe.value)}
                        >
                            {timeframe.label}
                        </button>
                    ))}
                </div>
            </div>

            {selectedStockSymbol && (
                <div className="stock-details">
                    <h2>
                        <ImCoinDollar style={{ marginRight: '8px' }} />
                        {stockName}
                    </h2>
                    {currentPrice !== null && <p>Current Price: ${currentPrice.toFixed(2)}</p>}
                </div>
            )}

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <div style={{ width: '100%', height: '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={stocks}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="close"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line type="monotone" dataKey="open" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="high" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="low" stroke="#ff7300" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ width: '100%', height: '150px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stocks}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="volume" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

            {stocks.length === 0 && !isLoading && !error && (
                <div className="no-data">No data available for the selected stock and timeframe.</div>
            )}
        </div>
    );
};

export default ChartWidget;
