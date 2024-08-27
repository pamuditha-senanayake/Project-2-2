import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/pamuditha/home';
import Test1 from './pages/pamuditha/test1';
import Test2 from './pages/pamuditha/test2';
// import SP from './pages/navodya/SelectServices';
import ReactDOM from "react-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
          <Route path="/test1" element={<Test1 />} />
          <Route path="/" element={<Test2 />} />
          {/*<Route path="/test3" element={<SP />} />*/}

      </Routes>
    </Router>
  );
}

export default App;
