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

class Dashboard extends React.Component{
    constructor(){
        super();
        this.state = {
            open: true,
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

    createGroup = e => {
        e.preventDefault();
        console.log("clicked")
        // this.setState({creatingBoard: true});
        // const boardRef = firebase.database().ref('boards');
        // const key = boardRef.push().key;
        // const newBoard = {
        //     id: key,
        //     name: this.state.boardName,
        //     createdAt: Date.now(),
        //     users: [],
        //     owner: state.owner
        // }
    }

    render(){
        return(
            <div>
                <Navbar/>
                <h1>Boards</h1>

                <Fab onClick={this.handleOpen} color="primary" aria-label="Add" size="medium">
                        JOIN
                    </Fab>

                <Fab onClick={this.handleOpen} color="primary" aria-label="Add" size="medium">
                    CREATE
                </Fab>

                <Board boardImg="https://s26552.pcdn.co/wp-content/uploads/2018/03/dc_neighborhood_news-13.jpg" boardTitle="Duck Team" />

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

export default Dashboard;