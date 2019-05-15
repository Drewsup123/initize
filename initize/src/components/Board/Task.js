import React from 'react';
import {SortableElement} from 'react-sortable-hoc';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const Task = SortableElement(({value}) => {
    return(
    <TableRow>
        {/* Task Name */}
        <TableCell>{value}</TableCell>
        {/* Priority */}
        <TableCell>{value}</TableCell>
        {/* User */}
        <TableCell>{value}</TableCell>
        {/* Status */}
        <TableCell>{value}</TableCell>
        {/* Description */}
        <TableCell>{value}</TableCell>
        {/* Notes */}
        <TableCell>{value}</TableCell>
    </TableRow>
    )
});

export default Task;