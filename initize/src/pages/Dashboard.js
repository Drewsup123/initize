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
        }
    }

    handleClose = () => {
        this.setState({open : false});
    }

    handleOpen = () => {
        this.setState({open: true});
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
            users: [this.props.uid],
            owner:{
                name: this.props.name,
                profilePicture: this.props.profilePicture,
                email:this.props.email,
            },
            tasks:[{taskTitle:"first task", priority: "critical", user:"none", status:"in progress"}],
        }
        boardRef.child(key)
        .update(newBoard)
        .then(() => {
            firebase.firestore().collection('users').doc(this.props.uid).update({
                boards: firebase.firestore.FieldValue.arrayUnion(key)
            }).then(()=>{
                this.props.addBoardId(key)
                this.setState({creatingBoard: false});
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
        let final = [];
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
        this.props.addBoard(final);
    }

    componentDidMount = () => {
        this.props.loggedIn ? this.getUsersBoards() : this.props.history.push('/login') ;
        setTimeout(()=>{this.forceUpdate()},1000)
    }

    render(){
        return(
            <div>
                <Navbar/>
                <h1>{this.props.name}'s Boards</h1>
                {this.props.loggedIn ? <h1>Signed in</h1> : <h1>Signed out</h1>}

                <Fab onClick={this.getUsersBoards} color="primary" aria-label="Add" size="medium">
                        JOIN
                    </Fab>

                <Fab onClick={this.handleOpen} color="primary" aria-label="Add" size="medium">
                    CREATE
                </Fab>

                {this.props.boards ? this.props.boards.map(board => <Board id={board.id} boardTitle={board.name} />) : null}

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