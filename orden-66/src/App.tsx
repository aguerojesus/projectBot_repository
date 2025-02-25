import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import 'animate.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Verifica si hay un indicador en sessionStorage
    const isRefreshed = sessionStorage.getItem("isRefreshed");

    if (isRefreshed) {
      console.log("La página se ha refrescado.");
      // Aquí puedes ejecutar la lógica necesaria al detectar un refresh
      localStorage.removeItem("historyChat");
    }

    // Marca la sesión como activa
    sessionStorage.setItem("isRefreshed", "true");

    return () => {
      sessionStorage.removeItem("isRefreshed"); // Limpia al desmontar
    };
  }, []);

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
