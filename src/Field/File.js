import React from 'react';
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
const Uppy = require('@uppy/core')
const { DashboardModal } = require('@uppy/react')

class EnhancedFile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false
    }

    this.uppy = new Uppy()

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
