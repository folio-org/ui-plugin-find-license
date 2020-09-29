import React from 'react';
import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class PluginHarness extends React.Component {
  static propTypes = {
    onLicenseSelected: PropTypes.func,
  }

  render() {
    return (
      <Pluggable
        aria-haspopup="true"
        dataKey="licenses"
        id="clickable-find-license"
        marginTop0
        onLicenseSelected={this.props.onLicenseSelected}
        renderTrigger={(props) => {
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonStyle': 'primary',
            'id': 'find-license-btn',
            'name': 'dummy',
            'onClick': props.onClick,
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
        {...this.props}
      />
    );
  }
}

export default PluginHarness;
