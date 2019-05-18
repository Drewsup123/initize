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
import Navbar from '../components/Global/Navbar';
import TaskBoard from '../components/Board/taskBoard';
import SideMenu from '../components/Board/SideMenu';

class Board extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
            open:false,
            newTask:{
                task:"",
                priority:"",
                user:{
                    name: "",
                    profilePicture: "",
                    uid:"",
                },
                status:"Not Started",
                description:"",
                notes:"",
            },
            checkedCritical: false,
            checkedImportant: false,
            checkedNormal: false,
            checkedLow: false,
            tasks:[],
            boardName:"",
            boardOwner:"",
            createdAt:"",
            users:[],
        };
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        // Terrible lol
        const temp = this.state.tasks[oldIndex];
        let tasksCopy = this.state.tasks;
        tasksCopy[oldIndex] = tasksCopy[newIndex];
        tasksCopy[newIndex] = temp;
        this.setState({tasks: tasksCopy})
    };

    handleClose = () => {
        this.setState({open : false});
    }

    handleOpen = () => {
        this.setState({open: true});
    }

    GetBoard = () => {
        firebase.database().ref('/boards/'+ this.props.match.params.id).once('value').then(snap => {
            const board = snap.val();
            this.setState({
                boardName:board.name, 
                boardOwner: board.owner, 
                createdAt: board.createdAt, 
                tasks: board.tasks,
                users: board.users,
            })
        })
    }

    clearNewTask = () => {
        this.setState({newTask:{}});
    }

    addTask = e => {
        this.clearNewTask();
        if(!this.state.newTask.task){
            alert("You need a title to continue");
            return;
        }
        firebase.database().ref('/boards/'+this.props.match.params.id)
        .child('tasks').push(this.state.newTask).then(res => {
            this.handleClose();
        })
        .catch(err => {
            console.log(err);
        })
    }

    handleChange = e => {
        this.setState({newTask : {...this.state.newTask, [e.target.name]: e.target.value }});
        console.log(this.state.newTask);
    }

    checkboxChangeHandler = e => {
        this.setState({ [e.target.value]: e.target.checked });
        this.setState({newTask:{...this.state.newTask, priority:e.target.name}})
    }

    componentDidMount(){
        this.GetBoard();
        console.log(this.state)
        this.newTaskListener();
        this.changedTaskListener();
    }

    newTaskListener = () => {
        firebase.database().ref('boards').child(this.props.match.params.id).child('tasks').on('child_changed', () => {
            this.GetBoard();
        })
    }

    changedTaskListener = () => {
        firebase.database().ref('/boards/'+this.props.match.params.id+'/tasks').on('value', () => {
            this.GetBoard();
        })
    }

    newTaskChangeUser = e => {
        this.setState({newTask : {user : e.target.value}})
    }

    render(){
        return(
            <div>
                <Navbar />
                <div className="board-content">
                    <SideMenu {...this.state} {...this.props}/>
                    <TaskBoard {...this.props}/>
                </div>
                {/* <h1>{this.state.boardName}</h1>
                <h4>Owned by: {this.state.boardOwner.name}</h4>
                <p>createdAt: {this.state.createdAt}</p>
                <button onClick={this.handleOpen}>add a task</button>
                <button onClick={this.GetBoard}>Get Snap</button>
                <SortableDiv items={this.state.tasks} onSortEnd={this.onSortEnd} /> */}

                {/* DIALOG */}
                {/* <Dialog
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
                        value={this.state.newTask.task}
                        /> */}
                        {/* Checkboxes */}
                        {/* <div>
                            <h3>Priority</h3>
                            <Checkbox
                                checked={this.state.checkedCritical}
                                value="checkedCritical"
                                name="critical"
                                onChange={this.checkboxChangeHandler}
                            />Critical
                            <Checkbox
                                checked={this.state.checkedImportant}
                                value="checkedImportant"
                                name="important"
                                color="primary"
                                onChange={this.checkboxChangeHandler}
                            />Important
                            <Checkbox
                                checked={this.state.checkedNormal}
                                value="checkedNormal"
                                name="normal"
                                color="primary"
                                onChange={this.checkboxChangeHandler}
                            />Normal
                            <Checkbox
                                checked={this.state.checkedLow}
                                value="checkedLow"
                                name="low"
                                color="primary"
                                onChange={this.checkboxChangeHandler}
                            />Low
                        </div> */}
                        {/* User Assignment */}
                        {/* <FormControl>
                            <InputLabel>{this.state.newTask.user.name ? this.state.newTask.user.name : "Choose a user"}</InputLabel>
                            <Select
                                value="test"
                                onChange={this.newTaskChangeUser}
                            >
                                {this.state.users.map(user => (
                                <MenuItem key={user.uid} value={user} >
                                    {user.name}
                                </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                        {/* Description */}
                        {/* <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        fullWidth
                        disabled={this.state.creatingBoard}
                        name="description"
                        onChange={this.handleChange}
                        /> */}
                        {/* Notes */}
                        {/* <TextField
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
                        <Button onClick={this.addTask} disabled={this.state.creatingBoard} color="primary">
                        Add Task
                        </Button>
                    </DialogActions>
                </Dialog> */}
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