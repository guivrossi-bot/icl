import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HubApp from './HubApp'

const IgniteApp = lazy(() => import('./labs/ignite/App'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/labs/ignite/*"
          element={
            <Suspense fallback={null}>
              <IgniteApp />
            </Suspense>
          }
        />
        <Route path="/*" element={<HubApp />} />
      </Routes>
    </BrowserRouter>
  )
}
