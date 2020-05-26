import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";

const tableHeadStyles = () => ({
  head: {
    background: "#f5f5f5",
  },
  tableCell: {
    padding: "8px",
  },
});

const EnhancedTableHead = (props) => {
  const {
    columns,
    classes,
    numSelected,
    rowCount,
    onSelectAllClick,
    selectable,
    orderBy,
    order,
  } = props;

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  const headerRequired = columns.find((column) => {
    return column.label;
  });

  return headerRequired ? (
    <TableHead className={classes.head}>
      <TableRow>
        {columns.map((column) => {
          return selectable && column.type === "select" ? (
            <TableCell
              padding="checkbox"
              classes={{
                root: classes.tableCell,
              }}
            >
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
          ) : column.show === undefined || column.show ? (
            <TableCell
              key={`${new Date().getTime()}-table-head-${column.name}`}
              padding={column.disablePadding ? "none" : "default"}
              sortDirection={orderBy === column.name ? order : false}
              classes={{
                root: classes.tableCell,
              }}
            >
              {column.sort ? (
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.name}
                    direction={order}
                    onClick={createSortHandler(column.name)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              ) : (
                column.label
              )}
            </TableCell>
          ) : null;
        })}
      </TableRow>
    </TableHead>
  ) : null;
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

EnhancedTableHead.defaultProps = {
  order: "desc",
  rowCount: 0,
  selectable: false,
  orderBy: "id",
  numSelected: 0,
  columns: [],
  onRequestSort: () => {},
  onSelectAllClick: () => {},
};

export default withStyles(tableHeadStyles)(EnhancedTableHead);
