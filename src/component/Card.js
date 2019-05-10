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

import {List} from './';

const styles = {
  card: {},
  media: {
    height: 200,
    width: 200
  },
  center: {
    justifyContent: "center"
  }
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
    const { subtitle, title, description, actions, content, image, media, classes } = this.props;
    const { ...other } = this.props;
    const { data } = this.state;
    
    return (
      <Card className={classes.card}>
        {image !== undefined ? (
          <CardMedia
            className={classes.media}
            image={image}
            title={title}
          />
        ) : null}
        {media !== undefined ? (
          <CardMedia
            className={classes.media}
            src={media}
            title={title}
          />
        ) : null}
        {(title !== undefined || subtitle !== undefined || description !== undefined || content !== undefined) ? (
          <CardContent>
          {title !== undefined ? (
              <Typography component="h1">
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
        ) : null}
        {(actions) ? (
          <CardActions 
            className={!Array.isArray(actions) && classes.center}
          >
            {
              (Array.isArray(actions)) ? (
                <List 
                  items={actions} 
                  data={data}
                  { ...other }
                />
              ) : actions
            }
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

