import React from "react";

import {
  Table
} from "_components";

import { reportService } from '../../_services';

const columnData = [
  { id: 'USER_NAME', disablePadding: false, label: 'Name', type: 'string' },
  { id: 'USER_MOBILE', disablePadding: true, label: 'Mobile', type: 'number' },
  { id: 'EARNED', disablePadding: true, label: 'Earned', type: 'number' },
  { id: 'PAID', disablePadding: true, label: 'Paid', type: 'number' },
  { id: 'BALANCE', disablePadding: true, label: 'Balance', type: 'number' },
  { id: 'UNREADABLE_COUNT', disablePadding: true, label: 'Unreadable', type: 'number' },
  { id: 'MODIFIED_COUNT', disablePadding: true, label: 'Modified', type: 'number' },
  { id: 'UNMODIFIED_COUNT', disablePadding: true, label: 'UnModified', type: 'number' },
  { id: 'COMPLETED_COUNT', disablePadding: true, label: 'Completed', type: 'number' },
  { id: 'TOTAL_TIME_SPENT', disablePadding: true, label: 'Total Time', type: 'number' },
  { id: 'AVERAGE_TIME_SPENT', disablePadding: true, label: 'Average Time', type: 'number' },
  { id: 'GOLD_TASK_COUNT', disablePadding: true, label: 'Gold Task', type: 'number' },
  { id: 'GOLD_TASK_SCORE', disablePadding: true, label: 'Gold Score', type: 'number' }
]

class Dashboard extends React.Component {
  state = {
    value: 0,
    orderBy: 'name',
    data: [],
    title: 'Earning Stats',
    key: 'USER_ID'
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  componentDidMount() {
    reportService.userAnalytics().then(analytics => {
      this.setState({
        data: analytics.sort((a, b) => (a.BALANCE < b.BALANCE ? -1 : 1))
      });
    });
  }

  render() {
    return (
      <div>
        <Table
          columns={columnData}
          rows={this.state.data}
          orderBy={this.state.orderBy}
          tableTitle={this.state.title}
          uKey={this.state.key}
          clickLink={"/user/"}
        />
      </div>
    );
  }
}

export default Dashboard;