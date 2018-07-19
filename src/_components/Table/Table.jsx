import React from "react";
import moment from "moment";
import { Link } from 'react-router-dom'

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Checkbox, IconButton, Tooltip, Grid, Paper } from '@material-ui/core';

import {Delete, FilterList, Add, Done, Clear, Payment } from '@material-ui/icons';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import { history } from '../../_helpers';

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

  render() {
      return (
        <TableHead>
          <TableRow>
            {this.props.columns.map(column => {
              return (
                (column.id === "selectable") ?
                (<TableCell padding="checkbox"><Checkbox indeterminate={this.props.numSelected > 0 && this.props.numSelected < this.props.rowCount} checked={this.props.numSelected === this.props.rowCount} onChange={this.props.onSelectAllClick}/></TableCell>) :
                (<TableCell
                    key={column.id}
                    padding={column.disablePadding ? 'none' : 'default'}
                    sortDirection={this.props.orderBy === column.id ? this.props.order : false}
                >
                    <Tooltip
                        title="Sort"
                        placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                        enterDelay={300}
                    >
                    <TableSortLabel
                        active={this.props.orderBy === column.id}
                        direction={this.props.order}
                        onClick={this.createSortHandler(column.id)}
                    >
                        {column.label}
                    </TableSortLabel>
                    </Tooltip>
                </TableCell>
              ));
            }, this)}
          </TableRow>
        </TableHead>
      );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    // paddingRight: theme.spacing.unit,
    // paddingLeft: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  fab: {
    margin: theme.spacing.unit * 2,
  },
});

const toolbarOptions = {
  title: "Table",
  selectable: false,
  actions: []
}

class EnhancedTableToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(toolbarOptions, props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ 
      title: nextProps.title,
      actions: nextProps.actions
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: this.state.numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {this.state.selectable ? (this.state.numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              {this.state.numSelected} selected
            </Typography>
          ) : (
            <Typography variant="title" id="tableTitle">
              {this.state.title}
            </Typography>
          )) : (<Typography variant="title" id="tableTitle">
              {this.state.title}
            </Typography>)}
        </div>
        <div className={classes.spacer} />
        {/* <div className={classes.actions}> */}
        <Grid item sm={3} xs={3} className={classes.actions}>
          {(this.state.selectable && this.state.numSelected > 0 ? (
            <Tooltip title="Delete" placement="top-end">
              <IconButton aria-label="Delete">
                <Delete />
              </IconButton>
            </Tooltip>
          ) : (
            (this.state.actions) ?
            this.state.actions.map(action => {
                let icon;
                switch(action.icon) {
                  case 'Add':
                    icon = <Add />;
                    break;
                  case 'FilterList':
                    icon = <FilterList />;
                    break;
                  default:
                    icon = <Add />;
                    break;
                }

                let actionBtn;
                if(action.action) {
                  actionBtn = <IconButton aria-label={action.title} variant="fab" className={classes.fab} color={action.color} onClick={() => action.action(this)}>
                    {icon}
                  </IconButton>;
                } else {
                  actionBtn = <IconButton aria-label={action.title} variant="fab" className={classes.fab} color={action.color} to={action.href} component={Link}>
                    {icon}
                  </IconButton>
                }
                
                return (
                <Tooltip title={action.title} placement={action.placement} key={action.title}>
                  {actionBtn}
                </Tooltip>);
              })
            : ''
          ))}
        {/* </div> */}
        </Grid>
      </Toolbar>
    );
  }
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 1020,
  },
  paper: {
    width: '100%',
    minWidth: 'auto',
    marginTop: theme.spacing.unit * 6,
    display: 'grid',
    flexDirection: 'column',
    overflow: 'visible',
  }
});

const tableOptions = {
  order: 'asc',
  orderBy: 'id',
  selected: [],
  data: [],
  page: 0,
  rowsPerPage: 5,
  selectable: false,
  actions: []
}

class EnhancedTable extends React.Component {
  selectedRows = [];
  constructor(props) {
    super(props);

    this.state = Object.assign(tableOptions, props);
  }

  componentDidMount = () => {}

  componentWillReceiveProps(nextProps) {
    this.setState({ 
      rows: nextProps.rows, 
      columns: nextProps.columns, 
      title: nextProps.title, 
      orderBy: nextProps.orderBy, 
      uKey: nextProps.uKey 
    });
  }

