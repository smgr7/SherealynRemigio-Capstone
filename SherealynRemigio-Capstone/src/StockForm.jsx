import './StockFormStyling.css'

function StockForm() {

    return (
    <>
         <form>
            <label>
                <input name='stockSymbol' type='text' placeholder='Stock Symbol'/>
            </label>

            <label>
                <input name='quantity' type='number' placeholder='Quantity'/>
            </label>

            <label>
                <input name='purchasePrice' type='number' placeholder='Purchase Price'/>
            </label>

            <button type='submit'>Add Stock</button>
        </form>
     </>
    )   
}

export default StockForm;