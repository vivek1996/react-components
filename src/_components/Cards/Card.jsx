import React from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography
} from '@material-ui/core';
import PropTypes from "prop-types";

import {List} from './../../_components';

const styles = {
  card: {
    
  },
  media: {
    height: 360,
    width: 360
  },
};

class EnhanceCard extends React.Component {
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
    const { subtitle, title, description, actions, content, media, classes } = this.props;
    const { ...other } = this.props;
    const { data } = this.state;
    
    return (
      <Card className={classes.card}>
        {/* <CardHeader
          classes={{
            root: classes.cardHeader,
            avatar: classes.cardAvatar
          }}
          avatar={<img src={avatar} alt="..." className={classes.img} />}
        /> */}
        {media !== undefined ? (
          <CardMedia
            className={classes.media}
            image={media}
            title=""
          />
        ) : null}
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
          {content !== undefined ? (content) : null}
        </CardContent>
        {(actions) ? (
          <CardActions>
            <List 
              items={actions} 
              data={data}
              { ...other }
            />
          </CardActions>
        ) : null}
      </Card>
    );
  }
}

EnhanceCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  footer: PropTypes.node,
  avatar: PropTypes.string
};

export default withStyles(styles)(EnhanceCard);

