import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Mechanic from './pages/Mechanic/Mechanic'
import Race from './pages/Race/Race'
import DinoHunt from './pages/DinoHunt/DinoHunt'
import Storytime from './pages/Storytime/Storytime'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mechanic" element={<Mechanic />} />
        <Route path="/race" element={<Race />} />
        <Route path="/dinohunt" element={<DinoHunt />} />
        <Route path="/storytime" element={<Storytime />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
