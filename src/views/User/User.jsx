import React from "react";
import { connect } from 'react-redux';

import {
  Edit,
  Restore,
  Done,
  Clear,
} from "@material-ui/icons";

import { 
  Table, 
  Dialog,
  Form
} from "_components";
import { userService } from '../../_services';

const userCreateForm = {
  fields: [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'User Name', required: true },
    { name: 'username', type: 'text', label: 'Username', placeholder: 'User Name', required: true },
    { name: 'password', type: 'password', label: 'Password', placeholder: 'Password', required: true },
    { name: 'email', type: 'text', label: 'Email', placeholder: 'User Name', required: true },
    { name: 'activeFlag', type: 'boolean', label: 'Status', placeholder: 'Active', required: true },
  ],
  buttons: [
    { type: 'submit', label: 'Create' },
    { 
      type: 'button', 
      label: 'Cancel', 
      action: (event) => {
        event.props.onClose();
      }
    },
  ]
};

const userUpdateForm = {
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

const resetPasswordForm = {
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
  // { id: 'selectable' },
  { id: 'name', disablePadding: false, label: 'Name', type: 'string' },
  { id: 'username', disablePadding: true, label: 'Mobile', type: 'string' },
  { id: 'email', disablePadding: false, label: 'Email', type: 'string' },
  { id: 'emailVerified', disablePadding: false, label: 'Email Verified', type: 'boolean' },
  { id: 'activeFlag', disablePadding: false, label: 'Status', type: 'boolean' },
  { 
    id: 'actions', disablePadding: false, label: 'Actions', type: 'button', buttons: [
      {
        label: 'Change Status',
        param: 'id',
        field: 'activeFlag',
        getIcon: (value) => { return (value) ? Done : Clear},
        action: (event, user) => {
          event.props.openDialog(user);
        }
      },
      {
        label: 'Reset Password',
        icon: Restore,
        action: (event, user) => {
          event.props.openResetPasswordFormDialog(user);
        }
      },
      {
        label: 'Edit',
        icon: Edit,
        action: (event, user) => {
          event.props.openUpdateFormDialog(user);
        }
      },
      // {
      //   label: 'Transaction',
      //   icon: List,
      //   action: (event, user) => {
      //     userService.countTransactions(user.id).then(response => {
      //       if(response.count > 0) {
      //         history.push('/user/transaction/' + user.id);
      //       } else {
      //         event.props.openAlert("No Transactions found for " + user.name);
      //       }
      //     });
      //   }
      // },
      // {
      //   label: 'Payment Request',
      //   icon: CreditCard,
      //   action: (event, user) => {
      //     userService.countPaymentRequests(user.id).then(response => {
      //       if(response.count > 0) {
      //         history.push('/user/payment_request/' + user.id);
      //       } else {
      //         event.props.openAlert("No Paymnet requests found for " + user.name);
      //       }
      //     });
      //   }
      // }
    ] 
  }
];

const tableActions = [
  {
    icon: 'Add',
    title: 'Add',
    placement: 'top',
    color: 'primary',
    // href: '/user/create'
    action: (event) => {
      console.log("event", event);
      event.props.openCreateFormDialog({});
    }
  },
];

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Users",
      user: {},
      orderBy: 'name',
      data: [],
      dialogOpen: false,
      alertOpen: false,
      alertText: "",
      alertTitle: "Alert Message",
      createFormDialogOpen: false,
      updateFormDialogOpen: false,
      resetPasswordFormDialogOpen: false
    };
  }

  componentDidMount = () => {
    this.refreshData();
  }

  componentWillUnmount = () => {}

  refreshData = () => {
    userService.getAll().then(users => {
      this.setState({
        data: users.sort((a, b) => (a.activeFlag < b.activeFlag ? -1 : 1))
      });
    });
  }

  changeStatus = (user) => {
    if(user.activeFlag) {
      userService.inactive(user.id)
      .then(
          response => {
            this.refreshData();
          },
          error => {
            console.log("Inactive Error", error);
          }
      );
    } else {
      userService.active(user.id).then(
        response => {
          this.refreshData();
        },
        error => {
          console.log("Active Error", error);
        }
      );
    }
  };

  openDialog = (user) => {
    this.setState({ dialogOpen: true, user: user });
  };

  closeDialog = value => {
    this.setState({ dialogOpen: false });

    if(value === "ok") {
      this.changeStatus(this.state.user);
    }
  };

  openAlert = (alertText) => {
    this.setState({ alertOpen: true, alertText: alertText });
  };

  closeAlert = value => {
    this.setState({ alertOpen: false });
  };

  openCreateFormDialog = (user) => {
    this.setState({ createFormDialogOpen: true, user: user });
  };

  closeCreateFormDialog = () => {
    this.setState({ createFormDialogOpen: false });
  };

  create = (userData) => {
    userService.create(userData).then(
      user => {
        console.log("User Create Response", user);
        this.closeCreateFormDialog();
        this.refreshData();
      },
      error => {
        console.log("User Create Error", error);
        this.closeCreateFormDialog();
        this.openAlert("There is some issue with user creation, please try again.");
      }
    );
  }

  openUpdateFormDialog = (user) => {
    this.setState({ updateFormDialogOpen: true, user: user });
  };

  closeUpdateFormDialog = () => {
    this.setState({ updateFormDialogOpen: false });
  };

  update = (userData) => {
    userService.update(userData).then(
      user => {
        console.log("User Update Response", user);
        this.closeUpdateFormDialog();
        this.refreshData();
      },
      error => {
        console.log("User Update Error", error);
        this.closeUpdateFormDialog();
        this.openAlert("There is some issue with user updation, please try again.");
      }
    );
  }

  openResetPasswordFormDialog = (user) => {
    this.setState({ resetPasswordFormDialogOpen: true, user: user });
  };

  closeResetPasswordFormDialog = () => {
    this.setState({ resetPasswordFormDialogOpen: false });
  };

  resetPassword = (userData) => {
    userService.resetPassword(userData).then(
      user => {
        console.log("User Reset Password Response", user);
        this.closeResetPasswordFormDialog();
        this.refreshData();
      },
      error => {
        console.log("User Reset Password Error", error);
        this.closeResetPasswordFormDialog();
        this.openAlert("There is some issue with user updation, please try again.");
      }
    );
  };

  render() {
    return (
      <div>
        <Table
          columns={columnData}
          rows={this.state.data}
          orderBy={this.state.orderBy}
          title={this.state.title}
          clickLink={"/user/"}
          uKey="id"
          actions={tableActions}
          refreshData={this.refreshData}
          openDialog={this.openDialog}
          openAlert={this.openAlert}
          openCreateFormDialog={this.openCreateFormDialog}
          openUpdateFormDialog={this.openUpdateFormDialog}
          openResetPasswordFormDialog={this.openResetPasswordFormDialog}
        />
        
        {/* <ConfirmationDialog
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          value={this.state.value}
          title="Are you sure, you want to reset status of user."
        /> */}

        <Dialog 
          title="Are you sure, you want to reset status of user."
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          type="confirm"
        />

        {/* <AlertDialog
          open={this.state.alertOpen}
          onClose={this.closeAlert}
          text={this.state.alertText}
          title={this.state.alertTitle}
        /> */}

        <Dialog 
          open={this.state.alertOpen}
          onClose={this.closeAlert}
          text={this.state.alertText}
          title={this.state.alertTitle}
          type="alert"
        />

        {/* <FormDialog 
          title="Create User"
          open={this.state.createFormDialogOpen}
          onClose={this.closeCreateFormDialog}
          data={this.state.user}
          submitAction={this.create}
          formFields={userCreateFormFields}
        /> */}

        <Dialog 
          title={"Create User"}
          open={this.state.createFormDialogOpen}
          content={<Form 
            fields={userCreateForm.fields}
            buttons={userCreateForm.buttons}
            data={this.state.user}
            submitAction={this.create}
            onClose={this.closeCreateFormDialog}
          />}
        />

        {/* <FormDialog 
          title="Update User"
          open={this.state.updateFormDialogOpen}
          onClose={this.closeUpdateFormDialog}
          data={this.state.user}
          submitAction={this.update}
          formFields={userUpdateFormFields}
        /> */}

        <Dialog 
          title={"Update User"}
          open={this.state.updateFormDialogOpen}
          content={<Form 
            fields={userUpdateForm.fields}
            buttons={userUpdateForm.buttons}
            data={this.state.user}
            submitAction={this.update}
            onClose={this.closeUpdateFormDialog}
          />}
        />

        {/* <FormDialog 
          title="Reset Password"
          open={this.state.resetPasswordFormDialogOpen}
          onClose={this.closeResetPasswordFormDialog}
          data={this.state.user}
          submitAction={this.resetPassword}
          formFields={resetPasswordFormFields}
        /> */}

        <Dialog 
          title={"Reset Password"}
          open={this.state.resetPasswordFormDialogOpen}
          content={<Form 
            fields={resetPasswordForm.fields}
            buttons={resetPasswordForm.buttons}
            data={this.state.user}
            submitAction={this.resetPassword}
            onClose={this.closeResetPasswordFormDialog}
          />}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { data, authentication } = state;
  const { user } = authentication;
  return {
      user,
      data
  };
}

const connectedUser = connect(mapStateToProps)(User);

export { connectedUser as User };