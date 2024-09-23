import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
import ConfirmAppointment from "./pages/navodya/ConfirmAppointment";
import AdminAppointmentView from "./pages/navodya/AdminAppointmentView";
import AdminAppointmentList from "./pages/navodya/AdminAppointmentList";
import Adminhome from "./pages/pamuditha/adminhome";
import Adminprofile from "./pages/pamuditha/admin_profile";
import Adminreg from "./pages/pamuditha/admin-register";
import TestimonialPage from './pages/amalie/TestimonialPage';
import AdminTestimonials from './pages/amalie/AdminTestimonials';
import Fpass from "./pages/pamuditha/fpassword";
import Rpass from "./pages/pamuditha/resetpass";
import Upass from "./pages/pamuditha/userPassReset";
import Cart from "./pages/sasanka/Cart";
import Checkout from "./pages/sasanka/Checkout";
import ProductList  from "./pages/sasanka/ProductList";
import Ca from "./pages/sasanka/ca";
import AllProduct from './pages/anuththara/All Product';


import StatsPage from './pages/anuththara/StatsPage';
//new Anuththara
import Add_Product from './pages/anuththara/Add Product';
import Product_List from './pages/anuththara/Product List';
import UpdateProduct from './pages/anuththara/Update Product';
import ProductDetailPage from './pages/anuththara/ProductDetailPage';
import Addf from './pages/ishan/Addf';
import Vservice from './pages/ishan/Vservice';
import ScategoryAdd from "./pages/ishan/ScategoryAdd";
import Vservice_tb from "./pages/ishan/Vservice_tb";
import Service from './pages/ishan/Service';


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
                        <Route path="/services" element={<SelectServices/>}/>
                        <Route path="/professional" element={<SelectProfessional/>}/>
                        <Route path="/date&time" element={<SelectDateTime/>}/>
                        <Route path="/confirm/:appointmentId" element={<ConfirmAppointment/>}/>
                        <Route path="/view" element={<AdminAppointmentView/>}/>
                        <Route path="/pay" element={<Home/>}/>
                        <Route path="/viewList" element={<AdminAppointmentList/>}/>
                        <Route path="/adminhome" element={<Adminhome/>}/>
                        <Route path="/adminprofile" element={<Adminprofile/>}/>
                        <Route path="/adminreg" element={<Adminreg/>}/>
                        <Route path="/testimonials" element={<TestimonialPage/>}/>
                        <Route path="/admin-testimonials" element={<AdminTestimonials/>}/>
                        <Route path="/forgot-password" element={<Fpass/>}/>
                        <Route path="/reset-password/:token" element={<Rpass/>}/>
                        <Route path="/reset" element={<Upass/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/ProductList" element={<ProductList/>}/>
                        <Route path="/Checkout" element={<Checkout/>}/>
                        <Route path="/ca" element={<Ca/>}/>


                        <Route path="/update-item/:id" element={<UpdateProduct />} />
                        <Route path="/products" element={<StatsPage />} />
                        <Route path="/Addproduct" element={<Add_Product />} />
                        <Route path="/ProductLists" element={<Product_List />} />
                        <Route path="/AllProducts" element={<AllProduct />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />

                        <Route path="/af" element={<Addf/>}/>
                        <Route path="/vs" element={<Vservice/>}/>
                        <Route path="/cadd" element={<ScategoryAdd/>}/>
                        <Route path="/vstb" element={<Vservice_tb/>}/>
                        <Route path="/services" element={<Service/>}/>

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
