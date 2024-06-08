import React, { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import debounce from 'lodash.debounce';
import { searchStockSymbol } from '../utils/api';
import { selectedStockSymbolState } from '../atoms';

const StockSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedStockSymbol, setSelectedStockSymbol] = useRecoilState(selectedStockSymbolState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = useCallback(
        debounce(async (query) => {
            if (query.length > 0) {
                setIsLoading(true);
                setError(null);
                try {
                    const searchResults = await searchStockSymbol(query);
                    setResults(searchResults);
                } catch (err) {
                    console.error('Error fetching search results:', err);
                    setError('Failed to fetch search results. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300),
        []
    );

    const handleSelect = (symbol) => {
        setSelectedStockSymbol(symbol);
        setResults([]);
        setQuery('');
    };

    return (
        <div className="search-container">
            <input
                className="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a stock..."
            />
            {isLoading && <div className="loading-indicator">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            {results.length > 0 && (
                <ul className="suggestions-list">
                    {results.map((result) => (
                        <li key={result.symbol} onClick={() => handleSelect(result.symbol)}>
                            {result.name} ({result.symbol})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StockSearch;
