import React from 'react';
import * as firebase from "firebase/app";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';

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
            alert("Sent")
        })
        .catch(err => {
            console.log(err)
            alert("error");
        })
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

    handleChange = e => {
        this.setState({newMessage: e.target.value})
    }
    
    render() {
        return (
            <div style={{
                position:'absolute',
                bottom:0,
                right:0,
                maxHeight:'400px'
            }} className="private-chat-window">
                <h1>Chat with {this.props.params.name}</h1>
                <hr />

                <List style={{overflowY:"scroll"}} className="chat-box">
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

                {/* {this.state.messages ? Object.keys(this.state.messages).map(key => 
                    <p>{this.state.messages[key].content}</p>
                ):<p>No messages yet :(</p>} */}
                <input type="text" onChange={this.handleChange} />
                <button onClick={this.sendMessage}>Send</button>
            </div>
        )
    }
}

export default PrivateChat;