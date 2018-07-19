import React from "react";
import { connect } from 'react-redux';

import { Grid, withStyles
} from '@material-ui/core';
import {
  Table,
  AlertDialog, 
  FormDialog,
  ProfileCard
} from "_components";

import {
  Edit,
  Restore,
} from "@material-ui/icons";

import { userService } from '../../_services';

const profileActions = [
  {
    label: 'Reset Password',
    icon: Restore,
    action: (event) => {
      event.props.openResetPasswordFormDialog();
    }
  },
  {
    label: 'Edit',
    icon: Edit,
    action: (event, user) => {
      event.props.openUpdateFormDialog(user);
    }
  },
];

const userUpdateFormFields = {
  fields: [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'User Name', required: true },
    { name: 'username', type: 'text', label: 'Username', placeholder: 'User Name', required: true, disabled: true },
    { name: 'email', type: 'text', label: 'Email', placeholder: 'User Name', required: true, disabled: true },
    { name: 'activeFlag', type: 'boolean', label: 'Status', placeholder: 'Active', required: true }
  ],
  buttons: [
    { type: 'submit', label: 'Update' },
    { type: 'button',
      label: 'Cancel',
      action: (event) => {
        event.props.onClose();
      }
    }
  ]
};

const resetPasswordFormFields = {
  fields: [
    { name: 'newPassword', type: 'text', label: 'New Password', placeholder: 'New Password', required: true },
  ],
  buttons: [
    { type: 'submit', label: 'Reset Password' },
    { 
      type: 'button',
      label: 'Cancel',
      action: (event) => {
        event.props.onClose();
      }
    }
  ]
};

const columnData = [
  { id: 'credit', disablePadding: false, label: 'Credit', type: 'string' },
  { id: 'debit', disablePadding: true, label: 'Debit', type: 'string' },
  { id: 'statusFlag', disablePadding: false, label: 'Status', type: 'flag' },
  { id: 'createdAt', disablePadding: false, label: 'Created', type: 'datetime' },
];

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    minWidth: 'auto',
    marginTop: theme.spacing.unit * 6,
    display: 'flex',
    // flexDirection: 'column',
    overflow: 'visible',
  },
  stats: {
    // height: 240,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
  }
});

class UserTransaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderBy: 'createdAt',
      data: [],
      title: 'Transactions',
      key: 'id',
      user: {}
    };
  }

  componentDidMount() {
    userService.getById(this.props.match.params.id).then(user => {
      console.log("user", user);
      userService.getTransactions(this.props.match.params.id).then(transactions => {
        this.setState({
          user: user,
          data: transactions.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
        });
      });
    });
  }

  componentWillUnmount() {
    
  }

  render() {
    const { classes } = this.props;
    const { user } = this.state;

    return (
      <div>
        <Grid container className={classes.root}>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Grid container className={classes.stats} justify="center" >
              <Grid item>
                {/* <Paper className={classes.paper} /> */}

                <ProfileCard
                  subtitle={user.email}
                  title={user.name}
                  description={user.username}
                  actions={profileActions}
                  refreshData={this.refreshData}
                  openDialog={this.openDialog}
                  openAlert={this.openAlert}
                  openUpdateFormDialog={this.openUpdateFormDialog}
                  openResetPasswordFormDialog={this.openResetPasswordFormDialog}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <Table
              columns={columnData}
              rows={this.state.data}
              orderBy={this.state.orderBy}
              title={this.state.title}
              uKey={this.state.key}
            />
          </Grid>
        </Grid>

        <AlertDialog
          open={this.state.alertOpen}
          onClose={this.closeAlert}
          text={this.state.alertText}
          title={this.state.alertTitle}
        />

        <FormDialog 
          title="Update User"
          open={this.state.updateFormDialogOpen}
          onClose={this.closeUpdateFormDialog}
          data={this.state.user}
          submitAction={this.update}
          formFields={userUpdateFormFields}
        />

        <FormDialog 
          title="Reset Password"
          open={this.state.resetPasswordFormDialogOpen}
          onClose={this.closeResetPasswordFormDialog}
          data={this.state.user}
          submitAction={this.resetPassword}
          formFields={resetPasswordFormFields}
        />
      </div>
    );
  }
}

// UserTransaction.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

function mapStateToProps(state) {
  const { data, authentication } = state;
  const { user } = authentication;
  return {
      user,
      data
  };
}

const styledUserTransaction = withStyles(styles)(UserTransaction);
const connectedUserTransaction = connect(mapStateToProps)(styledUserTransaction);

export { connectedUserTransaction as UserTransaction };