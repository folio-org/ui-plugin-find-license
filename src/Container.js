import React from 'react';
import PropTypes from 'prop-types';

import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { generateQueryParams } from '@folio/stripes-erm-components';

import View from './View';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;
const RECORDS_PER_REQUEST = 100;

export default class Container extends React.Component {
  static manifest = Object.freeze({
    licenses: {
      type: 'okapi',
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      limitParam: 'perPage',
      path: 'licenses/licenses',
      params: generateQueryParams({
        columnMap: {
          'Name': 'name',
          'Type': 'type',
          'Status': 'status',
          'Start Date': 'startDate',
          'End Date': 'endDate'
        },
        filterKeys: {
          agreementStatus: 'agreementStatus.value',
          org: 'orgs.org',
          role: 'orgs.roles.role',
          status: 'status.value',
          tags: 'tags.value',
          type: 'type.value'
        },
        searchKey: 'name,alternateNames.name,description',
        sortKeys: {
          status: 'status.value',
          type: 'type.value',
        },
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
      perRequest: RECORDS_PER_REQUEST,
      shouldRefresh: () => false,
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'licenses/refdata/LicenseOrg/role',
      shouldRefresh: () => false,
    },
    tags: {
      type: 'okapi',
      path: 'tags?limit=100',
      records: 'tags',
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
      shouldRefresh: () => false,
    },
    query: { initialValue: {} },
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

    this.props.mutator.query.update({
      filters: 'status.active'
    });
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  }

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  }

  queryGetter = () => {
    return this.props?.resources?.query ?? {};
  }

  render() {
    const { onSelectRow, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'licenses');
    }

    return (
      <View
        data={{
          licenses: resources?.licenses?.records ?? [],
          orgRoleValues: resources?.orgRoleValues?.records ?? [],
          statusValues: resources?.statusValues?.records ?? [],
          typeValues: resources?.typeValues?.records ?? [],
          tags: resources?.tags?.records ?? [],
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
