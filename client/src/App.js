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
import Addproduct from "./pages/anuththara/Add Products";
import ProductT from "./pages/anuththara/ProductTable";
import ProductTT from "./pages/anuththara/AllProductsPage";
import UpdateItem from './pages/anuththara/UpdateItem';
import StatsPage from './pages/anuththara/StatsPage';

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
        <Route path="/ProductL" element={<ProductT/>}/>
        <Route path="/ProductLL" element={<ProductTT/>}/>
        <Route path="/update-item/:id" element={<UpdateItem />} />
        <Route path="/products" element={<StatsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
