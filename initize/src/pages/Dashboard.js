import React from 'react';
import Navbar from '../components/Global/Navbar';
import Board from '../components/Dashboard/Board';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as firebase from "firebase/app";
import {connect} from 'react-redux';
import {addBoard, addBoardId} from '../actions/index';
import {withRouter} from 'react-router-dom';

class Dashboard extends React.Component{
    constructor(){
        super();
        this.state = {
            open: false,
            creatingBoard: false,
            boardName: "",
            joinOpen: false,
            inviteCode:"",
            loading: false,
        }
    }

    handleClose = () => {
        this.setState({open : false});
    }

    handleOpen = () => {
        this.setState({open: true});
    }

    handleJoinOpen = () => {
        this.setState({joinOpen: true})
    }

    handleJoinClose = () => {
        this.setState({joinOpen: false})
    }

    handleChangeJoin = e => {
        this.setState({inviteCode : e.target.value})
    }

    joinBoard = () => {
        firebase.database().ref('invites').child(this.state.inviteCode).once('value').then(snap => {
            const boardId = snap.val();
            // IMPLEMENT THIS WHEN PAYMENT SYSTEM IS IN PLACE
            // firebase.database().ref('boards').child(boardId).once('value').then(snapshot => {
            //     const info = snapshot.val();
            //     if(info.users.length + 1 > info.users.maxUsers){
            //         alert("Not allowed in : Board does not have enough available slots")
            //     }else{
            //         firebase.firestore().collection('users').doc(this.props.id).update({
            //             boards: firestore.arrayUnion(boardId);
            //         })
            //     }
            // })
            firebase.firestore().collection('users').doc(this.props.uid).update({
                boards : firebase.firestore.FieldValue.arrayUnion(boardId)
            }).then(() => {
                const ref = firebase.database().ref('/boards/' + boardId + '/users').push();
                ref.set({
                        name: this.props.name, 
                        profilePicture: this.props.profilePicture,
                        uid: this.props.uid
                }).then(res => {
                    alert("you have been added successfully")
                })
                .catch(err => {
                    console.log(err);
                    alert("Error adding you to the board")
                })
            })
        }).catch(err => {
            console.log(err);
            alert("Error joining the board check the invite code or make sure it is not outdated")
        })
    }

    handleChange = e => {
        this.setState({boardName: e.target.value})
    }

    createGroup = e => {
        e.preventDefault();
        console.log("clicked")
        this.setState({creatingBoard: true});
        const boardRef = firebase.database().ref('boards');
        const key = boardRef.push().key;
        const newBoard = {
            id: key,
            name: this.state.boardName,
            createdAt: Date.now(),
            users: [{uid:this.props.uid, name:this.props.name, profilePicture:this.props.profilePicture}],
            owner:{
                name: this.props.name,
                profilePicture: this.props.profilePicture,
                email:this.props.email,
                uid: this.props.uid
            },
            tasks:[],
        }
        boardRef.child(key)
        .update(newBoard)
        .then(() => {
            firebase.firestore().collection('users').doc(this.props.uid).update({
                boards: firebase.firestore.FieldValue.arrayUnion(key)
            }).then(()=>{
                // Add code somewhere around here to make a board-rooms area for public messages
                this.props.addBoardId(key)
                this.setState({creatingBoard: false});
                this.getUsersBoards();
                this.handleClose();
            })
            .catch(err => {
                console.log(err);
                alert("Error creating board", err.message)
                this.setState({creatingBoard: false});
                this.handleClose();
            })
        })
        .catch(err => {
            alert("Sorry there was an error creating your board");
            console.log(err)
        })
    }

    getUsersBoards = () => {
        this.setState({loading: true});
        let final = [];
        if(!this.props.boardsId){
            return;
        }
        this.props.boardsId.forEach(board => {
            console.log("id", board)
            firebase.database().ref("/boards/" + board).once('value').then(snap => {
                console.log("SNAPSHOTVAL", snap.val())
                final.push(snap.val());
            })
            .catch(err=>{
                alert("There was an error recieving your boards :(", err.message)
            })
        })
        return(final);
    }

    componentDidMount = async() => {
        await this.props.loggedIn ? this.props.addBoard(this.getUsersBoards()) : this.props.history.push('/login') ;
        setTimeout(()=>this.forceUpdate(), 2000);
        this.setState({loading: false});
    }

    render(){
        return(
            <div>
                <Navbar/>
                <div className="dashboard">
                    <h1>{this.props.name}'s Boards</h1>
                    
                    <div>
                        <Fab onClick={this.handleJoinOpen} color="primary" aria-label="Add" size="medium">
                            JOIN
                        </Fab>

                        <Fab onClick={this.handleOpen} color="primary" aria-label="Add" size="medium">
                            CREATE
                        </Fab>
                    </div>

                    {this.state.loading ? <p>Loading...</p> : null}
                    <div className="user-boards">
                        {this.props.boards 
                        ? this.props.boards.map(board => <Board id={board.id} boardTitle={board.name} />) 
                        : <p>User has no boards</p>
                        }
                    </div>
                </div>
                {/* DIALOG */}
                <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Join/Create a board</DialogTitle>
                    <DialogContent>
                        <TextField
                        autoFocus
                        margin="dense"
                        label="Board Name"
                        fullWidth
                        disabled={this.state.creatingBoard}
                        onChange={this.handleChange}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button disabled={this.state.creatingBoard} onClick={this.handleClose} color="primary">
                        Cancel
                        </Button>
                        <Button onClick={this.createGroup} disabled={this.state.creatingBoard} color="primary">
                        Create
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* End DIALOG */}
                {/* DIALOG */}
                <Dialog
                open={this.state.joinOpen}
                onClose={this.handleJoinClose}
                aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Join a board</DialogTitle>
                    <DialogContent>
                        <TextField
                        autoFocus
                        margin="dense"
                        label="Invite Code"
                        fullWidth
                        disabled={this.state.creatingBoard}
                        onChange={this.handleChangeJoin}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button disabled={this.state.creatingBoard} onClick={this.handleJoinClose} color="primary">
                        Cancel
                        </Button>
                        <Button onClick={this.joinBoard} disabled={this.state.creatingBoard} color="primary">
                        Join
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* End DIALOG */}
            </div>
        )
    }
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
        boardsId: state.boardsId,
        boards: state.boards,
    };
};

export default connect(mapStateToProps,{addBoard, addBoardId})(withRouter(Dashboard));