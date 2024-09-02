import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/pamuditha/home';
import Test1 from './pages/pamuditha/test1';
import Test2 from './pages/pamuditha/test2';
import Test3 from './pages/navodya/SelectServices';
import Test4 from './pages/navodya/SelectProfessional';
// import SP from './pages/navodya/SelectServices';
import S from './pages/sasanka/s';
import Cart from './pages/sasanka/Cart';
import Checkout from "./pages/sasanka/Checkout";
import ReactDOM from "react-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
          <Route path="/test1" element={<S />} />
          <Route path="/Test3" element={<Test3 />} />
          <Route path="/s" element={<S />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Checkout" element={<Checkout/>}/>
          {/*<Route path="/test3" element={<SP />} />*/}

      </Routes>
    </Router>
  );
}

export default App;
