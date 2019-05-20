import React from 'react';
import * as firebase from "firebase/app";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';

class BoardRoom extends React.Component{
    constructor(){
        super();
        this.state = {
            messages: [],
            newMessage:"",
        }
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
    }

    newMessageListener = () => {
        firebase.database().ref('boardRooms').child(this.props.match.params.id).on('child_added', () => {
            this.getMessages();
        })
    }

    render(){
        return(
            <div >
                <h1>Board Room Here!!!!</h1>
                <List>
                    {this.state.messages ? Object.keys(this.state.messages).map((key, index) => 
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar alt="avatar" src={this.state.messages[key].user.profilePicture} />
                        </ListItemAvatar>
                        <ListItemText 
                            primary={this.state.messages[key].user.name}
                            secondary={this.state.messages[key].content}
                        />
                            {/* {this.state.messages[key].content}
                        </ListItemText> */}
                    </ListItem>)
                    :null}
                </List>
                <div>
                    <TextField
                        id="filled-full-width"
                        label="Place your message here"
                        style={{ margin: 8 }}
                        placeholder="Message"
                        fullWidth
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