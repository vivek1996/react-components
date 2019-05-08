import React from "react";
import moment from "moment";
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import {Done, Clear } from '@material-ui/icons';
import LinkIcon from '@material-ui/icons/Link';

import TableHead from './TableHead';
import { history, request } from './../../_helpers';
import { Toolbar, Dialog, Filter, Card } from "./../";

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 'auto',
  },
  paper: {
    width: '100%',
    minWidth: 'auto',
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
  tableCell: {
    padding: '4px 8px 4px 8px'
  }
});

const tableOptions = {
  order: 'asc',
  orderBy: 'id',
  selected: [],
  data: [],
  page: 0,
  rowsPerPage: 10,
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
      order: nextProps.order, 
      rowsCount: nextProps.rowsCount, 
      uKey: nextProps.uKey 
    });
  }

  componentWillUnmount = () => {}

  loadData = (filterOptions = {orderBy:this.state.orderBy, order:this.state.order}) => {
    if(this.props.url) {
      this.setState({loading: true});
      request.get(this.props.url)
      .then(
        response => {
          this.setState({
            rows: (response.rows) ? response.rows : response, 
            rowsCount: (response.count) ? response.count : response.length, 
            loading: false
          });
        },
        error => {
          this.setState({rows: [], rowsCount: 0, loading: false});
        }
      );
    } else if(this.props.loadData) {
      this.props.loadData(filterOptions, this);
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

    if(this.props.url) {
      this.loadData({order: order, orderBy: property});
    } else if(this.props.loadData) {
      this.props.loadData({order: order, orderBy: property}, this);
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
    if(event.target.tagName === "TD" && this.props.clickLink) {
      event.preventDefault();
      history.push(this.props.clickLink + rowData[this.state.uKey]);
    }
    
    if(event.target.tagName === "TD" && this.props.clickFunction) {
      event.preventDefault();
      this.props.clickFunction(this, rowData);
    }
  };

  handleChangePage = (event, page) => {
    if(this.props.url) {
      this.loadData({page: page});
    } else if(this.props.loadData) {
      this.props.loadData({page: page}, this);
    }

    this.setState({ page: page });
  };

  handleChangeRowsPerPage = event => {
    if(this.props.url) {
      this.loadData({rowsPerPage: event.target.value});
    } else if(this.props.loadData) {
      this.props.loadData({rowsPerPage: event.target.value}, this);
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

  formatCellData = (cell, rowData, uKey) => {
    let cellData = rowData;
    let nestedData = cell.name.split('.');
    nestedData.map(nestedColumn => {
      if(cellData[nestedColumn]) {
        cellData = cellData[nestedColumn];
      } else {
        cellData = "";
      }
      
      return "";
    });

    switch(cell.type) {
      case 'boolean':
        cellData = cellData ? <Done /> : <Clear />;
        break;
      case 'datetime':
        cellData = (cellData === null || cellData === "") ? '' : moment(cellData).format('MMMM Do YYYY, h:mm:ss a');
        break;
      case 'date':
        cellData = (cellData === null || cellData === "") ? '' : moment(cellData).format('MMMM Do YYYY');
        break;
      case 'month':
        if(cellData) {
          cellData = moment(cellData).format('MMMM YYYY');
        } else {
          cellData = "";
        }
        break;
      case 'button':
        cellData = [];
        cell.buttons.map(button => {
          let buttonLink  = "";
          let showField   = true;

          if(button.beforeShow) {
            showField = button.beforeShow(rowData);
          }

          if(button.getIcon) {
            button['icon'] = button.getIcon(rowData[button.field]);
          }

          if(showField && button.link) {
            buttonLink = button.link;
            if(button.param) {
              buttonLink = buttonLink + rowData[button.param];
            }

            if(button.icon === undefined) {
              cellData.push(<Chip
                label={button.label}
                to={buttonLink} 
                component={RouterLink}
                className={this.props.classes.chip}
                key={rowData[uKey] + button.label.replace(' ', '-')}
              />);
            } else {
              cellData.push(<IconButton aria-label={button.label} to={buttonLink} component={RouterLink} key={rowData[uKey] + button.label.replace(' ', '-')} >
                <button.icon />
              </IconButton>);
            }
          }

          if(showField && button.action) {
            if(button.icon === undefined) {
              cellData.push(<Chip
                label={button.label}
                onClick={() => button.action(this, rowData)}
                className={this.props.classes.chip}
                key={rowData[uKey] + button.label.replace(' ', '-')}
              />);
            } else if(button.type === 'fab') {
              cellData.push(<Fab aria-label={button.label} onClick={() => button.action(this, rowData)} color={button.color} key={rowData[uKey] + button.label.replace(' ', '-')} size={button.size} classes={button.classes}>
                <button.icon />
              </Fab>);
            } else {
              cellData.push(<IconButton aria-label={button.label} onClick={() => button.action(this, rowData)} color={button.color} key={rowData[uKey] + button.label.replace(' ', '-')}>
                <button.icon />
              </IconButton>);
            }
          }

          return "";
        });
        break;
      case 'render':
        cellData = cell.render(rowData, this);
        break;
      case 'link':
        if(cellData && cellData !== "") {
          cellData = (
            <Link 
              component={RouterLink}
              to={cellData}
              target="_blank"
              rel="noopener"
            >
              <LinkIcon />
            </Link>
          );
        }
        break;
      case 'file':
        if(cellData && cellData !== "") {
          cellData = (
            <Link 
              component={RouterLink}
              to={cellData}
              target="_blank"
              rel="noopener"
            >
              <LinkIcon />
            </Link>
          );
        }
        break;
      case 'image':
        let imageSource = cellData;
        cellData = (
          <IconButton aria-label={"button.label"} onClick={() => {
            this.openDialog({
              title: "Image",
              content: <Card 
                image={imageSource}
                onClose={this.closeDialog}
              />
            });
          }}>
            <Avatar alt={""} src={cellData} />
          </IconButton>
        );
        break;
      case 'media':
        let mediaSource = cellData;
        cellData = (
          <IconButton aria-label={cell.label} onClick={() => {
            this.openDialog({
              title: "Media",
              content: <Card 
                media={mediaSource}
                onClose={this.closeDialog}
              />
            });
          }}>
            <LinkIcon />
          </IconButton>
        );
        break;
      default:
        break;
    }

    return cellData;
  }

  render = () => {
    const { title, pagination, classes, ...other } = this.props;
    
    const { columns, rowsCount } = this.state;
    const { order, orderBy, selected, rowsPerPage, page, uKey, selectable } = this.state;
    const { handleSelectAllClick, handleRequestSort } = this.state;

    let rows = [];
    if(this.state.url || this.state.loadData) {
      rows = (this.state.rows) ? this.state.rows : [];
    } else {
      rows = (this.state.rows) ? this.state.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];
    }
    
    // const rowsCount = (this.state.rowsCount) ? this.state.rowsCount : ((this.state.rows) ? this.state.rows.length : 0);
    
    if(selected !== undefined) {
      this.selectedRows = selected;
    }

    if(handleSelectAllClick !== undefined) {
      this.handleSelectAllClick = handleSelectAllClick;
    }

    if(handleRequestSort !== undefined) {
      this.onRequestSort = handleRequestSort;
    }
    
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowsCount - page * rowsPerPage);
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
            <TableHead
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
            
            {(!this.state.loading && rows.length === 0) ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  classes={{
                    root: classes.tableCell
                  }}
                >
                  <Typography>Nothing here yet</Typography>
                </TableCell>
              </TableRow>
            ) : null}
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
                  {(columns.some(column => column.span === true)) ? (
                    columns.map(column => {
                      let cellData = this.formatCellData(column, n, uKey);

                      return ((column.show === undefined || column.show) && column.span) ? (
                        (column.name === "selectable") ? (
                          <TableCell 
                            padding="checkbox" 
                            key={column.name}
                            classes={{
                              root: classes.tableCell
                            }}
                          >
                            <Checkbox checked={isSelected} />
                          </TableCell>
                        ) : (
                          <TableCell 
                            key={column.name} 
                            colSpan={columns.length}
                            classes={{
                              root: classes.tableCell
                            }}
                          >
                            {cellData}
                          </TableCell>
                        )
                      ) : null;
                    })
                  ) : (
                    columns.map(column => {
                      let cellData = this.formatCellData(column, n, uKey);

                      return (column.show === undefined || column.show) ? (
                        (column.name === "selectable") ? (
                          <TableCell 
                            padding="checkbox" 
                            key={column.name}
                            classes={{
                              root: classes.tableCell
                            }}
                          >
                            <Checkbox checked={isSelected} />
                          </TableCell>
                        ) : (
                          <TableCell 
                            key={column.name} 
                            padding={column.disablePadding ? 'none' : 'default'}
                            classes={{
                              root: classes.tableCell
                            }}
                          >
                            {cellData}
                          </TableCell>
                        )
                      ) : null;
                    })
                  )}
                </TableRow>
              );
            })}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
            </TableBody>
          </Table>
        </div>

        {(pagination && rows.length > 0 && rowsCount > rows.length) ? (
          <TablePagination
            component="div"
            count={rowsCount}
            rowsPerPage={rowsPerPage}
            page={page}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        ) : null}

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

EnhancedTable.defaultProps = {
  pagination: true,
  rows: []
};

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  pagination: PropTypes.bool.isRequired,
  rows: PropTypes.array.isRequired
};

export default withStyles(styles)(EnhancedTable);