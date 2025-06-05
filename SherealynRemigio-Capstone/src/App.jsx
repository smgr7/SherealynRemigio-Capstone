import './App.css'
import StockForm from './StockForm'
import StockList from './StockList'
import {StockProvider} from "./contexts/StockContext";

function App() {

  return (
    <>
      <h1>Finance Dashboard</h1>
      <StockProvider>
        <StockForm />
        <h2>Stock List</h2>
        <StockList />
      </StockProvider>
    </>
  )
}

export default App
