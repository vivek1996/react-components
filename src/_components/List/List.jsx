import React from 'react';
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class EnhanceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  render = () => {
    const { classes, items, data } = this.props;
    
    return (
      <div className={classes.root}>
        <List component="nav">
          {items.map(item => {
            let itemBtn;
            if(item.getIcon) {
              item['icon'] = item.getIcon(data[item.field]);
            }

            if(item.action) {
              itemBtn = <ListItem button onClick={() => item.action(this, data)}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>;
            } else {
              itemBtn = <ListItem button to={item.href} component={Link}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>;
            }

            return itemBtn;
          })}
        </List>
      </div>
    );
  }
}

EnhanceList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhanceList);