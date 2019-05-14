import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';


const styles = props => ({
    boardContainer:{
        height:"250px",
        width:"25%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"red",
    },
    boardTitle:{
        textAlign:"center",
        fontSize:"2rem",
        borderBottom:"1px solid black",
        borderTop:"1px solid black",
        background:"rgba(255,255,255,0.5)",
        width:'100%',
    }
});

function Board(props){
    const { classes } = props;
    return(
        <Link to={`/board/${props.id}`}>
            <div className={classes.boardContainer}>
                <h4 className={classes.boardTitle}>{props.boardTitle}</h4>
            </div>
        </Link>
    );
}

Board.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Board);