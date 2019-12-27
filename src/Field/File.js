import React from 'react';
// import PropTypes from 'prop-types';

// import { Uppy } from '@uppy/core'
// import { DashboardModal } from '@uppy/react'


const Uppy = require('@uppy/core')
const Tus = require('@uppy/tus')

const { DashboardModal } = require('@uppy/react')

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

class EnhancedFile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false
    }

    this.uppy = Uppy()

      // .use(Tus, {})
  }

  componentWillUnmount () {
    this.uppy.close()
  }

  toggleButton = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  render = () => {
    return (
      <div>
        <button onClick={this.toggleButton}>
          {this.state.modalOpen ? 'Close dashboard' : 'Open dashboard'}
        </button>
        
        <DashboardModal
          uppy={this.uppy}
          closeModalOnClickOutside
          open={this.state.modalOpen}
          onRequestClose={this.handleClose}
        />
      </div>
    );
  }
}

// EnhancedFile.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired
// };

export default EnhancedFile;
