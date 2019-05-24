import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import NavLogo from './logo_transparent.png';
import {Link} from 'react-router-dom';

const styles ={
    root: {
        width: '100%',
        height:'9vh',
        margin:0,
        padding:0,
        background:"#51168C",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
};

class Navbar extends React.Component {
    render(){
        const {classes} = this.props;
        return (
        <div className={classes.root}>
            <Link to='/dashboard'><img src={NavLogo} alt="logo" style={{height:"100px"}}/></Link>
            <p>Account Settings</p>
        </div>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);