import React from "react";
import { connect } from 'react-redux';

import { Table } from "_components";
import { userService } from '../../_services';

const columnData = [
  { id: 'amount', disablePadding: false, label: 'Credit', type: 'number' },
  { id: 'statusFlag', disablePadding: false, label: 'Status', type: 'flag' },
  { id: 'createdAt', disablePadding: false, label: 'Created', type: 'datetime' },
  { id: 'updatedAt', disablePadding: false, label: 'Updated', type: 'datetime' },
];

class UserPaymentRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderBy: 'createdAt',
      data: [],
      title: 'Payment Requests',
      key: 'id'
    };
  }

  componentDidMount() {
    userService.getPaymentRequests(this.props.match.params.id).then(paymentRequests => {
      this.setState({
        data: paymentRequests.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      });
    });
  }

  componentWillUnmount() {
    
  }

  render() {
    return (
        <Table
          columns={columnData}
          rows={this.state.data}
          orderBy={this.state.orderBy}
          title={this.state.title}
          uKey={this.state.key}
        />
    );
  }
}

// UserPaymentRequest.propTypes = {
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

const connectedUserPaymentRequestPage = connect(mapStateToProps)(UserPaymentRequest);

export { connectedUserPaymentRequestPage as UserPaymentRequest };