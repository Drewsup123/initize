import React from 'react';
import {SortableElement} from 'react-sortable-hoc';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as firebase from "firebase/app";
import {withRouter} from 'react-router-dom';

const Task = SortableElement(({value, url, index}) => {
    // console.log("this is the value", value)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);

    const priorityLevelStyling = p => {
        if(p === "important"){
            return{background:"yellow"};
        }
        if(p === "critical"){
            return{background:"red"};
        }
        if(p === "normal"){
            return {background: "lightblue"};
        }
        else{
            return{background: "green"}
        }
    }

    const statusStyling = s => {
        if(s === "In Progress"){
            return {background: "yellow"};
        }
        if(s === "done"){
            return {background: "green"}
        }
        if(s === "Needs Work"){
            return {background: "lightgreen"}
        }
        if(s === "Not Started"){
            return {background: "#dd5216"}
        }
        else{
            return {background:"lightblue"}
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

    return(
    <TableRow>
        {/* Task Name */}
        <TableCell>{value.task}</TableCell>
        {/* Priority */}
        <TableCell 
            style={priorityLevelStyling(value.priority)}
        >
            <button
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={event=>setAnchorEl(event.currentTarget)}
            name="button"
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
        <TableCell>{value.user ? value.user.name : "user"}</TableCell>
        {/* Status */}
        <TableCell 
            style={statusStyling(value.status)}>
            <button
            aria-owns={anchorEl2 ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={event=>setAnchorEl2(event.currentTarget)}
            name="button"
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
        <TableCell>{value.description}</TableCell>
        {/* Notes */}
        <TableCell>{value.notes}</TableCell>
        {/* <button onClick={()=>alert("hello world")}>Edit</button> */}
    </TableRow>
    )
});

export default withRouter(Task);