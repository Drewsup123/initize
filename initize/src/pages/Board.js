import React from 'react';
import {connect} from 'react-redux';
import {arrayMove} from 'react-sortable-hoc';
import SortableDiv from '../components/Board/SortableDiv';
import * as firebase from "firebase/app";
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class Board extends React.Component{
    constructor(){
        super();
        this.state = {
            items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
            open:true,
            newTask:{
                task:"",
                priority:"",
                user:{},
                status:"",
                description:"",
                notes:"",
            }
        };
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    handleClose = () => {
        this.setState({open : false});
    }

    handleOpen = () => {
        this.setState({open: true});
    }

    GetBoardTasks = () => {
        firebase.database().ref('boards').child(this.props.match.params)
    }

    addTask = e => {

    }

    handleChange = e => {
        this.setState({newTask : {...this.state.newTask, [e.target.name]: e.target.value }});
        console.log(this.state.newTask);
    }

    render(){
        return(
            <div>
                <h1>Board page</h1>
                <button onClick={this.handleOpen}>add a task</button>
                <SortableDiv items={this.state.items} onSortEnd={this.onSortEnd} />

                {/* DIALOG */}
                <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add a Task</DialogTitle>
                    <DialogContent>
                        <TextField
                        autoFocus
                        margin="dense"
                        label="Task Title"
                        fullWidth
                        disabled={this.state.creatingBoard}
                        name="task"
                        onChange={this.handleChange}
                        />
                        <div>
                            <h3>Priority</h3>
                            <Checkbox
                                checked={true}
                                value="checkedA"
                            />Critical
                            <Checkbox
                                checked={true}
                                value="checkedB"
                                color="primary"
                            />Important
                            <Checkbox
                                checked={true}
                                value="checkedB"
                                color="primary"
                            />Normal
                            <Checkbox
                                checked={true}
                                value="checkedB"
                                color="primary"
                            />Low
                        </div>

                        <FormControl >
                            <InputLabel htmlFor="demo-controlled-open-select">Assign User</InputLabel>
                            <Select
                                inputProps={{
                                name: 'age',
                                id: 'demo-controlled-open-select',
                                }}
                            >
                                <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Drew Johnson</MenuItem>
                                <MenuItem value={20}>Billy bob</MenuItem>
                                <MenuItem value={30}>bob billy jr</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        fullWidth
                        disabled={this.state.creatingBoard}
                        name="description"
                        onChange={this.handleChange}
                        />

                        <TextField
                        autoFocus
                        margin="dense"
                        label="Notes"
                        fullWidth
                        disabled={this.state.creatingBoard}
                        name="notes"
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
        boards: state.boards,
        boardsId: state.boardsId,
        dateJoined: state.dateJoined
    };
};

export default connect(
    mapStateToProps
)(Board);