import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import { createMuiTheme } from '@material-ui/core/styles';
// import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router} from 'react-router-dom';
import fb from './firebase';
// Redux imports
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import {reducer} from './reducers/index';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import './index.css';
require('dotenv').config();
fb();


// const theme = createMuiTheme({
//     mixins: {
//         logo_black: '#0E0E0E',
//         logo_limeGreen: '#8EC925',
//         logo_darkGreen: '#046A37',
//     },
// });

const store = createStore(
    reducer,
    applyMiddleware(thunk,logger)
)

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <App />
        </Provider >
    </Router>
, 
document.getElementById('root')
);
