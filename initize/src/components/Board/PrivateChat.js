import React from 'react';
import * as firebase from "firebase/app";

class PrivateChat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            newMessage: "",
        };
    }

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
            }} className="private-chat-window">
                <h1>Chat with {this.props.params.name}</h1>
                <hr />
                {this.state.messages ? Object.keys(this.state.messages).map(key => 
                    <p>{this.state.messages[key].content}</p>
                ):<p>No messages yet :(</p>}
                <input type="text" onChange={this.handleChange} />
                <button onClick={this.sendMessage}>Send</button>
            </div>
        )
    }
}

export default PrivateChat;