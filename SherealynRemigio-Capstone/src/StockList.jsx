import { useState, useContext, useEffect, useCallback } from "react";
import StockContext from "./contexts/StockContext";

function StockList() {
    const [stock, setStock] = useState("");
    const context = useContext(StockContext);

    useEffect(()=> {
        fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo')
        .then(response => response.json())
        .then(data => console.log(data));
    }, []);

    function handleChange(e) {
        setStock(e.target.value);
    }

    return (
        <div className="stock-list">
            
        </div>
    )
}

