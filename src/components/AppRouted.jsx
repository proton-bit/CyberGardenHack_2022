import React from 'react';
import '../App.css';
import { Routes, Route} from 'react-router-dom';
import About from '../pages/About.jsx'
import Home from '../pages/Home.jsx'
import Auth from '../pages/Auth.jsx'
import Account from '../pages/Account.jsx'

const AppRouted = () => {

    return (
        <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
        
        </Routes>

    );
};

export default AppRouted;
