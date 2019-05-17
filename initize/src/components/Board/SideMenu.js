import React from 'react';
import {connect} from 'react-redux';

function SideMenu(props){
    const getDate = date => {
        let fdate = Date(date).toString()
        return fdate.substring(0, 15)
    }
    return(
        <div className="side-menu">
            <h1>{props.boardName}</h1>
            <h6>Created on: {getDate(props.createdAt)}</h6>
            {props.boardOwner.uid === props.uid ? <button>Edit Settings/Upgrade</button> : null}
            <hr />
            <button>Board Room/Chat</button>
            <hr />
            <h2>Members({props.users.length}) {props.boardOwner.uid === props.uid ? <button>+</button> : null}</h2>
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