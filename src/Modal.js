import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from '@folio/stripes/components';

import Container from './Container';
import css from './LicenseSearch/LicenseSearch.css';

const LicenseSearchModal = (props) => {
  const {
    modalRef,
    onClose,
    onLicenseSelected,
    open,
  } = props;
  const backupModalRef = useRef();
  const theModalRef = modalRef || backupModalRef;

  const selectLicense = (e, agreement) => {
    onLicenseSelected(agreement);
    onClose();
  };

  return (
    <FormattedMessage id="ui-plugin-find-license.selectLicense">
      {label => (
        <Modal
          ref={theModalRef}
          contentClass={css.modalContent}
          dismissible
          enforceFocus={false}
          id="plugin-find-license-modal"
          label={label}
          onClose={onClose}
          open={open}
          size="large"
        >
          <Container
            {...props}
            onSelectRow={selectLicense}
          />
        </Modal>
      )}
    </FormattedMessage>
  );
};

LicenseSearchModal.propTypes = {
  dataKey: PropTypes.string,
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onLicenseSelected: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }),
};

export default LicenseSearchModal;
