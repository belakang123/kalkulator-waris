import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AiAssistant from './pages/AiAssistant'
import AddMember from './pages/AddMember'
import Calculator from './pages/Calculator'
import History from './pages/History'
import FikihWaris from './pages/FikihWaris'
import Result from './pages/Result'
import Islami from './pages/Islami'
import JadwalSholat from './pages/JadwalSholat'
import ArahKiblat from './pages/ArahKiblat'
import MasjidTerdekat from './pages/MasjidTerdekat'
import Info from './pages/Info'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <HashRouter>
      {/* BottomNav dipasang di luar Routes agar tidak ikut animasi perpindahan halaman */}
      <BottomNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AiAssistant />} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/history" element={<History />} />
        <Route path="/fikih-waris" element={<FikihWaris />} />
        <Route path="/result" element={<Result />} />
        <Route path="/islami" element={<Islami />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />
        <Route path="/arah-kiblat" element={<ArahKiblat />} />
        <Route path="/masjid-terdekat" element={<MasjidTerdekat />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </HashRouter>
  )
}

export default App
