import React from 'react';
import {SortableElement} from 'react-sortable-hoc';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const Task = SortableElement(({value}) => {
    console.log("this is the value", value)
    return(
    <TableRow>
        {/* Task Name */}
        <TableCell>{value.task}</TableCell>
        {/* Priority */}
        <TableCell>{value.priority}</TableCell>
        {/* User */}
        <TableCell>User</TableCell>
        {/* Status */}
        <TableCell>{value.status}</TableCell>
        {/* Description */}
        <TableCell>{value.description}</TableCell>
        {/* Notes */}
        <TableCell>{value.notes}</TableCell>
    </TableRow>
    )
});

export default Task;