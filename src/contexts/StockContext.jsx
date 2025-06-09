import { createContext, useState, useCallback } from "react";

const StockContext = createContext();

//StockProvider is a wrapper component which provides context to all components inside it
//StockForm and StockList are the children of StockProvider
const StockProvider = ({children}) => {
    const [stocks, setStocks] = useState([]);


    //To add a stock
    const addStock = useCallback((stock) => {
        setStocks((prevStocks) => [...prevStocks, stock]);
    }, [])

    return (
        <StockContext.Provider value={{stocks, setStocks, addStock}}>
            {children}
        </StockContext.Provider>
    )
}

export default StockContext;
export {StockProvider};