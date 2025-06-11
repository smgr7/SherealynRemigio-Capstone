import { useContext, useState } from 'react';
import StockContext from './contexts/StockContext';

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
    

function StockForm() {

    const [stockSymbol, setStockSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {addStock} = useContext(StockContext);

    const API_KEY = import.meta.env.VITE_API_KEY;

    const resetForm = () => {
        setStockSymbol('');
        setQuantity('');
        setPurchasePrice('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!stockSymbol.trim()) {
            if(stockSymbol === '') {
                 setError('Stock symbol is required.')
            } else {
                setError('Stock symbol cannot contain only spaces.')
            }
            return;
        }
           
        if (/\s/.test(stockSymbol)) {
            setError('Stock symbol cannot contain spaces.');
            return;
        }

        if(!quantity || isNaN(quantity) || Number(quantity) <= 0) {
            setError('Quantity must be a positive number.');
            return;
        }

        if(!purchasePrice || isNaN(purchasePrice) || Number(purchasePrice) <= 0) {
            setError('Purchase price must be a positive number.');
            return;
        }

        setLoading(true);
        setError('');

        try{
            const currentPrice = await fetchCurrentPrice(stockSymbol.toUpperCase(), API_KEY);
            //const currentPrice = await fetchCurrentPrice(stockSymbol.toUpperCase());

            const newStock = {
                symbol: stockSymbol.toUpperCase(),
                quantity: Number(quantity),
                purchasePrice: Number(purchasePrice),
                currentPrice,
            };

            addStock(newStock);
            resetForm();   
        } catch (err) {
            setError(err.message || 'Failed to fetch stock data');
        } finally {
            setLoading(false);
        }  
    }

    return (
    <>
        {loading && <p className="loading">Fetching stock price...</p>}
        {error && <p className="error">{error}</p>}

         <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[20px] sm:gap-[10px] w-full sm:w-auto mx-auto">
            <label>
                <input name='stockSymbol' type='text' required aria-label='Stock Symbol' placeholder='Stock Symbol' value={stockSymbol} onChange={(e) => setStockSymbol(e.target.value)} className="p-[9px] border border-gray-300 rounded text-base w-full sm:w-auto placeholder:text-base text-white"/>
            </label>

            <label>
                <input name='quantity' type='number' required aria-label='Quantity' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} className="p-[9px] border border-gray-300 rounded text-base w-full sm:w-auto placeholder:text-base text-white"/>
            </label>

            <label>
                <input name='purchasePrice' type='number' required aria-label='Purchase Price' placeholder='Purchase Price' value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="p-[9px] border border-gray-300 rounded text-base w-full sm:w-auto placeholder:text-base text-white"/>
            </label>

            <button type='submit' className="bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold py-[10px] px-[20px] rounded border-none w-full sm:w-auto">Add Stock</button>
        </form>
     </>
    )   
}

export default StockForm;