  componentWillUnmount = () => {}

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
        order = 'asc';
    }

    const data = order === 'desc'
        ? this.state.rows.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.rows.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
    this.setState({ selected: this.state.rows.map(n => n[this.props.uKey]) });
    return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    event.preventDefault();

    if(event.target.tagName === "TD" && this.props.clickLink) {
      history.push(this.props.clickLink + id);
    }
    
    // if(this.state.selectable) {
    //   const { selected } = this.state;
    //   const selectedIndex = selected.indexOf(id);
    //   let newSelected = [];

    //   if (selectedIndex === -1) {
    //     newSelected = newSelected.concat(selected, id);
    //   } else if (selectedIndex === 0) {
    //     newSelected = newSelected.concat(selected.slice(1));
    //   } else if (selectedIndex === selected.length - 1) {
    //     newSelected = newSelected.concat(selected.slice(0, -1));
    //   } else if (selectedIndex > 0) {
    //     newSelected = newSelected.concat(
    //       selected.slice(0, selectedIndex),
    //       selected.slice(selectedIndex + 1),
    //     );
    //   }
      
    //   this.setState({ selected: newSelected });
    // }
  };

  handleChangePage = (event, page) => {
    this.setState({ page: page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => {
    if(this.state.selectable) {
      return this.state.selected.indexOf(id) !== -1;
    } else {
      return false;
    }
  }

  refreshData = () => {
    this.props.refreshData();
  }

  render() {
    const { ...other } = this.props;

    const { columns, rows } = this.state;
    const { classes, order, orderBy, selected, rowsPerPage, page, uKey, selectable } = this.state;
    const { handleSelectAllClick, handleRequestSort } = this.state;

    if(selected !== undefined) {
      this.selectedRows = selected;
    }

    if(handleSelectAllClick !== undefined) {
      this.handleSelectAllClick = handleSelectAllClick;
    }

    if(handleRequestSort !== undefined) {
      this.onRequestSort = handleRequestSort;
    }
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    
    return (
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={this.selectedRows.length} {...other} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle" key={Date.now()}>
            <EnhancedTableHead
              selectable={selectable}
              columns={columns}
              numSelected={this.selectedRows.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
              const isSelected = this.isSelected(n[uKey]);
              return (
              <TableRow
                hover
                onClick={event => this.handleClick(event, n[uKey])}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
                key={n[uKey]}
                selected={isSelected}
              >
              {columns.map(column => {
                let cellData = n;

                let nestedData = column.id.split('.');
                nestedData.map(nestedColumn => {
                  cellData = cellData[nestedColumn];
                  return "";
                });

                switch(column.type) {
                  case 'boolean':
                    cellData = cellData ? "Active" : "Inactive";
                    break;
                  case 'datetime':
                    cellData = moment(cellData).format('MMMM Do YYYY, h:mm:ss a');
                    break;
                  case 'date':
                    cellData = moment(cellData).format('MMMM Do YYYY');
                    break;
                  case 'flag':
                    switch(cellData) {
                      case 'A':
                        cellData = <Payment />;
                        break;
                      case 'P':
                        cellData =  <Clear />;
                        break;
                      case 'T':
                        cellData =  <Done />;
                        break;
                      default:
                        break;
                    }
                    break;
                  case 'button':
                    cellData = [];
                    column.buttons.map(button => {
                      let buttonLink = "";

                      if(button.getIcon) {
                        button['icon'] = button.getIcon(n[button.field]);
                      }

                      if(button.link) {
                        buttonLink = button.link;
                        if(button.param) {
                          buttonLink = buttonLink + n[button.param];
                        }

                        cellData.push(<IconButton aria-label={button.label} to={buttonLink} component={Link} >
                          <button.icon />
                        </IconButton>);
                      }

                      if(button.action) {
                        cellData.push(<IconButton aria-label={button.label} onClick={() => button.action(this, n)} >
                          <button.icon />
                        </IconButton>);
                      }

                      return "";
                    });
                    break;
                  default:
                    break;
                }

                return (
                  (column.id === "selectable") ? (<TableCell padding="checkbox" key={column.id}>
                  <Checkbox checked={isSelected} />
                </TableCell>) : (<TableCell key={column.id}>{cellData}</TableCell>));
              })}
              </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
              <TableCell colSpan={6} />
              </TableRow>
            )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);