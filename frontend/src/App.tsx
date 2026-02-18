import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/categoria" element={<Categoria />} */}
          {/* <Route path="/categoria/:slug" element={<Categoria />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
