import { useState, useEffect, useContext, useCallback } from "react";
import StockContext from "./contexts/StockContext";
import './StockListStyling.css'

function StockList() {
    
    const {stocks} = useContext(StockContext);

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
                            const profitLoss = (stock.currentPrice - stock.purchasePrice) * stock.quantity;
                                return (
                                    <tr key={index}>
                                        <td style={{fontWeight: "bold"}}>{stock.symbol}</td>
                                        <td>{stock.quantity}</td>
                                        <td>${stock.purchasePrice.toFixed(2)}</td>
                                        <td>${stock.currentPrice.toFixed(2)}</td>
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

