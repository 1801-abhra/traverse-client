import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { JourneyProvider } from './context/JourneyContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SearchResults from './pages/SearchResults'
import JourneyBuilder from './pages/JourneyBuilder'
import OrderSummary from './pages/OrderSummary'
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'
import MyTrips from './pages/MyTrips'
import Profile from './pages/Profile'
import AlgorithmDemo from './pages/AlgorithmDemo'

function App() {
  return (
    <BrowserRouter>
      <JourneyProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/algorithm" element={<AlgorithmDemo />} />
          <Route path="/journey-builder"
            element={<JourneyBuilder />} />
          <Route path="/order-summary"
            element={<OrderSummary />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation"
            element={<Confirmation />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </JourneyProvider>
    </BrowserRouter>
  )
}

export default App