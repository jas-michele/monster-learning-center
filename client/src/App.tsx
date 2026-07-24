import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Mechanic from './pages/Mechanic/Mechanic'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mechanic" element={<Mechanic />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
