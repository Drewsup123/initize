import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import * as firebase from "firebase/app"; 
import {Store} from '../Store';
import { Redirect, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {handleSignup} from '../actions/index';

const styles = theme => ({
    main: {
        width:"100%",
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    span:{
        color:"blue",
        cursor:"pointer",
        '&:hover':{
            color:"darkblue",
            textDecoration:"underline"
        }
    }
});

function SignIn(props) {
    const { classes } = props;
    const [userInfo, setUserInfo] = React.useState({email:"", name:"", phoneNumber:""});
    const [password, setPassword] = React.useState({password1:"", password2:""});
    const [errorMessage, setErrorMessage] = React.useState("");
    const [remember, setRemember] = React.useState(false);

    const passwordValid = () => {
        const {password1, password2} = password
        if(password1.length === 0 || password2.length===0){
            setErrorMessage("Please fill out password fields")
            return false;
        }
        else if(password1 !== password2){
            setErrorMessage("Passwords do not match")
            return false;
        }
        else if(password1.length < 7){
            setErrorMessage("Password is too short")
            return false;
        }
        return true;
    }

    const handlePassword = e => {
        setPassword({...password, [e.target.name]: e.target.value})
    }

    const handleChange = e => {
        setUserInfo({...userInfo, [e.target.name] : e.target.value})
        console.log(userInfo);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const {email, name} = userInfo;
        if(!email || !name || !passwordValid()){
            if(!email){
                setErrorMessage("Please input an email")
            }
            else if(!name){
                setErrorMessage("Please input your name")
            }
            return;
        }else{
            firebase.auth().createUserWithEmailAndPassword(userInfo.email, password.password1)
            .then(res => {
                console.log(res);
                const user = {
                    email: userInfo.email,
                    name: userInfo.name,
                    phoneNumber: userInfo.phoneNumber,
                    uid: res.user.uid,
                    dateJoined: Date.now(),
                    profileImg:"",
                }
                if(remember){
                    localStorage.setItem('user', JSON.stringify(user));
                }
                props.handleSignup(user)
                firebase.firestore().collection('users').doc(user.uid).set(user).then(res=>{
                    console.log("added user to firestore")
                })
                .catch(err => {
                    console.log(err)
                    alert("Sorry there was an error adding your user")
                    return;
                })
                console.log("REDIRECTING")
                props.history.push('/dashboard')
            })
            .catch(error => {
                console.log(error);
                alert("Sorry there was an error adding your user");
            });
        }
    }

    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Sign Up
                </Typography>

                <Typography component="h1" variant="h5">
                {errorMessage}
                </Typography>
                <form onSubmit={handleSubmit} className={classes.form}>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input onChange={handleChange} id="email" name="email" autoComplete="email" autoFocus />
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">First and Last Name</InputLabel>
                        <Input onChange={handleChange} id="username" name="name" autoComplete="name" autoFocus />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="email">Phone Number</InputLabel>
                        <Input onChange={handleChange} id="phoneNumber" name="phoneNumber" autoComplete="tel" autoFocus />
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input onChange={handlePassword} name="password1" type="password" id="password1" />
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Confirm Password</InputLabel>
                        <Input onChange={handlePassword} name="password2" type="password" id="password2" />
                    </FormControl>

                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                        onChange={()=>setRemember(!remember)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                </form>
                <p>Already have an account? Login <span className={classes.span} onClick={()=>props.history.push('/login')}>here</span></p>
            </Paper>
        </main>
    );
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    console.log("MAP STATE TO PROPS : ",state);
    return {
        loggedIn: state.loggedIn,
        email: state.email,
        name: state.name,
        phoneNumber: state.phoneNumber,
        uid: state.uid,
        profilePicture: state.profilePicture,
    };
};

const ws = withStyles(styles)(SignIn)

// export default withRouter(ws)

export default connect(mapStateToProps, {handleSignup})(withRouter(ws));