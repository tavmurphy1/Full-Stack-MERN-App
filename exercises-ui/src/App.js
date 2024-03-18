import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExercisePage from './pages/AddExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import { useState } from 'react';
import { Link } from 'react-router-dom';


function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState([]);

  return (

    <div className="App">
      <header>
        <h1>Exercise Tracker</h1>
        <p>Welcome! This is a full-stack MERN app built with React, Express, and MongoDB. </p>
      </header>

      <Router>
        <div className="App-header">
        <Navigation />  
		<Routes>
          <Route path="/" element={<HomePage setExerciseToEdit={setExerciseToEdit}/>}/>
          <Route path="/add-exercise" element={<AddExercisePage />}/>
          <Route path="/edit-exercise" element={ <EditExercisePage exerciseToEdit={exerciseToEdit}/>}/>
		  </Routes>
          </div>
      </Router>

      <footer>
        <p>© 2024 Tavner Murphy</p>
      </footer>

    </div>
  );
}

function Navigation() {
  return (
      <nav>
        <Link to="/">Home</Link>
        <Link to="/add-exercise"> New Exercise </Link>
      </nav>
  );
}

export default App
