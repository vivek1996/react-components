import React from 'react';
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
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { Done, Clear, KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';

import TableHead from './TableHead';
import Titlebar from './Titlebar';
// import Filter from "./../Filter";
import ChipFilter from '../ChipFilter';

import { isDefined, isFunction } from '../lib/utils';

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    minWidth: 'auto'
  },
  paper: {
    width: '100%',
    minWidth: 'auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  },
  chip: {
    margin: theme.spacing()
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

const EnhancedTable = (props) => {
  const { title, pagination, classes, uniqueKey, selectable, columns, onLoad, filter, ...other } = props;

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState(props.rows);
  const [rowsCount, setRowsCount] = React.useState(props.rowsCount || props.rows.length);
  const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage);
  const [filterOptions, setFilterOptions] = React.useState(filter);
  const [sort, setSort] = React.useState(props.order || props.sort);
  const [sortBy, setSortBy] = React.useState(props.orderBy || props.sortBy);
  const [selected, setSelected] = React.useState(props.selected);
  const [page, setPage] = React.useState(props.page);
  const [expanded, setExpanded] = React.useState(props.expanded);
  const [expandedRow, setExpandedRow] = React.useState(props.expandedRow);

  const fetchData = async (tableLoadOptions) => {
    setLoading(true);
    if (onLoad) {
      const { rows, rowsCount } = await onLoad(tableLoadOptions);
      setRows(rows);
      setRowsCount(rowsCount);
    }

    setLoading(false);
  }

  React.useEffect(() => {
    fetchData({
      filter: filterOptions,
      sortBy,
      sort,
      page,
      rowsPerPage
    });
  }, []);

  React.useEffect(() => {
    fetchData({
      filter: filterOptions,
      sortBy,
      sort,
      page,
      rowsPerPage
    });
  }, [page, rowsPerPage, sort, sortBy, filterOptions]);

  const handleRequestSort = (event, property) => {
    let sortBy = property;
    let sort = 'desc';

    if (sortBy === property && sort === 'desc') {
      sort = 'asc';
    }

    setSort(sort);
    setSortBy(sortBy);
  };

  const handleSelectAllClick = (event, checked) => {
    setSelected((checked) ? rows.map(n => n[props.uniqueKey]) : []);
  };

  const handleClick = (event, rowData) => {
    const { type, checked } = event.target;
    if (type === 'checkbox') {
      if (props.onClick && isFunction(props.onClick)) {
        event.preventDefault();
        props.onClick(rowData, event);
      } else {
        // this.setState((state, props) => {
        //   let selected = state.selected;
        //   let rowKey = rowData[props.uniqueKey];

        //   if (checked) {
        //     if (selected.indexOf(rowKey) === -1) {
        //       selected.push(rowKey);
        //     }
        //   } else {
        //     selected = selected.splice(selected.indexOf(rowKey), 1);
        //   }

        //   return { selected: selected };
        // });
      }
    }

    if (event.target.tagName === 'TD' && props.clickLink) {
      event.preventDefault();
      // history.push(props.clickLink + rowData[props.uniqueKey]);
    }

    if (event.target.tagName === 'TD' && props.clickFunction) {
      event.preventDefault();
      props.clickFunction(rowData);
    }
  };

  const isSelected = id => (selected.indexOf(id) !== -1);

  const handleChangePage = (event, page) => setPage(page);

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const formatCellData = (cell, rowData, uniqueKey) => {
    let cellData = rowData;
    let nestedData = cell.name.split('.');
    nestedData.map(nestedColumn => {
      if (cellData[nestedColumn]) {
        cellData = cellData[nestedColumn];
      } else {
        cellData = '';
      }

      return '';
    });

    let showCellData = true;
    if (cell.beforeShow) {
      showCellData = cell.beforeShow(rowData);
    }

    if (showCellData) {
      switch (cell.type) {
        case 'boolean':
          cellData = cellData ? <Done /> : <Clear />;
          break;
        case 'button':
          cellData = [];
          cell.buttons.map(button => {
            let buttonLink = '';
            let showField = true;

            if (button.beforeShow) {
              showField = button.beforeShow(rowData);
            }

            if (button.getIcon) {
              button['icon'] = button.getIcon(rowData[button.field]);
            }

            if (showField && button.link) {
              buttonLink = button.link;
              if (button.param) {
                buttonLink = buttonLink + rowData[button.param];
              }

              if (isDefined(button.icon)) {
                cellData.push(<IconButton aria-label={button.label} to={buttonLink} component={Link} key={rowData[uniqueKey] + button.label.replace(' ', '-')} >
                  <button.icon />
                </IconButton>);
              } else {
                cellData.push(<Chip
                  label={button.label}
                  to={buttonLink}
                  component={Link}
                  className={props.classes.chip}
                  key={rowData[uniqueKey] + button.label.replace(' ', '-')}
                />);
              }
            }

            if (showField && button.action) {
              if (!isDefined(button.icon)) {
                cellData.push(<Chip
                  label={button.label}
                  onClick={() => button.action(rowData)}
                  className={props.classes.chip}
                  key={rowData[uniqueKey] + button.label.replace(' ', '-')}
                  color={button.color}
                  size={button.size}
                  variant={button.variant}
                />);
              } else if (button.type === 'fab') {
                cellData.push(<Fab aria-label={button.label} onClick={() => button.action(rowData)} color={button.color} key={rowData[uniqueKey] + button.label.replace(' ', '-')} size={button.size} classes={button.classes}>
                  <button.icon />
                </Fab>);
              } else {
                cellData.push(<IconButton aria-label={button.label} onClick={() => button.action(rowData)} color={button.color} key={rowData[uniqueKey] + button.label.replace(' ', '-')}>
                  <button.icon />
                </IconButton>);
              }
            }

            return '';
          });
          break;
        case 'render':
          cellData = cell.render(rowData);
          break;
        case 'expand':
          const isExpanded = (rowData[uniqueKey] === expandedRow[uniqueKey]);
          cellData = (
            <IconButton aria-label={cell.label} onClick={() => {
              toggleExpand(cell, rowData);
            }}>
              {
                (isExpanded && expanded) ? <KeyboardArrowUp /> : <KeyboardArrowDown />
              }
            </IconButton>
          );
          break;
        default:
          break;
      }
    } else {
      cellData = '';
    }

    return cellData;
  }

  const toggleExpand = async (cell, rowData) => {
    let expandContent = null;
    let tempExpandedRow = expandedRow;
    if (Object.keys(expandedRow).length > 0
      && expandedRow[props.uniqueKey] === rowData[props.uniqueKey]) {
      tempExpandedRow = {};
    } else {
      tempExpandedRow = rowData;
      expandContent = await getExpandContent(cell, rowData);
    }

    setExpanded(expandContent);
    setExpandedRow(tempExpandedRow);
  }

  const getExpandContent = async (cell, rowData) => {
    let expandContent = await cell.render(rowData);
    return expandContent;
  }

  return (
    <Paper className={classes.paper}>
      {(title) ? (
        <Titlebar
          title={title}
          selectable={selectable}
          numSelected={selected.length}
          {...other}
        />
      ) : null}

      <ChipFilter
        options={columns}
        onFilter={setFilterOptions}
      />

      <div className={classes.tableWrapper}>
        {loading && <CircularProgress className={classes.progress} />}
        <Table className={classes.table} aria-labelledby='tableTitle' key={Date.now()}>
          <TableHead
            selectable={selectable}
            columns={columns}
            numSelected={selected.length}
            sort={sort}
            sortBy={sortBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {(!loading && rows.length === 0) ? (
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
              const isSelectedVal = isSelected(n[uniqueKey]);
              const isExpanded = (n[uniqueKey] === expandedRow[uniqueKey]);
              let expandColumn = isExpanded && columns.find(function(column) {
                let showColumn = true;
                if (column.beforeShow) {
                  showColumn = column.beforeShow(n);
                }

                return (showColumn && column.type === 'expand');
              });

              return (
                <React.Fragment>
                  <TableRow
                    hover
                    onClick={event => handleClick(event, n)}
                    role='checkbox'
                    aria-checked={isSelectedVal}
                    tabIndex={-1}
                    key={`${(new Date()).getTime()}-${n[uniqueKey]}`}
                    selected={isSelectedVal}
                  >
                    {(columns.some(column => column.span === true)) ? (
                      columns.map(column => {
                        let cellData = formatCellData(column, n, uniqueKey);

                        return ((column.show === undefined || column.show) && column.span) ? (
                          (column.type === 'select') ? (
                            <TableCell
                              padding='checkbox'
                              key={column.name}
                              classes={{
                                root: classes.tableCell
                              }}
                            >
                              <Checkbox checked={isSelectedVal} />
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
                        let cellData = formatCellData(column, n, uniqueKey);

                        return (column.show === undefined || column.show) ? (
                          (column.type === 'select') ? (
                            <TableCell
                              padding='checkbox'
                              key={column.name}
                              classes={{
                                root: classes.tableCell
                              }}
                            >
                              <Checkbox
                                checked={isSelectedVal}
                              />
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

                  {
                    (isExpanded && expandColumn && expanded) ? (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          {expanded}
                        </TableCell>
                      </TableRow>
                    ) : null
                  }
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {(pagination && rows.length > 0) ? (
        <TablePagination
          component='div'
          count={rowsCount}
          rowsPerPage={rowsPerPage}
          page={page}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : null}
    </Paper>
  );
}

EnhancedTable.defaultProps = {
  pagination: true,
  selectable: false,
  rows: [],
  selected: [],
  columns: [],
  uniqueKey: 'id',
  sort: 'desc',
  sortBy: 'id',
  page: 0,
  rowsPerPage: 10,
  actions: [],
  loading: false,
  filter: {},
  expanded: null,
  expandedRow: {}
};

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  pagination: PropTypes.bool.isRequired,
  rows: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedTable);
