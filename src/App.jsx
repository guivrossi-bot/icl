import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HubApp from './HubApp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<HubApp />} />
      </Routes>
    </BrowserRouter>
  )
}
