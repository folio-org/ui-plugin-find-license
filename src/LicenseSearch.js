import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import { Button, Icon } from '@folio/stripes/components';
import contains from 'dom-helpers/query/contains';
import Modal from './Modal';

const triggerId = 'find-license-trigger';
const LicenseSearch = (props) => {
  const {
    renderTrigger
  } = props;

  // Piggyback on the translations `ui-licenses` already sets up for now
  // The likelihood of anyone running ui-plugin-find-license and NOT ui-licenses seems very low.
  const addKey = useIntlKeyStore(state => state.addKey);
  addKey('ui-licenses');

  const modalRef = useRef();
  const modalTrigger = useRef();

  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);

    if (modalRef.current && modalTrigger.current && contains(modalRef.current, document.activeElement)) {
      modalTrigger.current.focus();
    }
  };

  const renderDefaultTrigger = () => {
    return (
      <Button
        buttonRef={modalTrigger}
        buttonStyle="primary noRightRadius"
        id={triggerId}
        onClick={openModal}
      >
        <Icon color="#fff" icon="search" />
      </Button>
    );
  };

  const renderTriggerButton = () => {
    return renderTrigger
      ? renderTrigger({
        id: triggerId,
        onClick: openModal,
        buttonRef: modalTrigger,
      })
      : renderDefaultTrigger();
  };

  return (
    <>
      {renderTriggerButton()}
      <Modal
        modalRef={modalRef}
        onClose={closeModal}
        open={open}
        {...props}
      />
    </>
  );
};

LicenseSearch.propTypes = {
  renderTrigger: PropTypes.func,
};

export default LicenseSearch;
