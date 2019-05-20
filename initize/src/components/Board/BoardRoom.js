import React from 'react';
import * as firebase from "firebase/app";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

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

    }

    onChangeHandler = e => {

    }

    componentDidMount(){
        this.getMessages();
    }

    addBoilerPlateMessage = e => {
        const message = {content: "Hello world", name: "Drew Johnson", profilePicture: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'};
        firebase.database().ref('boardRooms').child(this.props.match.params).set({messages : [message]}).then(res => {
            console.log(res);
        })
        .catch(err => {
            alert("error");
            console.log(err);
        })
    }

    render(){
        return(
            <div className="board-room">
                <h1>Board Room Here!!!!</h1>
                <button onClick={this.addBoilerPlateMessage} >mesasge</button>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src='https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light' />
                        </ListItemAvatar>
                        <ListItemText>This is just a test comment</ListItemText>
                    </ListItem>
                </List>
                <List>
                    {this.state.messages ? this.state.messages.map(message => 
                    <ListItem key={message.text}>
                        <ListItemAvatar>
                            <Avatar alt="avatar" src={message.profilePicture} />
                        </ListItemAvatar>
                        {message.text}
                    </ListItem>)
                    :null}
                </List>
            </div>
        )
    }
}

export default BoardRoom;