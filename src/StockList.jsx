import { useState, useEffect, useContext, useCallback } from "react";
import StockContext from "./contexts/StockContext";

const API_KEY = import.meta.env.VITE_API_KEY;

//const fetchCurrentPrice = async (symbol)
const fetchCurrentPrice = async (symbol, API_KEY) => {
    
    //const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=demo`);
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`)
        
    const data = await response.json();

    const quote = data['Global Quote'];

    if (!quote || !quote['05. price']) {
        throw new Error('Invalid stock symbol or failed to fetch a price');
    }
    return parseFloat(quote['05. price']);
}

function StockList() {
    
    const {stocks} = useContext(StockContext);
    const [updatedPrices, setUpdatedPrices] = useState({});

    const [loading, setLoading] = useState(false);

    const refreshPrices = useCallback(async() => {
        setLoading(true);

        const prices = {};

        for (const stock of stocks) {
            try {
                const price = await fetchCurrentPrice(stock.symbol, API_KEY);
                //const price = await fetchCurrentPrice(stock.symbol);
                prices[stock.symbol] = price;
            } catch (error) {
                console.error(`Failed to fetch price for ${stock.symbol}:`, error);
            } 
        }
        setUpdatedPrices(prices);
        setLoading(false);
    }, [stocks]);

    useEffect(() => {
        refreshPrices();
    }, [refreshPrices]);

    return (
        <div className="flex flex-col bg-[#f5faff] rounded overflow-x-auto p8">
            {stocks.length === 0? (
                <p className="p-4">No stocks added yet.</p>
            ) : (
                <>
                    {/* Table for larger screens */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full border-collapse p-8">
                            <thead>
                                <tr className="bg-blue-600 text-white text-left">
                                    <th className="p-4 text-sm sm:text-base">Stock Symbol</th>
                                    <th className="p-4 text-sm sm:text-base">Quantity</th>
                                    <th className="p-4 text-sm sm:text-base">Purchase Price</th>
                                    <th className="p-4 text-sm sm:text-base">Current Price</th>
                                    <th className="p-4 text-sm sm:text-base">Profit/Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.map((stock, index) => {
                                    const currentPrice = updatedPrices[stock.symbol] ?? stock.currentPrice;
                                    const profitLoss = (currentPrice - stock.purchasePrice) * stock.quantity;
                                        return (
                                            <tr key={index}
                                                className="odd:bg-blue-50 even:bg-white">
                                                {/* <td style={{fontWeight: "bold"}}>{stock.symbol}</td> */}
                                                <td className="p-4 font-bold border-b border-gray-200 text-grey-800 text-sm sm:text-base">{stock.symbol}</td>
                                                <td className="p-4 border-b border-gray-200 text-grey-800 text-sm sm:text-base">{stock.quantity}</td>
                                                <td className="p-4 border-b border-gray-200 text-grey-800 text-sm sm:text-base">${stock.purchasePrice.toFixed(2)}</td>
                                                <td className="p-4 border-b border-gray-200 text-grey-800 text-sm sm:text-base">${currentPrice.toFixed(2)}</td>
                                                <td className={`p-4 font-bold ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                                                >
                                                {profitLoss >= 0 ? "+" : "-"}${Math.abs(profitLoss).toFixed(2)}
                                                </td>
                                            </tr>
                                        )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Layout for smaller screens */}
                    <div className="flex flex-col gap-4 sm:hidden bg-gray-800">
                        {stocks.map((stock, index) => {
                            const currentPrice = updatedPrices[stock.symbol] ?? stock.currentPrice;
                            const profitLoss = (currentPrice - stock.purchasePrice) * stock.quantity;

                            return (
                                <div key={index} className="border rounded-lg p-4 bg-blue-50 shadow-sm">
                                    <div className="mb-1 font-bold">
                                        <span className="font-semibold">Stock Symbol:</span> {stock.symbol}
                                    </div>
                                    <div className="mb-1">
                                        <span className="font-semibold">Quantity:</span> {stock.quantity}
                                    </div>
                                    <div className="mb-1">
                                        <span className="font-semibold">Purchase Price:</span> ${stock.purchasePrice.toFixed(2)}
                                    </div>
                                    <div className="mb-1">
                                        <span className="font-semibold">Current Price:</span> ${currentPrice.toFixed(2)}
                                    </div>
                                    <div className={`font-bold ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        <span className="font-semibold text-gray-800">Profit/Loss:</span> {profitLoss >= 0 ? "+" : "-"}${Math.abs(profitLoss).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
                
            )}
        </div>
    )
}

export default StockList;

