import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/pamuditha/home';
import Register from './pages/pamuditha/register';
import Login from './pages/pamuditha/login';
import SelectServices from './pages/navodya/SelectServices';
import ReactDOM from "react-dom";
import SelectProfessional from "./pages/navodya/SelectProfessional";
import SelectDateTime from "./pages/navodya/SelectDateTime";
import Userp from "./pages/pamuditha/user_profile";
import Adminp from "./pages/pamuditha/admin-users";
import Support from "./pages/shamika/Support";
import STickets from "./pages/shamika/Ticket";
import Existing from "./pages/shamika/Existing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/appointments" element={<SelectServices />} />
          <Route path="/professional" element={<SelectProfessional/>}/>
          <Route path="/date&time" element={<SelectDateTime/>}/>
        <Route path="/userp" element={<Userp/>}/>
        <Route path="/admin-users" element={<Adminp/>}/>
        <Route path="/supporthome" element={<Support/>}/>
        <Route path="/ticket" element={<STickets/>}/>
        <Route path="/existing" element={<Existing/>}/>
      </Routes>
    </Router>
  );
}

export default App;
