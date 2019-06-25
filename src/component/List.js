import React from 'react';
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { Dialog } from "./";

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

const listOptions = {
  dialogOpen: false,
  dialog: {}
}

class EnhanceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(listOptions, props);
  }

  openDialog = (dialogInfo) => {
    this.setState({ dialogOpen: true, dialog: dialogInfo });
  };

  closeDialog = value => {
    this.setState({ dialogOpen: false });

    if(value === "ok" && this.state.dialog.action) {
      this.state.dialog.action();
    }
  };

  render = () => {
    const { classes, items, data } = this.props;
    
    return (
      <div className={classes.root}>
        <List component="nav">
          {items.map(item => {
            let showItem   = (item.beforeShow) ? item.beforeShow(data) : true;
            
            if(item.getIcon) {
              item['icon'] = item.getIcon(data[item.field]);
            }

            let listItemProps = {
              button: true,
              key: `${Date.now()}-list-item-${item.label.replace(' ', '-')}`
            };

            if(item.action) {
              listItemProps.onClick = () => item.action(this, data);
            } else {
              listItemProps.to = item.href;
              listItemProps.component= Link;
            }
            
            return (showItem) ? (
              <ListItem 
                {...listItemProps}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ) : null;
          })}
        </List>

        <Dialog 
          title={this.state.dialog.title}
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          type={this.state.dialog.type} 
          content={this.state.dialog.content}
          text={this.state.dialog.text}
        />
      </div>
    );
  }
}

EnhanceList.defaultProps = {
  data: {}
};

EnhanceList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhanceList);