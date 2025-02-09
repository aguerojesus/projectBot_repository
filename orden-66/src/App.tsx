import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChatBot from './pages/ChatBot'

function App() {

  return (
    <>
      <Router>
        <div className='app'>
          <div className="content">
            <Routes>
              <Route path="/" element={<ChatBot />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
