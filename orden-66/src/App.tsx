import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import 'animate.css';

function App() {

  return (
    <>
      <Router>
        <div className='app'>
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
