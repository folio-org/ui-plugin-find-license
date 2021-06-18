import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { getSASParams } from '@folio/stripes-erm-components';

import View from './View';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

export default class Container extends React.Component {
  static manifest = Object.freeze({
    licenses: {
      type: 'okapi',
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      limitParam: 'perPage',
      path: 'licenses/licenses',
      params: getSASParams({
        columnMap: {
          'Name': 'name',
          'Type': 'type',
          'Status': 'status',
          'Start Date': 'startDate',
          'End Date': 'endDate'
        },
        filterKeys: {
          agreementStatus: 'agreementStatus.value',
          orgs: 'orgs.org',
          role: 'orgs.role',
          tags: 'tags.value',
          type: 'type.value'
        },
        queryGetter: r => r.licenseSearchParams,
        searchKey: 'name,alternateNames.name,description',
      })
    },
    statusValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/status',
      shouldRefresh: () => false,
    },
    typeValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/type',
      shouldRefresh: () => false,
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'licenses/refdata/LicenseOrg/role',
      shouldRefresh: () => false,
    },
    tagsValues: {
      type: 'okapi',
      path: 'tags?limit=100',
      records: 'tags',
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
      shouldRefresh: () => false,
    },
    licenseSearchParams: {
      initialValue: {
        filters: 'status.Active',
        sort: 'name',
      }
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func.isRequired,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'licenses');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }

    this.props.mutator.licenseSearchParams.update({
      filters: 'status.Active'
    });
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  }

  querySetter = ({ nsValues, state }) => {
    if (/reset/.test(state.changeType)) {
      this.props.mutator.licenseSearchParams.replace(nsValues);
    } else {
      this.props.mutator.licenseSearchParams.update(nsValues);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'licenseSearchParams', {});
  }

  render() {
    const { onSelectRow, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'licenses');
    }

    return (
      <View
        data={{
          licenses: get(resources, 'licenses.records', []),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
          statusValues: get(resources, 'statusValues.records', []),
          typeValues: get(resources, 'typeValues.records', []),
          tagsValues: get(resources, 'tagsValues.records', []),
          terms: resources?.terms?.records ?? [],
        }}
        onNeedMoreData={this.handleNeedMoreData}
        onSelectRow={onSelectRow}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        source={this.source}
      />
    );
  }
}
