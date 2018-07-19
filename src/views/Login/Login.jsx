import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles, Grid, Paper } from '@material-ui/core';

import { Form } from "_components";
import { userActions } from '../../_actions';

const loginForm = {
  fields: [
    { name: 'username', type: 'text', label: 'Username', placeholder: 'User Name', required: true },
    { name: 'password', type: 'password', label: 'Password', placeholder: 'Password', required: true },
  ],
  buttons: [
    { type: 'submit', label: 'Login' }
  ]
};

const styles = theme => ({
  paper: {
    width: '100%',
    minWidth: 'auto',
    marginTop: theme.spacing.unit * 6,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(userActions.logout());

    this.state = {
      username: '',
      password: '',
      submitted: false,
      showPassword: false,
    };
  }

  handleSubmit = (formData) => {
    this.setState({ submitted: true });
    const { username, password } = formData;
    const { dispatch } = this.props;
    if (username && password) {
        dispatch(userActions.login(username, password));
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="center">
        <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
          <Paper className={classes.paper}>
            <Form 
            title="Sign In To Admin Dashboard"
              fields={loginForm.fields}
              buttons={loginForm.buttons}
              data={[]}
              submitAction={this.handleSubmit}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  return {
      loggingIn
  };
}

// export default withStyles(styles)(Login);
// export default connect(mapStateToProps)(Login);

const styledLogin = withStyles(styles)(Login);
// const connectedLogin = connect(mapStateToProps)(styledLogin);

// export { connectedLogin as Login };
export default connect(mapStateToProps)(styledLogin);