import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from '@folio/stripes/components';

import Container from './Container';
import css from './LicenseSearch.css';

export default class LicenseSearchModal extends React.Component {
  static propTypes = {
    dataKey: PropTypes.string,
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    onLicenseSelected: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    dataKey: 'find-license',
  }

  constructor(props) {
    super(props);

    this.modalRef = props.modalRef || React.createRef();
    this.connectedContainer = props.stripes.connect(Container, { dataKey: props.dataKey });
  }

  selectLicense = (e, agreement) => {
    this.props.onLicenseSelected(agreement);
    this.props.onClose();
  }

  render() {
    return (
      <FormattedMessage id="ui-plugin-find-license.selectLicense">
        {label => (
          <Modal
            ref={this.modalRef}
            contentClass={css.modalContent}
            dismissible
            enforceFocus={false}
            id="plugin-find-license-modal"
            label={label}
            onClose={this.props.onClose}
            open={this.props.open}
            size="large"
          >
            <this.connectedContainer
              {...this.props}
              onSelectRow={this.selectLicense}
            />
          </Modal>
        )}
      </FormattedMessage>
    );
  }
}
