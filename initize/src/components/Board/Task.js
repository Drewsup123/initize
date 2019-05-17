import React from 'react';
import {SortableElement} from 'react-sortable-hoc';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const Task = SortableElement(({value}) => {
    // console.log("this is the value", value)

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

    return(
    <TableRow>
        {/* Task Name */}
        <TableCell>{value.task}</TableCell>
        {/* Priority */}
        <TableCell style={priorityLevelStyling(value.priority)}>{value.priority}</TableCell>
        {/* User */}
        <TableCell>{value.user ? value.user.name : "user"}</TableCell>
        {/* Status */}
        <TableCell style={statusStyling(value.status)}>{value.status}</TableCell>
        {/* Description */}
        <TableCell>{value.description}</TableCell>
        {/* Notes */}
        <TableCell>{value.notes}</TableCell>
        {/* <button onClick={()=>alert("hello world")}>Edit</button> */}
    </TableRow>
    )
});

export default Task;