import React from 'react';
import {connect} from 'react-redux';
import * as firebase from "firebase/app";
import {Link} from 'react-router-dom';
import PrivateChat from './PrivateChat'

function SideMenu(props){
    const [inviteCode, setInviteCode] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [privateChatParams, setPrivateChatParams] = React.useState({name:"", uid: "", profilePicture: ""})
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
            {props.boardOwner.uid === props.uid ? <button>Edit Settings/Upgrade</button> : null}
            <hr />
            <Link to={`/board/${props.match.params.id}/board-room`}>Board Room Chat </Link>
            <Link to={`/board/${props.match.params.id}`}>Progress Board </Link>
            <hr />
            <h2>Members({Object.keys(props.users).length}) {props.boardOwner.uid === props.uid ? <div><button onClick={generateInviteCode}>Invite</button><p>invite:{inviteCode}</p></div> : null}</h2>
            {props.users ? Object.keys(props.users).map(user => 
            <div>
                {props.users[user].name} 
                <button 
                    onClick={() => openPrivateChat(props.users[user].name, props.users[user].uid, props.users[user].profilePicture)}
                >Start Chat</button>
            </div>)
            :<h3>Loading...</h3>}
            {isOpen ? <PrivateChat params={privateChatParams} {...props}/> : null}
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