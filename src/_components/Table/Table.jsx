import React from "react";
import moment from "moment";
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Checkbox, IconButton, Tooltip, Paper, Chip, CircularProgress, Avatar } from '@material-ui/core';

import {Done, Clear, Payment } from '@material-ui/icons';
import LinkIcon from '@material-ui/icons/Link';

import { history, remote } from '../../_helpers';
import { Toolbar, Dialog, Filter, Card } from "../../_components";

const tableHeadStyles = theme => ({
  head: {
    background: '#f5f5f5',
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
      const {columns, classes} = this.props;
      
      return (
        <TableHead className={classes.head}>
          <TableRow>
            {columns.map(column => {
              return (
                (column.name === "selectable") ?
                (<TableCell padding="checkbox"><Checkbox indeterminate={this.props.numSelected > 0 && this.props.numSelected < this.props.rowCount} checked={this.props.numSelected === this.props.rowCount} onChange={this.props.onSelectAllClick}/></TableCell>) :
                (<TableCell
                    key={column.name}
                    padding={column.disablePadding ? 'none' : 'default'}
                    sortDirection={this.props.orderBy === column.name ? this.props.order : false}
                >
                  {(column.sort) ? (
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
  classes: PropTypes.object.isRequired,
};

EnhancedTableHead = withStyles(tableHeadStyles)(EnhancedTableHead);

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
  },
  chip: {
    margin: theme.spacing.unit,
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    zIndex: 10000
  },
});

const tableOptions = {
  order: 'asc',
  orderBy: 'id',
  selected: [],
  data: [],
  page: 0,
  rowsPerPage: 5,
  selectable: false,
  actions: [],
  dialogOpen: false,
  dialog: {},
  loading: false
}

class EnhancedTable extends React.Component {
  selectedRows = [];
  constructor(props) {
    super(props);

    this.state = Object.assign(tableOptions, props);
  }

  componentDidMount = () => {
    this.loadData();
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ 
      rows: nextProps.rows, 
      columns: nextProps.columns, 
      title: nextProps.title, 
      orderBy: nextProps.orderBy, 
      uKey: nextProps.uKey 
    });
  }

  componentWillUnmount = () => {}

  loadData = (filterOptions) => {
    this.setState({loading: true});
    if(this.props.request) {
      let remoteOptions = this.props.request;
      let remoteFilter  = {
        order: (this.state.order) ? this.state.order : tableOptions.order,
        orderBy: (this.state.orderBy) ? this.state.orderBy : tableOptions.orderBy,
        page: (this.state.page) ? this.state.page : tableOptions.page,
        rowsPerPage: (this.state.rowsPerPage) ? this.state.rowsPerPage : tableOptions.rowsPerPage,
        include: (this.props.include) ? this.props.include : [],
        fields: (this.props.fields) ? this.props.fields : [],
        where: (this.state.where) ? this.state.where : {}
      };

      remoteOptions["filter"] = Object.assign(remoteFilter, filterOptions);
      
      remote(remoteOptions, (data) => {
        this.setState({rows: data.records, rowsCount: data.count, loading: false});
      });
    } else {
      this.setState({rows: this.state.rows, rowsCount: this.state.rows.length, loading: false});
    }
  }

  refreshData = () => {
    this.loadData();
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
        order = 'asc';
    }

    if(this.props.request) {
      this.loadData({order: order, orderBy: property});
    } else {
      (order === 'desc')
        ? this.state.rows.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.rows.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.rows.map(n => n[this.props.uKey]) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, rowData) => {
    event.preventDefault();

    if(event.target.tagName === "TD" && this.props.clickLink) {
      history.push(this.props.clickLink + rowData[this.state.uKey]);
    }
    
    if(event.target.tagName === "TD" && this.props.clickFunction) {
      this.props.clickFunction(this, rowData);
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
    if(this.props.request) {
      this.loadData({page: page});
    }

    this.setState({ page: page });
  };

  handleChangeRowsPerPage = event => {
    if(this.props.request) {
      this.loadData({rowsPerPage: event.target.value});
    }

    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => {
    if(this.state.selectable) {
      return this.state.selected.indexOf(id) !== -1;
    } else {
      return false;
    }
  }

  openDialog = (dialogInfo) => {
    this.setState({ dialogOpen: true, dialog: dialogInfo });
  };

  closeDialog = value => {
    this.setState({ dialogOpen: false });

    if(value === "ok" && this.state.dialog.action) {
      this.state.dialog.action();
    }
  };

  render = () => {
    const { title, classes, ...other } = this.props;
    
    const { columns } = this.state;
    const { order, orderBy, selected, rowsPerPage, page, uKey, selectable } = this.state;
    const { handleSelectAllClick, handleRequestSort } = this.state;

    let rows = [];
    if(this.state.request) {
      rows = (this.state.rows) ? this.state.rows : [];
    } else {
      rows = (this.state.rows) ? this.state.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];
    }
    
    const rowsCount = (this.state.rowsCount) ? this.state.rowsCount : ((this.state.rows) ? this.state.rows.length : 0);
    
    if(selected !== undefined) {
      this.selectedRows = selected;
    }

    if(handleSelectAllClick !== undefined) {
      this.handleSelectAllClick = handleSelectAllClick;
    }

    if(handleRequestSort !== undefined) {
      this.onRequestSort = handleRequestSort;
    }
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowsCount - page * rowsPerPage);
    return (
      <Paper className={classes.paper}>
        {(title) ? (
          <Toolbar 
            title={title}
            numSelected={this.selectedRows.length}
            openDialog={this.openDialog} 
            closeDialog={this.closeDialog}
            refreshData={this.refreshData}
            {...other} 
          />
        ) : null}
        <Filter options={columns} loadData={this.loadData} />
        <div className={classes.tableWrapper}>
          {this.state.loading && <CircularProgress className={classes.progress} />}
          <Table className={classes.table} aria-labelledby="tableTitle" key={Date.now()}>
            <EnhancedTableHead
              selectable={selectable}
              columns={columns}
              numSelected={this.selectedRows.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={rowsCount}
            />
            <TableBody>
            {rows.map(n => {
              const isSelected = this.isSelected(n[uKey]);
              return (
              <TableRow
                hover
                onClick={event => this.handleClick(event, n)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
                key={`${(new Date()).getTime()}-${(title) ? title.replace(' ', '-') : ""}-${n[uKey]}`}
                selected={isSelected}
              >
              {columns.map(column => {
                let cellData = n;

                let nestedData = column.name.split('.');
                nestedData.map(nestedColumn => {
                  if(cellData[nestedColumn]) {
                    cellData = cellData[nestedColumn];
                  } else {
                    cellData = "";
                  }
                  
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
                      let buttonLink  = "";
                      let showField   = true;

                      if(button.beforeShow) {
                        showField = button.beforeShow(n);
                      }

                      if(button.getIcon) {
                        button['icon'] = button.getIcon(n[button.field]);
                      }

                      if(showField && button.link) {
                        buttonLink = button.link;
                        if(button.param) {
                          buttonLink = buttonLink + n[button.param];
                        }

                        if(button.icon === undefined) {
                          cellData.push(<Chip
                            label={button.label}
                            to={buttonLink} 
                            component={Link}
                            className={classes.chip}
                            key={n[uKey] + button.label.replace(' ', '-')}
                          />);
                        } else {
                          cellData.push(<IconButton aria-label={button.label} to={buttonLink} component={Link} key={n[uKey] + button.label.replace(' ', '-')} >
                            <button.icon />
                          </IconButton>);
                        }
                      }

                      if(showField && button.action) {
                        if(button.icon === undefined) {
                          cellData.push(<Chip
                            label={button.label}
                            onClick={() => button.action(this, n)}
                            className={classes.chip}
                            key={n[uKey] + button.label.replace(' ', '-')}
                          />);
                        } else {
                          cellData.push(<IconButton aria-label={button.label} onClick={() => button.action(this, n)} key={n[uKey] + button.label.replace(' ', '-')}>
                            <button.icon />
                          </IconButton>);
                        }
                      }

                      return "";
                    });
                    break;
                  case 'render':
                    cellData = column.render(n);
                    break;
                  case 'link':
                    cellData = (<IconButton to={cellData} component={Link} ><LinkIcon /></IconButton>);
                    break;
                  case 'image':
                    let imageSource = cellData;
                    cellData = (<IconButton aria-label={"button.label"} onClick={() => {
                      console.log("Image Click", imageSource);  console.log(this);

                      this.openDialog({
                        title: "Image",
                        content: <Card 
                          media={imageSource}
                          onClose={this.closeDialog}
                        />
                      });

                    }}>
                            <Avatar alt={""} src={cellData} />
                          </IconButton>);
                    break;
                  default:
                    break;
                }

                return (
                  (column.name === "selectable") ? (<TableCell padding="checkbox" key={column.name}>
                  <Checkbox checked={isSelected} />
                </TableCell>) : (<TableCell key={column.name}>{cellData}</TableCell>));
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
          count={rowsCount}
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

        <Dialog 
          title={this.state.dialog.title}
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          type={this.state.dialog.type} 
          content={this.state.dialog.content}
          text={this.state.dialog.text}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);