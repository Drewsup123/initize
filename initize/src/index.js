import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import StoreProvider from './Store';
// import { createMuiTheme } from '@material-ui/core/styles';
// import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router} from 'react-router-dom';
import fb from './firebase';
require('dotenv').config();
fb();

// const theme = createMuiTheme({
//     mixins: {
//         logo_black: '#0E0E0E',
//         logo_limeGreen: '#8EC925',
//         logo_darkGreen: '#046A37',
//     },
// });

ReactDOM.render(
    <Router>
        <StoreProvider>
            <App />
        </StoreProvider>
    </Router>
, 
document.getElementById('root')
);
