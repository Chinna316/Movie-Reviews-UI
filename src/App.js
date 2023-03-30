import './App.css';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './home/Home';

function App() {

  const [Movies, setMovies] = useState()
    const getMovies = async() => {
      try {
        const response = await api.get('/Movies');
        setMovies(response.data);
      }
      catch(error) {
        console.log("error");
      }
    }

    useEffect(() => {
      getMovies();
    }, [])
    
  
  return(
    <div className="App">
      <Routes>
        <Route path='/' element={<Layout />}></Route>
        <Route path='/' element={<Home Movies={Movies}/>}></Route>
      </Routes>
    </div>
  );
}
export default App;