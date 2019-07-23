import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import { Editor } from '@tinymce/tinymce-react';

import 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';

const styles = theme => ({});

const tinyTextOptions = {}

class EnhancedRichText extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(tinyTextOptions, props);

  }

  componentDidMount = () => {
    this.setState({setInitialValue : true });
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ value: nextProps.value, data: nextProps.data });
    if(this.state.setInitialValue){
      this.setState({ keyValue: nextProps.value });
    }
    this.setState({setInitialValue : false })
  }
  
  handleEditorChange = (evt, editor) => {
    this.props.onChange(this.props.name, editor.getContent());
    editor.save();
  }

  render = () => {
    const { data, value } = this.state;
    return (
      <FormControl 
        error={(typeof this.props.error === 'function') ? this.props.error(data) : this.props.error}
        aria-describedby={`${this.props.name}-error-text`}
        key={`form-control-${this.props.name}`}
      >
        <Editor
          key={this.state.keyValue}
          initialValue={
            (typeof value === 'function') ? value(data) : (
              (value === undefined) ? "" : value
            )
          }
          init={{
            skin:false,
            content_css: false,
            plugins: 'link image code media table',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image media | code | table'
          }}
          onChange={this.handleEditorChange}
          onKeyUp ={this.handleEditorChange}
        />

        {
          (this.props.error) ? (
            <FormHelperText id={`${this.props.name}-error-text`}>
              {(typeof this.props.title === 'function') ? this.props.title(data) : this.props.title}
            </FormHelperText>
          ) : null
        }

        {
          (this.props.helptext) ? (
            <FormHelperText id={`${this.props.name}-help-text`}>
            {(typeof this.props.helptext === 'function') ? this.props.helptext(data) : this.props.helptext}
            </FormHelperText>
          ) : null
        }

        {
          (this.props.helplink) ? (
            <FormHelperText id={`${this.props.name}-help-text`}>
              {(typeof this.props.helplink === 'function') ? this.props.helplink(data) : this.props.helplink}
            </FormHelperText>
          ) : null
        }
      </FormControl>
    );
  }
}

EnhancedRichText.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedRichText);