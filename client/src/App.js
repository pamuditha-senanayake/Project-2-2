import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './pages/pamuditha/home';
import Register from './pages/pamuditha/register';
import Login from './pages/pamuditha/login';
import SelectServices from './pages/navodya/SelectServices';
import SelectProfessional from "./pages/navodya/SelectProfessional";
import SelectDateTime from "./pages/navodya/SelectDateTime";
import ConfirmAppointment from "./pages/navodya/ConfirmAppointment";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={<Login/>}/>
                <Route path="/appointments" element={<SelectServices/>}/>
                <Route path="/professional" element={<SelectProfessional/>}/>
                <Route path="/date&time" element={<SelectDateTime/>}/>
                <Route path="/confirm" element={<ConfirmAppointment/>}/>


            </Routes>
        </Router>
    );
}

export default App;
