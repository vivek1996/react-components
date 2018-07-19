import React from "react";
import { connect } from 'react-redux';

import {
  Edit,
} from "@material-ui/icons";

import { Table, ConfirmationDialog, AlertDialog, FormDialog } from "_components";
import { settingService } from '../../_services';

const settingCreateFormFields = {
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

const settingUpdateFormFields = {
  fields: [
    { name: 'value', type: 'text', label: 'Name', placeholder: 'User Name', required: true }
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

const columnData = [
  { id: 'name', disablePadding: false, label: 'Name', type: 'string' },
  { id: 'value', disablePadding: true, label: 'Value', type: 'string' },
  { id: 'description', disablePadding: false, label: 'Description', type: 'string' },
  { id: 'statusFlag', disablePadding: false, label: 'Status', type: 'flag' },
  { 
    id: 'actions', disablePadding: false, label: 'Actions', type: 'button', buttons: [
      // {
      //   label: 'Change Status',
      //   param: 'id',
      //   field: 'activeFlag',
      //   getIcon: (value) => { return (value) ? Done : Clear},
      //   action: (event, user) => {
      //     event.props.openDialog(user);
      //   }
      // },
      {
        label: 'Edit',
        icon: Edit,
        action: (event, setting) => {
          event.props.openUpdateFormDialog(setting);
        }
      }
    ] 
  }
];

const tableActions = [
  // {
  //   icon: 'Add',
  //   title: 'Add',
  //   placement: 'top',
  //   color: 'primary',
  //   action: (event) => {
  //     console.log("event", event);
  //     event.props.openCreateFormDialog({});
  //   }
  // },
];

class Setting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Settings",
      setting: {},
      orderBy: 'name',
      data: [],
      dialogOpen: false,
      alertOpen: false,
      alertText: "",
      alertTitle: "Alert Message",
      createFormDialogOpen: false,
      updateFormDialogOpen: false
    };
  }

  componentDidMount = () => {
    this.refreshData();
  }

  componentWillUnmount = () => {}

  refreshData = () => {
    settingService.getAll().then(settings => {
      this.setState({
        data: settings.sort((a, b) => (a.statusFlag < b.statusFlag ? -1 : 1))
      });
    });
  }

  changeStatus = (setting) => {
    if(setting.activeFlag) {
      settingService.inactive(setting.id)
      .then(
          response => {
            this.refreshData();
          },
          error => {
            console.log("Inactive Error", error);
          }
      );
    } else {
      settingService.active(setting.id).then(
        response => {
          this.refreshData();
        },
        error => {
          console.log("Active Error", error);
        }
      );
    }
  };

  openDialog = (setting) => {
    this.setState({ dialogOpen: true, setting: setting });
  };

  closeDialog = value => {
    this.setState({ dialogOpen: false });

    if(value === "ok") {
      this.changeStatus(this.state.setting);
    }
  };

  openAlert = (alertText) => {
    this.setState({ alertOpen: true, alertText: alertText });
  };

  closeAlert = value => {
    this.setState({ alertOpen: false });
  };

  openCreateFormDialog = (setting) => {
    this.setState({ createFormDialogOpen: true, setting: setting });
  };

  closeCreateFormDialog = () => {
    this.setState({ createFormDialogOpen: false });
  };

  create = (settingData) => {
    settingService.create(settingData).then(
      setting => {
        console.log("Setting Create Response", setting);
        this.closeCreateFormDialog();
        this.refreshData();
      },
      error => {
        console.log("Setting Create Error", error);
        this.closeCreateFormDialog();
        this.openAlert("There is some issue with setting creation, please try again.");
      }
    );
  }

  openUpdateFormDialog = (setting) => {
    this.setState({ updateFormDialogOpen: true, setting: setting });
  };

  closeUpdateFormDialog = () => {
    this.setState({ updateFormDialogOpen: false });
  };

  update = (settingData) => {
    settingService.update(settingData).then(
      setting => {
        console.log("setting Update Response", setting);
        this.closeUpdateFormDialog();
        this.refreshData();
      },
      error => {
        console.log("setting Update Error", error);
        this.closeUpdateFormDialog();
        this.openAlert("There is some issue with setting updation, please try again.");
      }
    );
  }

  render() {
    return (
      <div>
        <Table
          columns={columnData}
          rows={this.state.data}
          orderBy={this.state.orderBy}
          title={this.state.title}
          uKey="id"
          actions={tableActions}
          refreshData={this.refreshData}
          openDialog={this.openDialog}
          openAlert={this.openAlert}
          openCreateFormDialog={this.openCreateFormDialog}
          openUpdateFormDialog={this.openUpdateFormDialog}
        />
        
        <ConfirmationDialog
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          value={this.state.value}
          title="Are you sure, you want to reset status of setting."
        />

        <AlertDialog
          open={this.state.alertOpen}
          onClose={this.closeAlert}
          text={this.state.alertText}
          title={this.state.alertTitle}
        />

        <FormDialog 
          title="Create Setting"
          open={this.state.createFormDialogOpen}
          onClose={this.closeCreateFormDialog}
          data={this.state.setting}
          submitAction={this.create}
          formFields={settingCreateFormFields}
        />

        <FormDialog 
          title="Update Setting"
          open={this.state.updateFormDialogOpen}
          onClose={this.closeUpdateFormDialog}
          data={this.state.setting}
          submitAction={this.update}
          formFields={settingUpdateFormFields}
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

const connectedSetting = connect(mapStateToProps)(Setting);

export { connectedSetting as Setting };