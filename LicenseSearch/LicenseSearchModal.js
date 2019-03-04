import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Licenses } from '@folio/licenses';
import { Modal } from '@folio/stripes/components';

import css from './LicenseSearch.css';

export default class LicenseSearchModal extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
    onLicenseSelected: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    dataKey: PropTypes.string,
  };

  static defaultProps = {
    dataKey: 'find-license',
  }

  constructor(props) {
    super(props);

    this.connectedApp = props.stripes.connect(Licenses, { dataKey: props.dataKey });
  }

  selectLicense = (e, agreement) => {
    this.props.onLicenseSelected(agreement);
    this.props.onClose();
  }

  render() {
    return (
      <Modal
        contentClass={css.modalContent}
        dismissible
        enforceFocus={false}
        label={<FormattedMessage id="ui-plugin-find-license.selectLicense" />}
        onClose={this.props.onClose}
        open={this.props.open}
        size="large"
      >
        <this.connectedApp
          {...this.props}
          browseOnly
          onComponentWillUnmount={this.props.onClose}
          onSelectRow={this.selectLicense}
          showSingleResult={false}
        />
      </Modal>
    );
  }
}
