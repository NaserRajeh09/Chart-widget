import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Label } from 'recharts';
import { stockState, selectedTimeframeState, selectedStockSymbolState } from '../state/stockState';
import { fetchStockData, searchStockSymbol } from '../utils/api';
import './ChartWidget.css';

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
    const [stockName, setStockName] = useState(''); // New state for stock name

    useEffect(() => {
        const fetchData = async () => {
            if (selectedStockSymbol) {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await fetchStockData(selectedStockSymbol, selectedTimeframe);
                    setStocks(data);
                    const stockInfo = searchResults.find(result => result.symbol === selectedStockSymbol);
                    setStockName(stockInfo ? stockInfo.name : ''); // Update the stock name
                } catch (err) {
                    console.error('Error fetching stock data:', err);
                    setError('Failed to fetch stock data. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [selectedStockSymbol, selectedTimeframe, setStocks, searchResults]);

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
            <div className="search-area">
                <input
                    type="text"
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for a stock..."
                />
                {searchResults.length > 0 && (
                    <div className="search-dropdown">
                        {searchResults.map((result) => (
                            <div
                                key={result.symbol}
                                className="search-dropdown-item"
                                onClick={() => handleSelectStock(result.symbol)}
                            >
                                {result.name} ({result.symbol})
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="timeframe-buttons">
                {timeframes.map((tf) => (
                    <button
                        key={tf.value}
                        onClick={() => setSelectedTimeframe(tf.value)}
                        className={`timeframe-button ${selectedTimeframe === tf.value ? 'active' : ''}`}
                    >
                        {tf.label}
                    </button>
                ))}
            </div>
            {isLoading ? (
                <div className="loading-indicator">Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : stocks.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={stocks}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date">
                            <Label value={stockName} offset={-10} position="insideTopLeft" />
                        </XAxis>
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="open" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line yAxisId="left" type="monotone" dataKey="high" stroke="#82ca9d" />
                        <Line yAxisId="left" type="monotone" dataKey="low" stroke="#ff7300" />
                        <Line yAxisId="left" type="monotone" dataKey="close" stroke="#ff0000" />
                        <Bar yAxisId="right" dataKey="volume" fill="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="no-data">No data available</div>
            )}
        </div>
    );
};

export default ChartWidget;
