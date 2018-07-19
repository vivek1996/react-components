import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography
} from '@material-ui/core';
import PropTypes from "prop-types";

import {List} from './../../_components';

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ 
      data: nextProps.data 
    });
  }

  render = () => {
    const { subtitle, title, description, actions } = this.props;
    const { ...other } = this.props;
    const { data } = this.state;
    
    return (
      <Card>
        {/* <CardHeader
          classes={{
            root: classes.cardHeader,
            avatar: classes.cardAvatar
          }}
          avatar={<img src={avatar} alt="..." className={classes.img} />}
        /> */}
        <CardContent>
        {title !== undefined ? (
            <Typography component="h5">
              {title}
            </Typography>
          ) : null}
          {subtitle !== undefined ? (
            <Typography component="h6">
              {subtitle}
            </Typography>
          ) : null}
          {description !== undefined ? (
            <Typography component="p">
              {description}
            </Typography>
          ) : null}
        </CardContent>
        <CardActions>
          <List 
            items={actions} 
            data={data}
            { ...other }
          />
        </CardActions>
      </Card>
    );
  }
}

ProfileCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  footer: PropTypes.node,
  avatar: PropTypes.string
};

export default ProfileCard;
