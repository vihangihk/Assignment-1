import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import FileUpload from './components/FileUpload';
import User from './components/User';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/upload" element={<FileUpload />} />
                <Route path="/users" element={<User />} />
                <Route path="/" element={
                    <div className="container mt-5">
                        <h1>Welcome to My App</h1>
                    </div>
                } />
            </Routes>
        </Router>
    );
};

export default App;
