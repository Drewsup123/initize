import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import Task from './Task';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const SortableDiv = SortableContainer(({items, url, handleOpen}) => {
    return (
        <Paper>
            <Table style={{width:'100%'}}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Task</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell><Fab onClick={handleOpen} size="small" color="primary"><AddIcon/></Fab>Add Task</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody style={{width:"100%"}}>
                {items ? Object.keys(items).map((key, index) => (
                    <Task url={url} key={key} index={key} value={items[key]} />
                )) : null}
                </TableBody>
            </Table>
        </Paper>
    );
});


export default SortableDiv;