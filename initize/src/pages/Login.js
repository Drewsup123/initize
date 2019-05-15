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
import { withRouter } from 'react-router-dom';
import {handleLogin} from '../actions/index';
import {connect} from 'react-redux';
import * as firebase from 'firebase/app'

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

function Login(props) {
    const { classes } = props;
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState({password1:""});
    const [errorMessage, setErrorMessage] = React.useState("");
    const [remember, setRemember] = React.useState(false);

    const handlePassword = e => {
        setPassword(e.target.value)
    }

    const handleChange = e => {
        setEmail(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        if(!email || !password){
            if(!email){
                setErrorMessage("Please input an email")
            }
            else if(!password){
                setErrorMessage("Please input password")
            }
            return;
        }else{
            firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                    console.log(res);
                    firebase.firestore().collection('users').doc(res.user.uid).get().then(docSnap => {
                        console.log(docSnap.data());
                        const user = docSnap.data();
                        if(remember){
                            localStorage.setItem('user', JSON.stringify(user));
                        }
                        console.log("USER", docSnap.data())
                        props.handleLogin(user);
                        props.history.push('/dashboard')
                    })
                    .catch(err => {
                        alert("Error logging you in \n", err.message)
                    })
                })
                .catch(error => {
                    alert(error.message);
                    }
                );
        }
    }

    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Login
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
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input onChange={handlePassword} name="password1" type="password" id="password1" />
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
                        Login
                    </Button>
                </form>
                <p>Don't have an account? Sign up <span className={classes.span} onClick={()=>props.history.push('/sign-up')}>here</span></p>
            </Paper>
        </main>
    );
}

Login.propTypes = {
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

const ws = withStyles(styles)(Login)

export default connect(
    mapStateToProps,
    {handleLogin}
)(withRouter(ws));