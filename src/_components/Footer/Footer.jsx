import React from "react";
import PropTypes from "prop-types";
// import { withStyles } from '@material-ui/core';

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        {/* <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="#home" className={classes.block}>
                Home
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#company" className={classes.block}>
                Company
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#portfolio" className={classes.block}>
                Portfolio
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#blog" className={classes.block}>
                Blog
              </a>
            </ListItem>
          </List>
        </div> */}
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            Gollum Enterprises Private Limited &nbsp;
            <a href="https://scaleops.ai" className={classes.a}>
              ScaleOps.AI
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

// export default withStyles(footerStyle)(Footer);
export default Footer;