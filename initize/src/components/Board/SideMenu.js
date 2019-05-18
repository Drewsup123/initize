import React from 'react';
import {connect} from 'react-redux';
import * as firebase from "firebase/app";

function SideMenu(props){
    const [inviteCode, setInviteCode] = React.useState("")

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

    return(
        <div className="side-menu">
            <h1>{props.boardName}</h1>
            <h6>Created on: {getDate(props.createdAt)}</h6>
            {props.boardOwner.uid === props.uid ? <button>Edit Settings/Upgrade</button> : null}
            <hr />
            <button>Board Room/Chat</button>
            <hr />
            <h2>Members({props.users.length}) {props.boardOwner.uid === props.uid ? <div><button onClick={generateInviteCode}>Invite</button><p>invite:{inviteCode}</p></div> : null}</h2>
            {props.users ? props.users.map(user => <div>{user.name} <button>Start Chat</button></div>):<h3>Loading...</h3>}
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