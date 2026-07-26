import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Home from './pages/Home/Home';
import Register from './pages/Register/Register';


function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App

