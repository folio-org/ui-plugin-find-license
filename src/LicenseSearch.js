import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@folio/stripes/components';
import contains from 'dom-helpers/query/contains';
import Modal from './Modal';

const triggerId = 'find-license-trigger';
class LicenseSearch extends React.Component {
  static propTypes = {
    renderTrigger: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.modalRef = React.createRef();
    this.modalTrigger = React.createRef();
    this.state = {
      open: false,
    };
  }

  openModal = () => {
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false }, () => {
      if (this.modalRef.current && this.modalTrigger.current) {
        if (contains(this.modalRef.current, document.activeElement)) {
          this.modalTrigger.current.focus();
        }
      }
    });
  }

  renderDefaultTrigger() {
    return (
      <Button
        id={triggerId}
        buttonStyle="primary noRightRadius"
        buttonRef={this.modalTrigger}
        onClick={this.openModal}
      >
        <Icon icon="search" color="#fff" />
      </Button>
    );
  }

  renderTriggerButton() {
    const {
      renderTrigger,
    } = this.props;

    return renderTrigger
      ? renderTrigger({
        id: triggerId,
        onClick: this.openModal,
        buttonRef: this.modalTrigger,
      })
      : this.renderDefaultTrigger();
  }

  render() {
    return (
      <>
        {this.renderTriggerButton()}
        <Modal
          modalRef={this.modalRef}
          open={this.state.open}
          onClose={this.closeModal}
          {...this.props}
        />
      </>

    );
  }
}

export default LicenseSearch;
