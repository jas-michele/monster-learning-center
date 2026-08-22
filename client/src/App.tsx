import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Achievements from './pages/Achievements/Achievements';
import Mechanic from './pages/Mechanic/Mechanic'
import Race from './pages/Race/Race'
import DinoHunt from './pages/DinoHunt/DinoHunt'
import ExploreDino from './pages/ExploreDino/ExploreDino';
import Storytime from './pages/Storytime/Storytime'
import PracticeLap from './pages/PracticeLap/PracticeLap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register/>} />
        <Route path='/home' element={<Home />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/mechanic" element={<Mechanic />} />
        <Route path="/race" element={<Race />} />
        <Route path="/dinohunt" element={<DinoHunt />} />
        <Route path="/explore-dino" element={<ExploreDino />} />
        <Route path="/storytime" element={<Storytime />} />
        <Route path="/practice-lap" element={<PracticeLap />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

