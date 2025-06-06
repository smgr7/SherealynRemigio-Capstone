import { useState, useEffect, useContext, useCallback } from "react";
import StockContext from "./contexts/StockContext";
import './StockListStyling.css'

const API_KEY = "VEONLV84U8XAJK1U";

const fetchCurrentPrice = async (symbol, API_KEY) => {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`)
        const data = await response.json();

        const quote = data['Global Quote'];

        if (!quote || !quote['05. price']) {
            return null;
        }
        return parseFloat(quote['05. price']);
    }
    catch (error) {
        return null;
    }
}

function StockList() {
    
    const {stocks} = useContext(StockContext);
    const [updatedPrices, setUpdatedPrices] = useState({});

    const refreshPrices = useCallback(async() => {
        const prices = {};

        for (const stock of stocks) {
            const price = await fetchCurrentPrice(stock.symbol, API_KEY);
            if (price) {
                prices[stock.symbol] = price;
            }
        }
        setUpdatedPrices(prices);
    }, [stocks]);

    useEffect(() => {
        refreshPrices();
    }, [refreshPrices]);

    return (
        <div className="stock-list">
            {stocks.length === 0? (
                <p>No stocks added yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Stock Symbol</th>
                            <th>Quantity</th>
                            <th>Purchase Price</th>
                            <th>Current Price</th>
                            <th>Profit/Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stock, index) => {
                            const currentPrice = updatedPrices[stock.symbol] ?? stock.currentPrice;
                            const profitLoss = (currentPrice - stock.purchasePrice) * stock.quantity;
                                return (
                                    <tr key={index}>
                                        <td style={{fontWeight: "bold"}}>{stock.symbol}</td>
                                        <td>{stock.quantity}</td>
                                        <td>${stock.purchasePrice.toFixed(2)}</td>
                                        <td>${currentPrice.toFixed(2)}</td>
                                        <td style={{
                                            color: profitLoss >= 0 ? "green" : "red",
                                            fontWeight: "bold",
                                            }}
                                        >
                                        {profitLoss >= 0 ? "+" : "-"}${Math.abs(profitLoss).toFixed(2)}
                                        </td>
                                    </tr>
                                )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default StockList;

