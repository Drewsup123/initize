import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import Task from './Task';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const SortableDiv = SortableContainer(({items}) => {
    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Notes</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                {items.map((value, index) => (
                    <Task key={`item-${index}`} index={index} value={value} />
                ))}
                </TableBody>
            </Table>
        </Paper>
    );
});

export default SortableDiv;