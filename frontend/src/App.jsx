import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Reservations from './pages/Reservations'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="about" element={<About />} />
        <Route path="gallery" element={<Gallery />} />
      </Route>
    </Routes>
  )
}

export default App
