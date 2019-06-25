import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestionItem: {
    height: 'auto',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    whiteSpace: 'normal !important'
  }
});

class AutoSuggest extends React.Component {
  state = {
    suggestions: [],
    data: {}
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({ data: nextProps.data });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    
    if(inputLength > 0) {
      let fetchApiResponse = this.props.fetchApi(inputValue, this.state.data);
      if(fetchApiResponse instanceof Promise) {
        fetchApiResponse.then(suggestions => {
          this.setState({ suggestions });
        }).catch(error => {
          this.setState({ suggestions: [] });
        });
      } else {
        this.setState({ suggestions: fetchApiResponse });
      }
    }
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const { classes } = this.props;
    const suggestionLabel = (suggestion[this.props.name] !== "undefined" ? suggestion[this.props.name] : suggestion.label);

    const matches = match(suggestionLabel, query);
    const parts = parse(suggestionLabel, matches);
  
    return (
      <MenuItem selected={isHighlighted} component="div" className={classes.suggestionItem}>
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  }

  renderInputComponent = (inputProps) => {
    const { classes, inputRef = () => {}, ref, disableUnderline, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        InputProps={{
          disableUnderline:disableUnderline,
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input,
          },
        }}
        {...other}
      />
    );
  }

  getSuggestionValue = (suggestion) => {
    return (suggestion[this.props.name] !== "undefined" ? suggestion[this.props.name] : '');
  }

  handleChange = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue,
    });
  };

  render() {
    const { classes, disableUnderline } = this.props;
    const autosuggestProps = {
      renderInputComponent: this.renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion: this.renderSuggestion,
      onSuggestionSelected: this.props.onSelect
    };

    return (
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          placeholder: this.props.placeholder,
          name: this.props.name,
          value: this.props.value,
          onChange: this.props.onChange(this.props.name),
          disableUnderline: disableUnderline
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    );
  }
}

AutoSuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AutoSuggest);