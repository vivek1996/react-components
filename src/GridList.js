import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import Card from "./Card";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    // width: 500,
    // height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

function TitlebarGridList(props) {
  const { classes, items } = props;

  console.log("items", items);
  return (
    <div className={classes.root}>
      <GridList cellHeight={200} className={classes.gridList} cols={4}>
        {items && items.map(item => (
          <GridListTile key={item.id}>
            {/* <img src={tile.img} alt={tile.title} /> */}
            <Card 
              title={`Employers & Employees`}
              subtitle={`Employers & Employees`}
              description={`Employers & Employees`}
            />
            <GridListTileBar
              title={`item.title`}
              actionIcon={
                <IconButton className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);