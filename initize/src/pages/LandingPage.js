import React from 'react';
// React Router Imports
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Component Imports
import Login from './Login';
import SignUp from './SignUp';
import './LandingPage.css';
import logo from '../components/Global/logo_transparent.png'

// Landing Page of the Application
export default function LandingPage(){
    return(
        <div className="landing-page-container">
            {/* Routes */}
            <Route path="/login" render={()=><Login />} />
            <Route path="/sign-up" render={()=><SignUp />} />
            <div className="landing-page-nav">
                <img src={logo} alt="logo" className="nav-logo" />
                <div className="nav-links">
                    <Link to="/login" >Login</Link>
                    or
                    <Link to="/sign-up">Sign Up</Link>
                </div>
            </div>

            <div className="top-header">
                <section className="top-header-section">
                    <img src="https://media.giphy.com/media/3havrgiZhH99m/giphy.gif" />
                    <div className="section-content">
                        <h1>Manage Tasks with ease</h1>
                        <p>
                            With Initize you will be able to keep track of all your important tasks while also being able
                            to collaborate with others via public or private messaging built straight into the application.
                        </p>
                    </div>
                </section>

                <section className="top-header-section">
                    <div className="section-content">
                        <h1>Manage Tasks with ease</h1>
                        <p>
                            With Initize you will be able to keep track of all your important tasks while also being able
                            to collaborate with others via public or private messaging built straight into the application.
                        </p>
                    </div>
                    <img src="https://media.giphy.com/media/3havrgiZhH99m/giphy.gif" />
                </section>
            </div>

        </div>
    );
}