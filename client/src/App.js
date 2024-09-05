import React from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './App.css';
import Home from './pages/pamuditha/home';
import Register from './pages/pamuditha/register';
import Login from './pages/pamuditha/login';
import SelectServices from './pages/navodya/SelectServices';
import SelectProfessional from "./pages/navodya/SelectProfessional";
import SelectDateTime from "./pages/navodya/SelectDateTime";
import Userp from "./pages/pamuditha/user_profile";
import Adminp from "./pages/pamuditha/admin-users";
import Support from "./pages/shamika/Support";
import STickets from "./pages/shamika/Ticket";
import Ct1 from "./pages/com/crud-test";
import UpdateRecord from "./pages/com/updatec";

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}
            >
                <div className="route-container">
                    <Routes location={location}>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/appointments" element={<SelectServices/>}/>
                        <Route path="/professional" element={<SelectProfessional/>}/>
                        <Route path="/date&time" element={<SelectDateTime/>}/>
                        <Route path="/userp" element={<Userp/>}/>
                        <Route path="/admin-users" element={<Adminp/>}/>
                        <Route path="/supporthome" element={<Support/>}/>
                        <Route path="/ticket" element={<STickets/>}/>
                        <Route path="/crud" element={<Ct1/>}/>
                        <Route path="/update/:id" element={<UpdateRecord/>}/>
                    </Routes>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

function App() {
    return (
        <Router>
            <AnimatedRoutes/>
        </Router>
    );
}

export default App;
