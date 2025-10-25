import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateOwner from './features/owners/pages/create-owner'
import ListOwners from './features/owners/pages/list-owners'
import Reserve from './features/reservations/pages/reserve'

function App() {
  
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/create-owner" element={<CreateOwner />} />
          <Route path="/owners" element={<ListOwners />} />
          <Route path="/reserve" element={<Reserve />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
