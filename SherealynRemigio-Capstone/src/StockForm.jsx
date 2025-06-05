import { useContext, useState } from 'react';
import './StockFormStyling.css'
import StockContext from './contexts/StockContext';

function StockForm() {

    const [stockSymbol, setStockSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');

    const {addStock} = useContext(StockContext);

    const API_KEY = "TWYWSN43NMC26OBT";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol.toUpperCase()}&apikey=${API_KEY}`)
        const data = await response.json();

        const quote = data['Global Quote'];

        const currentPrice = parseFloat(quote['05. price']);

        const newStock = {
            symbol: stockSymbol.toUpperCase(),
            quantity: Number(quantity),
            purchasePrice: Number(purchasePrice),
            currentPrice,
        };

        addStock(newStock);

        // Clear form
        setStockSymbol('');
        setQuantity('');
        setPurchasePrice('');
    }

    return (
    <>
         <form onSubmit={handleSubmit}>
            <label>
                <input name='stockSymbol' type='text' placeholder='Stock Symbol' value={stockSymbol} onChange={(e) => setStockSymbol(e.target.value)}/>
            </label>

            <label>
                <input name='quantity' type='number' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
            </label>

            <label>
                <input name='purchasePrice' type='number' placeholder='Purchase Price' value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)}/>
            </label>

            <button type='submit'>Add Stock</button>
        </form>
     </>
    )   
}

export default StockForm;