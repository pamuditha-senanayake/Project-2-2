import React from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './App.css';

// Import pages
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
import UserAppointmentView from "./pages/navodya/UserAppointmentView";
import UserAppointmentView2 from "./pages/navodya/UserAppointmentView2";
import Adminhome from "./pages/pamuditha/adminhome";
import Adminprofile from "./pages/pamuditha/admin_profile";
import Adminreg from "./pages/pamuditha/admin-register";
import TestimonialPage from './pages/amalie/TestimonialPage';
import AdminTestimonials from './pages/amalie/AdminTestimonials';
import Fpass from "./pages/pamuditha/fpassword";
import Rpass from "./pages/pamuditha/resetpass";
import UChart from "./pages/pamuditha/chart";
import Upass from "./pages/pamuditha/userPassReset";
import Cart from "./pages/sasanka/Cart";
import Checkout from "./pages/sasanka/Checkout";
import ProductList from "./pages/sasanka/ProductList";
import Ca from "./pages/sasanka/ca";
import AllProduct from './pages/anuththara/All Product';
import InqHome from './pages/shamika/inq_home';
import Admin_inq from './pages/shamika/admin_inq';
import AdminOrderDetails from './pages/sasanka/adminOrderDetails';
import Allcategory from "./pages/ishan/Allcategory";


import StatsPage from './pages/anuththara/StatsPage';
import Add_Product from './pages/anuththara/Add Product';
import Product_List from './pages/anuththara/Product List';
import UpdateProduct from './pages/anuththara/Update Product';
import ProductDetailPage from './pages/anuththara/ProductDetailPage';
//ishan
import Addservice from './pages/ishan/ServiceAddForm';
import Addcategory from "./pages/ishan/CategoryAddForm";
import Adminservicview from "./pages/ishan/VeawServiceDetails";
import Service from './pages/ishan/Service';
import AddPayment from './pages/dasun/AddPayment';
import UpdateCard from './pages/dasun/UpdateCard';
import DeleteCard from './pages/dasun/DeleteCard';
import Wallet from './pages/dasun/Wallet';
import Wallet2 from './pages/dasun/Wallet2';
import AddCard from './pages/dasun/addcard';
import ViewCard from './pages/dasun/viewcard';
import AppointmentPayment from "./pages/dasun/AppointmentPayment";

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
                        <Route path="/myappointment" element={<UserAppointmentView/>}/>
                        <Route path="/myappointment2" element={<UserAppointmentView2/>}/>
                        <Route path="/pay" element={<Home/>}/>
                        <Route path="/viewList" element={<AdminAppointmentList/>}/>
                        <Route path="/adminhome" element={<Adminhome/>}/>
                        <Route path="/adminprofile" element={<Adminprofile/>}/>
                        <Route path="/chart" element={<UChart/>}/>
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
                        <Route path="/adminOrderDetails" element={<AdminOrderDetails/>}/>


                        <Route path="/update-item/:id" element={<UpdateProduct/>}/>
                        <Route path="/products" element={<StatsPage/>}/>
                        <Route path="/Addproduct" element={<Add_Product/>}/>
                        <Route path="/ProductLists" element={<Product_List/>}/>
                        <Route path="/AllProducts" element={<AllProduct/>}/>
                        <Route path="/product/:id" element={<ProductDetailPage/>}/>

                        <Route path="/addservice" element={<Addservice/>}/>
                        <Route path="/addcategory" element={<Addcategory/>}/>
                        <Route path="/adminservicview" element={<Adminservicview/>}/>
                        <Route path="/services" element={<Service/>}/>
                        <Route path="/allcategory" element={<Allcategory/>}/>

                        <Route path="/inq" element={<InqHome/>}/>
                        <Route path="/admin_inq" element={<Admin_inq/>}/>
                        <Route path="/addpayment" element={<AddPayment/>}/>
                        <Route path="/upcard" element={<UpdateCard/>}/>
                        <Route path="/deletecard" element={<DeleteCard/>}/>
                        <Route path="/wallet" element={<Wallet/>}/>
                        <Route path="/wallet2" element={<Wallet2/>}/>
                        <Route path="/addcard" element={<AddCard/>}/>
                        <Route path="/viewcard" element={<ViewCard/>}/>
                        <Route path="/deletecd" element={<DeleteCard/>}/>
                        <Route path="/appointmentpayment/:appointmentId" element={<AppointmentPayment/>}/>

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
