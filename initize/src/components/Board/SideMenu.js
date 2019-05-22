import React from 'react';
import {connect} from 'react-redux';
import * as firebase from "firebase/app";
import {Link} from 'react-router-dom';
import PrivateChat from './PrivateChat';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function SideMenu(props){
    const [inviteCode, setInviteCode] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [privateChatParams, setPrivateChatParams] = React.useState({name:"", uid: "", profilePicture: ""})
    const [inviteOpen, setInviteOpen] = React.useState(false);
    console.log("This is props sideMenu", props)

    const getDate = date => {
        let fdate = Date(date).toString()
        return fdate.substring(0, 15)
    }

    const generateInviteCode = () => {
        const ref = firebase.database().ref('invites');
        const inviteCode = ref.push().key;
        ref.child(inviteCode).set(props.match.params.id).then(() => {
            setInviteCode(inviteCode);
            setInviteOpen(true);
        })
        .catch(err => {
            alert(err.message)
        })
    }

    const openPrivateChat = (name, uid, profilePicture) => {
        setPrivateChatParams({name: name, uid: uid, profilePicture: profilePicture});
        setIsOpen(true);
    }

    const closePopup = () => {
        setIsOpen(false)
    }

    return(
        <div className="side-menu">
            <h1>{props.boardName}</h1>
            <h6>Created on: {getDate(props.createdAt)}</h6>
            {props.boardOwner.uid === props.uid ? <Button color="primary">Edit Settings/Upgrade</Button> : null}
            <hr />
            <Link to={`/board/${props.match.params.id}/board-room`}>Board Room Chat </Link>
            <Link to={`/board/${props.match.params.id}`}>Progress Board </Link>
            <hr />
            <h2>Members({Object.keys(props.users).length}) {props.boardOwner.uid === props.uid ?<Fab onClick={generateInviteCode} size="small" color="primary"><AddIcon/></Fab>: null}</h2>
            {props.users ? Object.keys(props.users).map(user => 
            <div>
                {props.users[user].name} 
                <button 
                    onClick={() => openPrivateChat(props.users[user].name, props.users[user].uid, props.users[user].profilePicture)}
                >Start Chat</button>
            </div>)
            :<h3>Loading...</h3>}
            {isOpen ? <PrivateChat params={privateChatParams} {...props}/> : null}
            {/* Dialog for Invite Code */}
            <Dialog
            open={inviteOpen}
            onClose={()=>setInviteOpen(false)}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Invite Code</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Send this Code to the person you would like to invite to the board and have them input it on their
                    dashboard they will be able to join as long as you have enough member space in this board to continue.
                </DialogContentText>
                <TextField
                label="Invite Code"
                fullWidth
                value={inviteCode}
                style={{textAlign: "center"}}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setInviteOpen(false)} color="primary">
                    Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => {
    console.log("MAP STATE TO PROPS : ",state);
    return {
        loggedIn: state.loggedIn,
        email: state.email,
        name: state.name,
        phoneNumber: state.phoneNumber,
        uid: state.uid,
        profilePicture: state.profilePicture,
        boards: state.boards,
        boardsId: state.boardsId,
        dateJoined: state.dateJoined
    };
};

export default connect(mapStateToProps)(SideMenu);