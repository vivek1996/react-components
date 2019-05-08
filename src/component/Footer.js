import React from "react";
import PropTypes from "prop-types";

function Footer({ ...props }) {
  const { classes, company, website, trademark } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            {company} &nbsp;
            <a href={website} className={classes.a}>
              {trademark}
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

export default Footer;