import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  paper: {
    maxWidth: 360,
    overflow: "auto",
  },
  popper: {
    zIndex: 1400,
    minWidth: "240px",
    maxWidth: "360px",
    maxHeight: "360px",
  },
  header: {
    alignItems: "center",
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    height: "56px",
    borderRadius: "3px 3px 0 0",
    boxSizing: "border-box",
    fontWeight: 500,
    justifyContent: "space-between",
    padding: "0 8px 0 16px",
  },
  content: {
    maxHeight: "400px",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(),
    color: "rgba(255, 255, 255)",
  },
  title: {
    color: "rgba(255, 255, 255)",
  },
});

const EnhancedPopper = (props) => {
  const {
    open,
    classes,
    onClose,
    anchorEl,
    value,
    type,
    title,
    text,
    content,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const handleCancel = () => {
    if (value) {
      onClose(value);
    } else {
      onClose("cancel");
    }
  };

  const handleOk = () => {
    if (value) {
      onClose(value);
    } else {
      onClose("ok");
    }
  };

  const renderActions = () => {
    switch (type) {
      case "confirm": {
        return (
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleOk} color="primary">
              Ok
            </Button>
          </DialogActions>
        );
      }
      case "alert": {
        return (
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        );
      }
      default: {
        return;
      }
    }
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      disablePortal={true}
      className={classes.popper}
      modifiers={{
        flip: {
          enabled: true,
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: "scrollParent",
        },
      }}
    >
      <Paper className={classes.paper}>
        {title ? (
          <DialogTitle
            id="dialog-title"
            className={classes.header}
            disableTypography={true}
          >
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
            {onClose ? (
              <IconButton
                aria-label="Close"
                className={classes.closeButton}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </DialogTitle>
        ) : (
          ""
        )}
        <DialogContent className={classes.content}>
          {text ? <DialogContentText>{text}</DialogContentText> : ""}
          {content ? content : ""}
        </DialogContent>
        {type ? renderActions() : ""}
      </Paper>
    </Popper>
  );
};

EnhancedPopper.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedPopper);
