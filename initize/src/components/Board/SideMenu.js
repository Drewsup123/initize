import React from 'react';
import {connect} from 'react-redux';
import * as firebase from "firebase/app";
import {Link} from 'react-router-dom';
import PrivateChat from './PrivateChat';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ChatIcon from '@material-ui/icons/Chat';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function SideMenu(props){
    const [inviteCode, setInviteCode] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [privateChatParams, setPrivateChatParams] = React.useState({name:"", uid: "", profilePicture: ""})
    const [inviteOpen, setInviteOpen] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [newBoardName, setNewBoardName] = React.useState('');
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

    const openSettings = () => {
        setSettingsOpen(true);
    }

    const onChangeHandler = e => {
        setNewBoardName(e.target.value);
    }

    const changeBoardName = e => {
        firebase.database().ref('/boards/' + props.match.params.id).update({name : newBoardName}).then(res => {
            alert("Board name was changed to "+ newBoardName);
        })
        .catch(err => {
            alert("There was an error updating your board name")
        })
    }

    // const removeUserFromBoard = e => {
        // props.users[user].name, props.users[user].uid, props.users[user].profilePicture)
    // }

    return(
        <div className="side-menu">
            <div className="side-menu-header-container">
                <h1 className="side-menu-header">{props.boardName}</h1>
                <h6>Created on: {getDate(props.createdAt)}</h6>
            </div>
            {props.boardOwner.uid === props.uid ? <Button color="primary" onClick={openSettings}>Edit Settings/Upgrade</Button> : null}
            <hr />
            <h2>Rooms</h2>
            <div className="side-menu-links">
                <Link to={`/board/${props.match.params.id}`}>Progress Board </Link>
                <Link to={`/board/${props.match.params.id}/board-room`}>Board Room Chat </Link>
            </div>
            <hr />
            <h2>Members({Object.keys(props.users).length}) {props.boardOwner.uid === props.uid ?<Fab onClick={generateInviteCode} size="small" color="primary"><AddIcon/></Fab>: null}</h2>
            {props.users ? Object.keys(props.users).map(user => 
            <div className="side-menu-member">
                <h4>{props.users[user].name}</h4>
                <div>
                    <Fab size="small" onClick={() => openPrivateChat(props.users[user].name, props.users[user].uid, props.users[user].profilePicture)}><ChatIcon /></Fab>
                    {props.boardOwner.uid === props.uid ? <Fab color="secondary" size="small"><DeleteIcon/></Fab> : null}
                </div>
            </div>)
            :<h3>Loading...</h3>}
            {isOpen ? <PrivateChat params={privateChatParams} {...props} closePopup={closePopup} /> : null}

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

            {/* Dialog for Settings */}
            <Dialog
            open={settingsOpen}
            onClose={()=>setSettingsOpen(false)}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title" style={{textAlign:"center"}}>Board Settings</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Board Name
                </DialogContentText>
                <TextField
                fullWidth
                value={newBoardName}
                style={{textAlign: "center"}}
                onChange={onChangeHandler}
                />
                <Button onClick={changeBoardName}>Change Name</Button>
                <h2 style={{textAlign:"center"}}>Upgrade Board</h2>
                <section className="purchase-options">
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                            Small Team
                            </Typography>
                            <Typography variant="h5" component="h2">
                                Have up to 20 members in a board
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Purchase</Button>
                        </CardActions>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                            Medium Team
                            </Typography>
                            <Typography variant="h5" component="h2">
                                Have up to 50 members in a board
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Purchase</Button>
                        </CardActions>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Large Team
                            </Typography>
                            <Typography variant="h5" component="h2">
                                Have up to 100 members in a board
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Purchase</Button>
                        </CardActions>
                    </Card>
                </section>
                
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setSettingsOpen(false)} color="primary">
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