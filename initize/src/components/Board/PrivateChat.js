import React from 'react';
import * as firebase from "firebase/app";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close'
import zIndex from '@material-ui/core/styles/zIndex';
import Fab from '@material-ui/core/Fab';

class PrivateChat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            newMessage: "",
        };
    }

    timeFromNow = timestamp => moment(timestamp).fromNow();

    getPrivateMessages = () => {
        const currentUser = this.props.uid;
        const chattingUser = this.props.params.uid;
        let first = currentUser > chattingUser ? currentUser : chattingUser;
        let second = first === currentUser ? chattingUser : currentUser;
        firebase.database().ref('privateMessages').child(first + second).once('value').then(snap => {
            console.log("this is the value of messages", snap.val())
            console.log(snap)
            this.setState({messages: snap.val()})
        })
    }

    sendMessage = e => {
        e.preventDefault();
        const currentUser = this.props.uid;
        const chattingUser = this.props.params.uid;
        let first = currentUser > chattingUser ? currentUser : chattingUser;
        let second = first === currentUser ? chattingUser : currentUser;
        const message = {
            content : this.state.newMessage,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user : {
                name: this.props.name,
                uid: currentUser,
                profilePicture: this.props.profilePicture,
            }
        }
        firebase.database().ref('privateMessages')
        .child(first + second)
        .push()
        .set(message).then(() => {
            console.log("sent");
        })
        .catch(err => {
            console.log(err)
            alert("error");
        })
        this.setState({newMessage: ""});
    }

    newChatListener = () => {
        const currentUser = this.props.uid;
        const chattingUser = this.props.params.uid;
        let first = currentUser > chattingUser ? currentUser : chattingUser;
        let second = first === currentUser ? chattingUser : currentUser;
        firebase.database().ref('privateMessages')
        .child(first + second)
        .on('child_added', ()=>this.getPrivateMessages());
    }

    componentDidMount(){
        this.getPrivateMessages();
        this.newChatListener();
    }

    componentDidUpdate(){
        this.scrollToBottom();
    }

    handleChange = e => {
        this.setState({newMessage: e.target.value})
    }

    scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }
    
    render() {
        return (
            <div style={{
                position:'absolute',
                bottom:75,
                right:0,
                height:400,
                maxHeight:400,
                border:"1px solid black",
                borderRadius:"5px",
                background:"white",
                width:"15vw",
                zIndex:"999",
            }} 
            className="private-chat-window"
            >
                <div style={{height:50, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <h1>{this.props.params.name}</h1>
                    <Fab color="secondary" size="small" onClick={this.props.closePopup}><CloseIcon fontSize="10px"/></Fab>
                </div>
                <hr />

                <List style={{height:300, overflowY:"scroll"}} className="chat-box">
                    {this.state.messages ? Object.keys(this.state.messages).map((key, index) => 
                    <ListItem className={`chat-message ${this.state.messages[key].user.uid === this.props.uid ? "users-message" : ""}`} key={index}>
                        <ListItemAvatar className="chat-message-avatar">
                            <Avatar alt="avatar" src={this.state.messages[key].user.profilePicture} />
                        </ListItemAvatar>
                        <ListItemText 
                            className="chat-message-content"
                            primary={this.state.messages[key].user.name}
                            secondary={this.state.messages[key].content}
                        />
                        <ListSubheader className="chat-message-date">
                            {this.timeFromNow(this.state.messages[key].timestamp)}
                        </ListSubheader>
                    </ListItem>)
                    :<p>No messages yet</p>}
                    <div ref={el => { this.el = el; }} />
                </List>
                <form style={{height:50, width:"99%"}} onSubmit={this.sendMessage}>
                    <input placeholder="Message" style={{height:50, width:"100%"}} type="text" value={this.state.newMessage} onChange={this.handleChange} />
                </form>
            </div>
        )
    }
}

export default PrivateChat;