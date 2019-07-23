import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

import Form from "./Form";
import Popper from "./Popper";

const styles = theme => ({
  root: {
    display: 'flex',
    // justifyContent: 'flex-end',
    flexWrap: 'inherit',
    overflowX: 'hidden',
    overflowY: 'hidden',
    '&:hover': {
      overflowX: 'auto',
    },
    // [theme.breakpoints.between('sm', 'xl')]: {
    //   flexWrap: 'wrap',
    // }
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  chipLabel: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  }
});

class ChipFilter extends React.Component {
	state = {
		open: false,
		dialogOpen: false,
    dialog: {},
    filterData: {}
	};

	clearFilter = (option) => {
    this.setState((state) => {
      let newState = state;
      delete newState.filterData[option.name];
      return newState;
    }, () => {
      this.props.loadData(this.state.filterData);
    });
	}

	openFilter = (dialogInfo) => {
		this.setState({ dialogOpen: true, dialog: dialogInfo });
	};
	
	closeFilter = value => {
		this.setState({ dialogOpen: false });
	
		if(value === "ok" && this.state.dialog.action) {
		  this.state.dialog.action();
		}
  };
  
  getSelectedValue = (option) => {
    let filterData = this.state.filterData;
    if(filterData[option.name] === undefined || filterData[option.name] === "" || filterData[option.name].length === 0) {
      return option.label;
    } else if(['multiselect', 'select', 'radio', 'checkbox'].indexOf(option.type) > -1) {
      let availableOptions = [];
      if(option.enum) {
        availableOptions = option.enum;
      } else if(option.options) {
        availableOptions = option.options;
      } else if(typeof option.data === 'object') {
        availableOptions = option.data;
      } else if(typeof option.data === 'function') {
        availableOptions = option.data();
      }

      let selectedOptions = availableOptions.map(availableOption => 
        (filterData[option.name].indexOf(availableOption.value.toString()) > -1) ? availableOption.label : ''
      ).filter(selectedOption => selectedOption !== undefined && selectedOption !== "")

      return (selectedOptions.length > 1) ? `${selectedOptions[0]} + ${selectedOptions.length - 1}` : selectedOptions;
    } else if(['daterange'].indexOf(option.type) > -1) {
      return `${option.label} : From ${filterData[option.name].start} To ${filterData[option.name].end}`;
    } else {
      let availableOptions = [];
      if(option.enum) {
        availableOptions = option.enum;
      } else if(option.options) {
        availableOptions = option.options;
      } else if(typeof option.data === 'object') {
        availableOptions = option.data;
      } else if(typeof option.data === 'function') {
        availableOptions = option.data();
      }

      if(availableOptions.length > 0) {
        let selectedOptions = availableOptions.map(availableOption => 
          (filterData[option.name].indexOf(availableOption.value.toString()) > -1) ? availableOption.label : ''
        ).filter(selectedOption => selectedOption !== undefined && selectedOption !== "")
  
        return (selectedOptions.length > 1) ? `${selectedOptions[0]} + ${selectedOptions.length - 1}` : selectedOptions;
      } else {
        return `${option.label} ${filterData[option.name]}`;
      }
    }
  }

	render = () => {
		const { classes, options } = this.props;
    const { open, filterData } = this.state;

    let filterOptions = options || [];
		return (
			<div className={classes.root}>
				{filterOptions.map(option => {
          return (option.filter) ? (
            <Chip
              key={option.name}
              icon={(filterData[option.name] === undefined || filterData[option.name] === "" || filterData[option.name].length === 0) ? <ArrowDropDown /> : null}
              color={(filterData[option.name] !== undefined && filterData[option.name] !== "" && (filterData[option.name].length > 0 || Object.keys(filterData[option.name]).length > 0 )) ? 'primary' : 'default'}
              label={this.getSelectedValue(option)}
              onClick={(node) => {
                let tempOption = Object.assign({}, option);
                delete tempOption.label;
                this.openFilter({
                  title: option.label,
                  anchorEl: node.target,
                  content: <Form 
                    fields={[tempOption]}
                    buttons={[]}
                    data={filterData}
                    loadOnChange={true}
                    submitAction={(filterData, formInstance) => {
                      if(Object.keys(filterData).length > 0) {
                        this.props.loadData(filterData);
                      }

                      formInstance.setState({loading: false});
                      this.setState({filterData: filterData});
                    }}
                    onClose={this.closeFilter}
                  />
                });
              }}
              onDelete={(filterData[option.name] === undefined || filterData[option.name] === "" || filterData[option.name].length === 0) ? null : () => {
                this.clearFilter(option);
              }}
              className={classes.chip}
              aria-owns={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              classes={{
                label: classes.chipLabel
              }}
            />
          ) : null;
				})}

        <Popper 
          key={this.state.dialog.key}
          title={this.state.dialog.title}
          open={this.state.dialogOpen}
          onClose={this.closeFilter}
          type={this.state.dialog.type} 
          content={this.state.dialog.content}
          text={this.state.dialog.text}
          arrow={false}
          arrowRef={null}
          disablePortal={false}
          flip={true}
          placement={"bottom-start"}
          preventOverflow={'scrollParent'}
          anchorEl={this.state.dialog.anchorEl}
				/>
			</div>
		);
	}
}

ChipFilter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChipFilter);