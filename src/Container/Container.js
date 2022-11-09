import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { generateKiwtQueryParams, useRefdata } from '@k-int/stripes-kint-components';

import { useOkapiKy } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useInfiniteFetch, useTags } from '@folio/stripes-erm-components';

import View from '../View';

const RECORDS_PER_REQUEST = 100;

const LICENSES_ENDPOINT = 'licenses/licenses';

const [
  LICENSE_STATUS,
  LICENSE_TYPE,
  LICENSE_ORG_ROLE,
] = [
  'License.Status',
  'License.Type',
  'LicenseOrg.Role',
];

const Container = ({
  onSelectRow,
}) => {
  const ky = useOkapiKy();

  const { data: { tags = [] } = {} } = useTags();

  // We only need local session query here, use state
  const [query, setQuery] = useState({});
  const querySetter = ({ nsValues }) => {
    setQuery({ ...query, ...nsValues });
  };
  const queryGetter = () => query;

  const refdata = useRefdata({
    desc: [
      LICENSE_STATUS,
      LICENSE_TYPE,
      LICENSE_ORG_ROLE,
    ],
    endpoint: 'licenses/refdata'
  });

  const licensesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,alternateNames.name,description',
      filterKeys: {
        orgs: 'orgs.org',
        role: 'orgs.roles.role',
        status: 'status.value',
        tags: 'tags.value',
        type: 'type.value'
      },
      sortKeys: {
        status: 'status.label',
        type: 'type.label',
      },
      perPage: RECORDS_PER_REQUEST
    }, (query ?? {}))
  ), [query]);


  const {
    infiniteQueryObject: {
      error: licensesError,
      fetchNextPage: fetchNextLicensePage,
      isLoading: areLicensesLoading,
      isError: isLicensesError
    },
    results: licenses = [],
    total: licensesCount = 0
  } = useInfiniteFetch(
    ['ERM', 'Licenses', licensesQueryParams, LICENSES_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...licensesQueryParams, `offset=${pageParam}`];
      return ky.get(encodeURI(`${LICENSES_ENDPOINT}?${params?.join('&')}`)).json();
    }
  );

  return (
    <View
      data={{
        licenses,
        orgRoleValues: getRefdataValuesByDesc(refdata, LICENSE_ORG_ROLE),
        statusValues: getRefdataValuesByDesc(refdata, LICENSE_STATUS),
        typeValues: getRefdataValuesByDesc(refdata, LICENSE_TYPE),
        tags,
      }}
      onNeedMoreData={(_askAmount, index) => fetchNextLicensePage({ pageParam: index })}
      onSelectRow={onSelectRow}
      queryGetter={queryGetter}
      querySetter={querySetter}
      source={{ // Fake source from useQuery return values;
        totalCount: () => licensesCount,
        loaded: () => !areLicensesLoading,
        pending: () => areLicensesLoading,
        failure: () => isLicensesError,
        failureMessage: () => licensesError.message
      }}
    />
  );
};

Container.propTypes = {
  onSelectRow: PropTypes.func.isRequired,
};

export default Container;
