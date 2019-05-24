import React from 'react';
import {connect} from 'react-redux';
import * as firebase from "firebase/app";
import Navbar from '../components/Global/Navbar';
import TaskBoard from '../components/Board/taskBoard';
import SideMenu from '../components/Board/SideMenu';
import BoardRoom from '../components/Board/BoardRoom';
import { Route } from 'react-router-dom';

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
                    <Route exact path="/board/:id" render={() => <TaskBoard {...this.props}/>} />
                    <Route path="/board/:id/board-room" render={() => <BoardRoom {...this.props}/>} />
                </div>
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