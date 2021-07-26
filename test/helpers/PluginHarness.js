import React from 'react';
import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

const PluginHarness = ({ onLicenseSelected = () => { }, ...rest }) => {
  return (
    <Pluggable
      aria-haspopup="true"
      dataKey="licenses"
      id="clickable-find-license"
      marginTop0
      onLicenseSelected={onLicenseSelected}
      renderTrigger={(triggerProps) => {
        const buttonProps = {
          'aria-haspopup': 'true',
          'buttonStyle': 'primary',
          'id': 'find-license-btn',
          'name': 'dummy',
          'onClick': triggerProps.onClick,
          'marginBottom0': true
        };

        return (
          <Button
            data-test-plugin-license-button
            {...buttonProps}
          >
            <FormattedMessage id="ui-plugin-find-licenses.selectLicense" />
          </Button>
        );
      }}
      searchButtonStyle="link"
      searchLabel="Look up licenses"
      type="find-license"
      {...rest}
    />
  )
};

export default PluginHarness;
