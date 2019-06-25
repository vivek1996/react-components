import React from "react";

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Popover from '@material-ui/core/Popover';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import SwapVert from '@material-ui/icons/SwapVert';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

const styles = theme => ({
  
});

class Sort extends React.Component {
  state = {
    anchorEl: null
  };

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  render = () => {
    const { classes, options, data, onChange } = this.props;
    const { anchorEl  } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const renderSortingMenu = (
      <Popover
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={this.handleCloseMenu}
        className={classes.popper}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <List className={classes.list}>
          <ListItem 
            alignItems="flex-start"
            onClick={() => {
              this.handleCloseMenu();
            }}
          >
            <ListItemText
              secondary={`Sort By : `}
            />
            <ListItemIcon>
              <SwapVert />
            </ListItemIcon>
          </ListItem>

          {options.map((option) => {
            let sortDirection = (data.sortBy === option.name && data.sortDirection === 'DESC') ? 'ASC' : 'DESC';

            return (option.sort) ? (
              <ListItem 
                key={`sort-${option.name}`}
                alignItems="flex-start"
              >
                <ListItemText
                  primary={option.label}
                />

                <ListItemSecondaryAction>
                  <IconButton aria-label={sortDirection} 
                    onClick={() => {
                      let sortObj = {
                        sortBy: option.name,
                        sortDirection: sortDirection
                      }

                      let tempdata = Object.assign({}, data, sortObj);
                      onChange(tempdata)
                      this.handleCloseMenu();
                    }}
                  >
                    {
                      (data.sortBy === option.name && data.sortDirection === 'DESC') 
                      ? <ArrowUpward />
                      : <ArrowDownward />
                    }
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ) : null;
          })}
        </List>
      </Popover>
    );

    return (
      <div>
        <IconButton
          color="inherit"
          aria-label="open sorting"
          aria-haspopup="true"
          onClick={this.handleOpenMenu}
        >
          <SwapVert />
        </IconButton>
        
        {renderSortingMenu}
      </div>
    );
  }
}

export default withStyles(styles)(Sort);