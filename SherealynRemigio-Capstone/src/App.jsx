import './App.css'
import StockForm from './StockForm'
import StockList from './StockList'
import {StockProvider} from "./contexts/StockContext";

function App() {

  return (
    <div className='min-h-screen bg-gray-800 px-4 py-6 flex justify-center items-center'>
      <div className='w-full max-w-4xl p-6'>
        <h1 className='text-3xl font-bold pb-4 text-neutral-50'>Finance Dashboard</h1>
        <StockProvider>
          <StockForm />
          <h2 className='text-2xl font-bold pb-4 pt-8 text-neutral-50'>Stock List</h2>
          <StockList />
        </StockProvider>
      </div>
    </div>
  )
}

export default App
