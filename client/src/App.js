import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './pages/pamuditha/home';
import Test1 from './pages/pamuditha/test1';
import Test2 from './pages/pamuditha/test2';
// import SP from './pages/navodya/SelectServices';
import Test3 from './pages/anuththara/Addproduct';
import Test4 from './pages/anuththara/EditProduct';
import Test5 from './pages/anuththara/Cart';
import Test6 from './pages/anuththara/Checkout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/test1" element={<Test1/>}/>
                <Route path="/" element={<Test2/>}/>
                <Route path="/Addp" element={<Test3/>}/>
                <Route path="/Updt" element={<Test4/>}/>
                <Route path="/Cart" element={<Test5/>}/>
                <Route path="/Chk" element={<Test6/>}/>

                {/*<Route path="/test3" element={<SP />} />*/}

            </Routes>
        </Router>
    );
}

export default App;
