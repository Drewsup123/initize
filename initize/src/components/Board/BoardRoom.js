import React from 'react';
import * as firebase from "firebase/app";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

class BoardRoom extends React.Component{
    constructor(){
        super();
        this.state = {
            messages: [],
            newMessage:"",
        }
    }

    scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }

    getMessages = () => {
        firebase.database().ref('/boardRooms/' + this.props.match.params.id ).once('value').then(snap => {
            console.log("this is the messages", snap.val())
            this.setState({messages : snap.val()});
        })
        .catch(err => {
            alert("Error getting board room messages: ", err.message)
        })
    }

    sendMessage = () => {
        const message = {
            timestamp : firebase.database.ServerValue.TIMESTAMP,
            content: this.state.newMessage,
            user:{ 
                name: this.props.name, 
                profilePicture: this.props.profilePicture,
                uid: this.props.uid,
            },
        }
        firebase.database().ref('boardRooms').child(this.props.match.params.id)
            .push()
            .set(message).then(res => {
            console.log(res);
            })
            .catch(err => {
                alert("error");
                console.log(err);
            })
    }

    onChangeHandler = e => {
        this.setState({newMessage : e.target.value});
    }

    componentDidMount(){
        this.getMessages();
        this.newMessageListener();
        this.scrollToBottom();
    }

    componentDidUpdate(){
        this.scrollToBottom();
    }

    newMessageListener = () => {
        firebase.database().ref('boardRooms').child(this.props.match.params.id).on('child_added', () => {
            this.getMessages();
        })
    }

    timeFromNow = timestamp => moment(timestamp).fromNow();

    getDate = date => {
        return moment(date).subtract(1, 'days').calendar();
    }

    render(){
        return(
            <div className="board-room">
                <List className="chat-box">
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
                    :null}
                    <div ref={el => { this.el = el; }} />
                </List>
                <div className="input-field">
                    <TextField
                        fullWidth
                        id="filled-full-width"
                        label="Place your message here"
                        style={{ width:"90%"}}
                        placeholder="Message"
                        margin="normal"
                        variant="filled"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.onChangeHandler}
                    />
                    <button onClick={this.sendMessage}>Send</button>
                </div>
            </div>
        )
    }
}

export default BoardRoom;