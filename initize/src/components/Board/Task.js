import React from 'react';
import {SortableElement} from 'react-sortable-hoc';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as firebase from "firebase/app";
import {withRouter} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';

const Task = SortableElement(({value, url, index}) => {
    // console.log("this is the value", value)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [edits, setEdits] = React.useState(
            {
                task: value.task, 
                description: value.description,
                notes: value.notes,
            }
        )
    let defaultStyle = {width:"100%", height:"50px", border:"none", cursor:"pointer", fontWeight:"bold", fontSize:"14px"};

    const priorityLevelStyling = p => {
        if(p === "important"){
            return{...defaultStyle, background:"yellow"};
        }
        if(p === "critical"){
            return{...defaultStyle, background:"red"};
        }
        if(p === "normal"){
            return {...defaultStyle, background: "lightblue"};
        }
        else{
            return{...defaultStyle, background: "green"}
        }
    }

    const statusStyling = s => {
        if(s === "In Progress"){
            return {...defaultStyle, background: "yellow"};
        }
        if(s === "done"){
            return {...defaultStyle, background: "green"}
        }
        if(s === "Needs Work"){
            return {...defaultStyle, background: "lightgreen"}
        }
        if(s === "Not Started"){
            return {...defaultStyle, background: "#dd5216"}
        }
        else{
            return {...defaultStyle, background:"lightblue"}
        }
    }

    const changePriority = priority => {
        console.log("key:", index, "url", url)
        firebase.database().ref(`/boards/${url}/tasks/${index}`)
        .update({priority: priority})
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            alert("there was an error changing the priority status of that task")
            console.log(err);
        })
        setAnchorEl(null);
    }

    const changeStatus = status => {
        firebase.database().ref(`/boards/${url}/tasks/${index}`)
        .update({status: status})
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
            alert("There was an error changing the status of that task")
        })
        setAnchorEl2(null);
    }

    const onChangeHandler = e => {
        setEdits({...edits, [e.target.name] : e.target.value});
    }

    const onSubmitEdits = e => {
        if(edits === value){
            return;
        }else{
            firebase.database().ref(`/boards/${url}/tasks/${index}`).update({
                task: edits.task,
                description: edits.description,
                notes: edits.notes,
            }).then(res => {
                console.log(res);
            })
            .catch(err => {
                alert("error updating task");
                console.log(err);
            })
        }
    }

    const onDeleteTask = e => {
        e.preventDefault();
        firebase.database().ref(`/boards/${url}/tasks`).child(index).remove().then(() => {
            alert("deleted task")
        })
        .catch(err => {
            console.log(err);
            alert(err.message)
        })
    }

    return(
            <TableRow style={{width:"100%"}}>
                <TableCell style={{width:"5%"}}><MenuIcon /></TableCell>
                {/* Task Name */}
                <TableCell style={{width:"15%"}}><input onChange={onChangeHandler} onKeyDown={e => e.keyCode === 13?onSubmitEdits():null} name="task" className="task-input" type="text" value={edits.task} /></TableCell>
                {/* Priority */}
                <TableCell width="15%">
                    <button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={event=>setAnchorEl(event.currentTarget)}
                    name="button"
                    style={priorityLevelStyling(value.priority)}
                    >
                    {value.priority}
                    </button>
                    <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={()=>setAnchorEl(null)}
                    >
                        <MenuItem onClick={()=>changePriority('critical')}>critical</MenuItem>
                        <MenuItem onClick={()=>changePriority('important')}>important</MenuItem>
                        <MenuItem onClick={()=>changePriority('normal')}>normal</MenuItem>
                        <MenuItem onClick={()=>changePriority('low')}>low</MenuItem>
                    </Menu>
                </TableCell>
                {/* User */}
                <TableCell style={{width:"10%"}}><Avatar src={value.user.profilePicture}/>{value.user ? value.user.name : "user"}</TableCell>
                {/* Status */}
                <TableCell style={{width:"15%"}}>
                    <button
                    aria-owns={anchorEl2 ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={event=>setAnchorEl2(event.currentTarget)}
                    name="button"
                    style={statusStyling(value.status)}
                    >
                    {value.status}
                    </button>
                    <Menu
                    id="simple-menu"
                    anchorEl={anchorEl2}
                    open={Boolean(anchorEl2)}
                    onClose={()=>setAnchorEl2(null)}
                    >
                        <MenuItem onClick={()=>changeStatus('done')}>Done</MenuItem>
                        <MenuItem onClick={()=>changeStatus('In Progress')}>In Progress</MenuItem>
                        <MenuItem onClick={()=>changeStatus('Needs Work')}>Needs Work</MenuItem>
                        <MenuItem onClick={()=>changeStatus('Not Started')}>Not Started</MenuItem>
                    </Menu>
                </TableCell>
                {/* Description */}
                <TableCell style={{width:"17%"}}><input onChange={onChangeHandler} onKeyDown={e => e.keyCode === 13?onSubmitEdits():null} name="description" className="task-input" type="text" value={edits.description} /></TableCell>
                {/* Notes */}
                <TableCell style={{width:"17%"}}><input onSubmit={onSubmitEdits} onChange={onChangeHandler} onKeyDown={e => e.keyCode === 13?onSubmitEdits():null} name="notes" className="task-input" type="text" value={edits.notes} /></TableCell>
                <TableCell style={{width:"4%"}}>
                    <button style={{borderRadius:"5px", border:"1px solid black", cursor:"pointer"}} onClick={onDeleteTask}>Delete</button>
                </TableCell>
            </TableRow>
    )
});

export default withRouter(Task);