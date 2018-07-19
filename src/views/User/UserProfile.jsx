import React from "react";
import moment from "moment";
import { connect } from 'react-redux';

import { Grid, withStyles } from '@material-ui/core';
import {
  Dialog,
  Accordion,
  SimpleCard,
  ProfileCard,
  Table,
  Form
} from "_components";

import {
  Edit,
  Restore,
  Done,
  Clear,
} from "@material-ui/icons";

import { userService, reportService } from '../../_services';

const profileActions = [
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
  },
  item: {
    width: 'inherit'
  }
});

let accordionData = [
  {
    key: "GOLD_TASK_COUNT",
    title: "Gold Task",
    description: (user, analytics) => {
      return `${user.name} has ${analytics.GOLD_TASK_COUNT} gold tasks`;
    },
    content: (user, meta) => {
      let goldTaskColumnData = [
        { id: 'SCALEOPS_TASK_ID', disablePadding: false, label: 'SO Task Id', type: 'string' },
        { id: 'COMPLETION_TIME', disablePadding: false, label: 'Completion Time', type: 'string' },
        { id: 'TASK_PK', disablePadding: false, label: 'Task PK', type: 'string' },
        { id: 'AMOUNT_STATUS', disablePadding: false, label: 'Amount Status', type: 'string' },
        { id: 'DESC_STATUS', disablePadding: false, label: 'Desc Status', type: 'string' },
        { id: 'DATE_STATUS', disablePadding: false, label: 'Date Status', type: 'string' },
      ];
      return new Promise(
        function (resolve, reject) {
            if(user && user.id) {
              reportService.goldTask(user.id).then(goldTasks => {
                resolve( <Table
                  columns={goldTaskColumnData}
                  rows={goldTasks}
                  orderBy="SCALEOPS_TASK_ID"
                  title={meta.title}
                  uKey="SCALEOPS_TASK_ID"
                />);
              });
            } else {
              reject("No Data Available!");
            }
        }
      );
    }
  },
  {
    key: "UNMODIFIED_COUNT",
    title: "Unmodified Task",
    description: (user, analytics) => {
      return `${user.name} has ${analytics.UNMODIFIED_COUNT} unmodified tasks`;
    },
    content: (user, meta) => {
      let unmodifiedTaskColumnData = [
        { id: 'SCALEOPS_TASK_ID', disablePadding: false, label: 'SO Task Id', type: 'string' },
        { id: 'TASK_ID', disablePadding: true, label: 'Ocrolus Task Id', type: 'string' },
        { id: 'COMPLETION_TIME', disablePadding: false, label: 'Completion Time', type: 'string' },
        { id: 'TASK_PK', disablePadding: false, label: 'Task PK', type: 'string' },
      ];
      return new Promise(
        function (resolve, reject) {
            if(user && user.id) {
              reportService.unmodifiedTask(user.id).then(unmodifiedTasks => {
                resolve( <Table
                  columns={unmodifiedTaskColumnData}
                  rows={unmodifiedTasks}
                  orderBy="SCALEOPS_TASK_ID"
                  title={meta.title}
                  uKey="SCALEOPS_TASK_ID"
                />);
              });
            } else {
              reject("No Data Available!");
            }
        }
      );
    }
  },
  {
    key: "MODIFIED_COUNT",
    title: "Modified Task",
    description: (user, analytics) => {
      return `${user.name} has ${analytics.MODIFIED_COUNT} modified tasks`;
    },
    content: (user, meta) => {
      let modifiedTaskColumnData = [
        { id: 'SCALEOPS_TASK_ID', disablePadding: false, label: 'SO Task Id', type: 'string' },
        { id: 'TASK_ID', disablePadding: true, label: 'Ocrolus Task Id', type: 'string' },
        { id: 'COMPLETION_TIME', disablePadding: false, label: 'Completion Time', type: 'string' },
        { id: 'TASK_PK', disablePadding: false, label: 'Task PK', type: 'string' },
      ];
      return new Promise(
        function (resolve, reject) {
            if(user && user.id) {
              reportService.modifiedTask(user.id).then(modifiedTasks => {
                resolve( <Table
                  columns={modifiedTaskColumnData}
                  rows={modifiedTasks}
                  orderBy="SCALEOPS_TASK_ID"
                  title={meta.title}
                  uKey="SCALEOPS_TASK_ID"
                />);
              });
            } else {
              reject("No Data Available!");
            }
        }
      );
    }
  },
  {
    key: "UNREADABLE_COUNT",
    title: "Unreadable Task",
    description: (user, analytics) => {
      return `${user.name} has ${analytics.UNREADABLE_COUNT} unreadable tasks`;
    },
    content: (user, meta) => {
      let unreadableTaskColumnData = [
        { id: 'SCALEOPS_TASK_ID', disablePadding: false, label: 'SO Task Id', type: 'string' },
        { id: 'TASK_ID', disablePadding: true, label: 'Ocrolus Task Id', type: 'string' },
        { id: 'COMPLETION_TIME', disablePadding: false, label: 'Completion Time', type: 'string' },
        { id: 'TASK_PK', disablePadding: false, label: 'Task PK', type: 'string' },
      ];
      return new Promise(
        function (resolve, reject) {
            if(user && user.id) {
              reportService.unreadableTask(user.id).then(unreadableTasks => {
                resolve( <Table
                  columns={unreadableTaskColumnData}
                  rows={unreadableTasks}
                  orderBy="SCALEOPS_TASK_ID"
                  title={meta.title}
                  uKey="SCALEOPS_TASK_ID"
                />);
              });
            } else {
              reject("No Data Available!");
            }
        }
      );
    }
  },
  {
    key: "TRANSACTION_COUNT",
    title: "Transactions",
    description: (user, analytics) => {
      return `${user.name} has ${analytics.TRANSACTION_COUNT} transactions`;
    },
    content: (user, meta) => {
      let transactionColumnData = [
        { id: 'credit', disablePadding: false, label: 'Credit', type: 'string' },
        { id: 'debit', disablePadding: true, label: 'Debit', type: 'string' },
        { id: 'statusFlag', disablePadding: false, label: 'Status', type: 'flag' },
        { id: 'createdAt', disablePadding: false, label: 'Created', type: 'datetime' },
      ];
      return new Promise(
        function (resolve, reject) {
            if(user && user.id) {
              userService.getTransactions(user.id).then(transactions => {
                resolve( <Table
                  columns={transactionColumnData}
                  rows={transactions}
                  orderBy="createdAt"
                  title={meta.title}
                  uKey="id"
                />);
              });
            } else {
              reject("No Data Available!");
            }
        }
      );
    }
  },
  {
    key: "PAYMENT_REQUEST_COUNT",
    title: "Payment Requests",
    description: (user, analytics) => {
      return `${user.name} has ${analytics.PAYMENT_REQUEST_COUNT} payment requests`;
    },
    content: (user, meta) => {
      let paymentRequestColumnData = [
        { id: 'amount', disablePadding: false, label: 'Amount', type: 'number' },
        { id: 'statusFlag', disablePadding: false, label: 'Status', type: 'flag' },
        { id: 'createdAt', disablePadding: false, label: 'Created', type: 'datetime' },
        { id: 'updatedAt', disablePadding: false, label: 'Updated', type: 'datetime' },
      ];
      return new Promise(
        function (resolve, reject) {
            if(user && user.id) {
              userService.getPaymentRequests(user.id).then(paymentRequests => {
                resolve( <Table
                  columns={paymentRequestColumnData}
                  rows={paymentRequests}
                  orderBy="createdAt"
                  title={meta.title}
                  uKey="id"
                />);
              });
            } else {
              reject("No Data Available!");
            }
        }
      );
    }
  }
];

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      analytics: {},
      orderBy: 'createdAt',
      data: [],
      title: 'Transactions',
      key: 'id',
      alertOpen: false,
      alertText: "",
      alertTitle: "Alert Message",
      dialogOpen: false,
      updateFormDialogOpen: false,
      resetPasswordFormDialogOpen: false,
      accordionData: accordionData,
      accordionExpanded: null,
      accordionContent: ""
    };
  }

  componentDidMount = () => {
    this.refreshData();
  }

  refreshData = () => {
    userService.getById(this.props.match.params.id).then(user => {
      reportService.userAnalytics(this.props.match.params.id).then(analytics => {

        accordionData = accordionData.map(elem => {
          if(Object.keys(analytics).length && analytics[elem.key]) {
            elem.description = elem.description(user, analytics);
            return elem;
          } else {
            return "";
          }
        });

        this.setState({user: user, analytics: analytics, accordionData: accordionData});
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

  openUpdateFormDialog = () => {
    this.setState({ updateFormDialogOpen: true });
  };

  closeUpdateFormDialog = () => {
    this.setState({ updateFormDialogOpen: false });
  };

  update = (userData) => {
    userService.update(userData).then(
      user => {
        this.closeUpdateFormDialog();
        this.refreshData();
      },
      error => {
        this.closeUpdateFormDialog();
        this.openAlert("There is some issue with user updation, please try again.");
      }
    );
  }

  openResetPasswordFormDialog = () => {
    this.setState({ resetPasswordFormDialogOpen: true });
  };

  closeResetPasswordFormDialog = () => {
    this.setState({ resetPasswordFormDialogOpen: false });
  };

  resetPassword = (userData) => {
    userService.resetPassword(userData).then(
      user => {
        this.closeResetPasswordFormDialog();
        this.refreshData();
      },
      error => {
        this.closeResetPasswordFormDialog();
        this.openAlert("There is some issue with user updation, please try again.");
      }
    );
  }

  handleChange = (panel, elem) => (event, expanded) => {
    this.setState({accordionExpanded: expanded ? panel : false});
    if(typeof elem.content === "function") {
      elem.content(this.state.user, elem).then(response => {
        this.setState({accordionContent: response});
      }).catch(error => {
        this.setState({accordionContent: error});
      });
    } else {
      this.setState({
        accordionContent: elem.content
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { user, analytics } = this.state;
    
    return (
      <div>
        <Grid container className={classes.root}>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Grid container className={classes.stats} justify="flex-start" >
              <Grid item>
                {/* <Paper className={classes.paper} /> */}

                <ProfileCard
                  data={user}
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
            <Grid container className={classes.stats} justify="flex-start">
              <Grid item>
                <SimpleCard
                  title="Earned"
                  description={analytics.EARNED ? analytics.EARNED : 0}
                />
              </Grid>

              <Grid item>
                {/* <Paper className={classes.paper} /> */}
                <SimpleCard
                  title="Paid"
                  description={analytics.PAID ? analytics.PAID : 0}
                />
              </Grid>

              <Grid item>
                {/* <Paper className={classes.paper} /> */}
                <SimpleCard
                  title="Balance"
                  description={analytics.BALANCE ? analytics.BALANCE : 0}
                />
              </Grid>
              
              <Grid item>
                {/* <Paper className={classes.paper} /> */}
                <SimpleCard
                  title="Completed Tasks"
                  description={analytics.COMPLETED_COUNT ? analytics.COMPLETED_COUNT : 0}
                />
              </Grid>
              
              <Grid item>
                {/* <Paper className={classes.paper} /> */}
                <SimpleCard
                  title="Total Time"
                  description={
                    moment.utc((analytics.TOTAL_TIME_SPENT ? analytics.TOTAL_TIME_SPENT : 0) * 1000).format('HH:mm:ss')
                  }
                />
              </Grid>

              <Grid item>
                {/* <Paper className={classes.paper} /> */}
                <SimpleCard
                  title="Average Time"
                  description={analytics.AVERAGE_TIME_SPENT ? analytics.AVERAGE_TIME_SPENT : 0}
                />
              </Grid>

              <Grid item>
                {/* <Paper className={classes.paper} /> */}
                <SimpleCard
                  title="Gold Tasks"
                  description={analytics.GOLD_TASK_COUNT ? analytics.GOLD_TASK_COUNT : 0}
                />
              </Grid>

              <Grid item>
                {/* <Paper className={classes.paper} /> */}
                <SimpleCard
                  title="Gold Score"
                  description={analytics.GOLD_TASK_SCORE ? analytics.GOLD_TASK_SCORE : 0}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.stats} justify="flex-start">
              <Grid item className={classes.item}>
                <Accordion 
                  data={this.state.accordionData}
                  handleChange={this.handleChange}
                  expanded={this.state.accordionExpanded}
                  content={this.state.accordionContent}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

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

const styledUserProfile = withStyles(styles)(UserProfile);
const connectedUserProfile = connect(mapStateToProps)(styledUserProfile);

export { connectedUserProfile as UserProfile };