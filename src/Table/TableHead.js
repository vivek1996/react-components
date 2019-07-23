import React from "react";
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

const tableHeadStyles = theme => ({
  head: {
    background: '#f5f5f5',
  },
  tableCell: {
    padding: '4px 8px 4px 8px'
  }
});

const tableHeadOptions = {
  order: "asc",
  orderBy: "id",
  rowCount: 0,
  numSelected: 0,
  columns: []
}

class EnhancedTableHead extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(tableHeadOptions, props);
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render = () => {
      const {columns, classes, numSelected, rowCount, onSelectAllClick, selectable} = this.props;
      
      let headerRequired = columns.find(column => {
        return column.label;
      });
      
      return (headerRequired) ? (
        <TableHead className={classes.head}>
          <TableRow>
            {columns.map(column => {
              return (
                (selectable && column.type === "select") ?
                (
                  <TableCell 
                    padding="checkbox"
                    classes={{
                      root: classes.tableCell
                    }}
                  >
                    <Checkbox 
                      indeterminate={numSelected > 0 && numSelected < rowCount} 
                      checked={numSelected === rowCount} 
                      onChange={onSelectAllClick}
                    />
                  </TableCell>
                ) : (
                  (column.show === undefined || column.show) ? (
                    <TableCell
                      key={`${(new Date()).getTime()}-table-head-${column.name}`}
                      padding={column.disablePadding ? 'none' : 'default'}
                      sortDirection={this.props.orderBy === column.name ? this.props.order : false}
                      classes={{
                        root: classes.tableCell
                      }}
                    >
                      {
                        (column.sort) ? (
                          <Tooltip
                            title="Sort"
                            placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                            enterDelay={300}
                          >
                            <TableSortLabel
                                active={this.props.orderBy === column.name}
                                direction={this.props.order}
                                onClick={this.createSortHandler(column.name)}
                            >
                                {column.label}
                            </TableSortLabel>
                          </Tooltip>
                        ) : column.label
                      }
                    </TableCell>
                  ) : null
                )
              );
            }, this)}
          </TableRow>
        </TableHead>
      ) : null;
  }
}

EnhancedTableHead.defaultProps = {
  order: 'desc',
  rowCount: 0,
  selectable: false
};

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  // orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(tableHeadStyles)(EnhancedTableHead);