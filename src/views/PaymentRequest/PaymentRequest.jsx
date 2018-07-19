import React from "react";
import { connect } from 'react-redux';

import {
  Edit,
} from "@material-ui/icons";

import { Table, AlertDialog, FormDialog } from "_components";
import { paymentRequestService } from '../../_services';

const columnData = [
  { id: 'user.name', disablePadding: false, label: 'Name', type: 'string' },
  { id: 'user.username', disablePadding: false, label: 'Mobile', type: 'string' },
  { id: 'amount', disablePadding: false, label: 'Amount', type: 'number' },
  { id: 'user.activeFlag', disablePadding: false, label: 'User Status', type: 'boolean' },
  { id: 'createdAt', disablePadding: false, label: 'Request Time', type: 'datetime' },
  { id: 'statusFlag', disablePadding: false, label: 'Request Status', type: 'flag' },
  { id: 'actions', disablePadding: false, label: 'Actions', type: 'button', buttons: [
    {
      label: 'Edit',
      icon: Edit,
      action: (event, paymentRequest) => {
        event.props.openUpdateFormDialog(paymentRequest);
      }
    }
  ] }
];

const paymentRequestUpdateFormFields = {
  fields: [{ 
    name: 'statusFlag', type: 'radio', label: 'Status', placeholder: 'Status', required: true, options: [
      {
        value: 'A',
        label: 'Approved'
      },
      {
        value: 'P',
        label: 'Pending'
      },
      {
        value: 'T',
        label: 'Transferred'
      }
    ]
  }],
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

class PaymentRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderBy: 'name',
      data: [],
      title: 'Payment Requests',
      key: 'id',
      updateFormDialogOpen: false,
      alertOpen: false,
      alertText: "",
      paymentRequest: {}
    };
  }

  componentDidMount() {
    paymentRequestService.getAll().then(paymentRequests => {
      this.setState({
        data: paymentRequests.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      });
    });
  }

  componentWillUnmount() {
    
  }

  refreshData = () => {
    paymentRequestService.getAll().then(paymentRequests => {
      this.setState({
        data: paymentRequests.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      });
    });
  }

  openAlert = (alertText) => {
    this.setState({ alertOpen: true, alertText: alertText });
  };

  closeAlert = value => {
    this.setState({ alertOpen: false });
  };

  openUpdateFormDialog = (paymentRequest) => {
    this.setState({ updateFormDialogOpen: true, paymentRequest: paymentRequest });
  };

  closeUpdateFormDialog = () => {
    this.setState({ updateFormDialogOpen: false });
  };

  update = (paymentRequestData) => {
    paymentRequestService.update(paymentRequestData).then(
      paymentRequest => {
        console.log("Paymnet Request Update Response", paymentRequest);
        this.closeUpdateFormDialog();
        this.refreshData();
      },
      error => {
        console.log("Paymnet Request Update Error", error);
        this.closeUpdateFormDialog();
        this.openAlert("There is some issue with user updation, please try again.");
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
          uKey={this.state.key}
          openUpdateFormDialog={this.openUpdateFormDialog}
          refreshData={this.refreshData}
          openAlert={this.openAlert}
        />

        <AlertDialog
          open={this.state.alertOpen}
          onClose={this.closeAlert}
          text={this.state.alertText}
          title={this.state.alertTitle}
        />

        <FormDialog 
          title="Update Payment Request"
          open={this.state.updateFormDialogOpen}
          onClose={this.closeUpdateFormDialog}
          data={this.state.paymentRequest}
          submitAction={this.update}
          formFields={paymentRequestUpdateFormFields}
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

const connectedPaymentRequest = connect(mapStateToProps)(PaymentRequest);

export { connectedPaymentRequest as PaymentRequest };