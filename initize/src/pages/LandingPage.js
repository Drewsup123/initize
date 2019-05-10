import React from 'react';
// React Router Imports
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Component Imports
import Login from './Login';
import SignUp from './SignUp';

// Landing Page of the Application
export default function LandingPage(){
    return(
        <div className="landing-page-container">
            {/* Routes */}
            <Route path="/login" render={()=><Login />} />
            <Route path="/sign-up" render={()=><SignUp />} />
            <h1>Welcome To Initize</h1>
            <Link to="/login" >Login</Link>
            <Link to="/sign-up">Sign Up</Link>

        </div>
    );
}