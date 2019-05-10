import React from 'react';
import {Store} from  './Store';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Confirm from './pages/Confirm';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Account from './pages/Account';
import { Route } from 'react-router-dom';
// Redirect, withRouter

function App() {
  const {state} = React.useContext(Store);
  return (
    <React.Fragment>
        <Route exact path="/" render={()=>state.loggedIn ? <Confirm/> : <LandingPage />} />
        <Route path="/login" render={()=><Login />} />
        <Route path="/sign-up" render={()=><SignUp />} />
        <Route path="/dashboard" render={()=><Dashboard />} />
        <Route path="/messages" render={()=><Messages />} />
        <Route path="/Account" render={()=><Account />} />
    </React.Fragment>
  )
}

export default App;
