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
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import mime from 'mime-types';
import uuidv4 from "uuid/v4";

class BoardRoom extends React.Component{
    constructor(){
        super();
        this.state = {
            messages: [],
            newMessage:"",
            file:"",
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

    sendMessage = e => {
        e.preventDefault();
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
        this.setState({newMessage: ""})
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

    addFile = e => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ file : file });
        }
        console.log("File: ", this.state.file);
    }

    uploadFile = (file, metaData) => {
        // Sets the upload path and creates the ref with the file extension 
        const uploadPath = `/boardrooms/${this.props.match.params.id}/${uuidv4()}.${metaData.contentType}`;
        firebase.storage().ref().child(uploadPath).put(file, metaData).then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {
                return(url)
            })
            console.log("Storage Response")
        })
        .catch(err => {
            console.log("Storage Error", err);
        })
    }

    sendFile = () => {
        const {file} = this.state;
        if (file !== null || file !== ""){
            const metaData = {contentType: mime.lookup(file.name)};
            const fileUrl = this.uploadFile(file, metaData);
            console.log("FILE URL", fileUrl)
            const message = {
                timestamp : firebase.database.ServerValue.TIMESTAMP,
                file: fileUrl,
                user:{ 
                    name: this.props.name, 
                    profilePicture: this.props.profilePicture,
                    uid: this.props.uid,
                },
            };
            firebase.database().ref('boardRooms').child(this.props.match.params.id)
            .push()
            .set(message).then(res => {
            console.log(res);
            })
            .catch(err => {
                alert("error");
                console.log(err);
            })
        }else{
            alert("no file")
        }
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
                <button onClick={this.sendFile}>Send File</button>
                <input
                        accept="image/*, .pdf, .doc"
                        id="contained-button-file"
                        multiple
                        type="file"
                        style={{display:"none"}}
                        onChange={this.addFile}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" component="span">
                            <CloudUploadIcon/>
                        </Button>
                    </label>
                <form onSubmit={this.sendMessage} className="input-field">
                    <TextField
                        fullWidth
                        label="Place your message here"
                        style={{ width:"90%"}}
                        placeholder="Message"
                        margin="normal"
                        variant="filled"
                        onEnter={this.sendMessage}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.onChangeHandler}
                        value={this.state.newMessage}
                        autoCorrect
                        className="input-field-text-box"
                    />
                </form>
            </div>
        )
    }
}

export default BoardRoom;