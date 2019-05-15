import React from 'react';
import {SortableElement} from 'react-sortable-hoc';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const Task = SortableElement(({value}) => {
    return(
    <TableRow>
        <TableCell>{value}</TableCell>
        <TableCell>{value}</TableCell>
        <TableCell>{value}</TableCell>
        <TableCell>{value}</TableCell>
        <TableCell>{value}</TableCell>
        <TableCell>{value}</TableCell>
    </TableRow>
    )
});

export default Task;