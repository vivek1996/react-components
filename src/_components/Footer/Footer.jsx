import React from "react";
import PropTypes from "prop-types";
// import { withStyles } from '@material-ui/core';

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            Xponent Tech Solutions Private Limited &nbsp;
            <a href="https://xponenttech.com" className={classes.a}>
              Xponent Tech Solutions
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