import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';


const styles = props => ({
    boardContainer:{
        height:"250px",
        width:"30%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        // background: 'rgb(0,0,0)',
        background: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(73,70,252,1) 100%)',
        border: '2px solid white',
        marginTop:"20px",
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
        <Link className={classes.boardContainer} to={`/board/${props.id}`}>
            <h4 className={classes.boardTitle}>{props.boardTitle}</h4>
        </Link>
    );
}

Board.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Board);