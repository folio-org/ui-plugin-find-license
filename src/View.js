import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  FormattedUTCDate,
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';

import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

import Filters from './Filters';

import css from './View.css';

const View = ({
  contentRef,
  data = {},
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  source,
  visibleColumns = ['name', 'type', 'status', 'startDate', 'endDate']
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const searchField = useRef();
  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const query = queryGetter() || {};
  const count = source ? source.totalCount() : 0;
  const sortOrder = query.sort || '';

  const columnMapping = {
    name: <FormattedMessage id="ui-plugin-find-license.prop.name" />,
    type: <FormattedMessage id="ui-plugin-find-license.prop.type" />,
    status: <FormattedMessage id="ui-plugin-find-license.prop.status" />,
    startDate: <FormattedMessage id="ui-plugin-find-license.prop.startDate" />,
    endDate: <FormattedMessage id="ui-plugin-find-license.prop.endDate" />
  };

  const columnWidths = {
    name: 300,
    type: 150,
    status: 150,
    startDate: 120,
    endDate: 120
  };

  const formatter = {
    type: ({ type }) => type?.label,
    status: ({ status }) => status?.label,
    startDate: ({ startDate }) => {
      if (startDate) return <FormattedUTCDate value={startDate} />;
      return '';
    },
    endDate: license => <LicenseEndDate license={license} renderNullIfEmpty />,
  };

  const rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;

    return (
      <button
        key={`row-${rowIndex}`}
        className={rowClass}
        data-label={[
          rowData.name,
          formatter.type(rowData),
          formatter.status(rowData),
        ].join('...')}
        type="button"
        {...rowProps}
      >
        {cells}
      </button>
    );
  };

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
  };

  const renderIsEmptyMessage = () => {
    if (!source) {
      return 'no source yet';
    }

    return (
      <div data-test-licenses-no-results-message>
        <NoResultsMessage
          filterPaneIsVisible
          searchTerm={query.query || ''}
          source={source}
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  const renderResultsFirstMenu = (filters) => {
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  aria-label={`${hideOrShowMessage}...s${appliedFiltersMessage}`}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                  onClick={toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const renderResultsPaneSubtitle = () => {
    if (source && source.loaded()) {
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };


  return (
    <div ref={contentRef} data-test-licenses>
      <SearchAndSortQuery
        initialFilterState={{ status: ['active'] }}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        setQueryOnMount
        syncToLocationSearch={false}
      >
        {
          ({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            onSort,
            getFilterHandlers,
            activeFilters,
            filterChanged,
            searchChanged,
            resetAll,
          }) => {
            const disableReset = () => (!filterChanged && !searchChanged);

            return (
              <Paneset id="licenses-paneset">
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="22%"
                    onClose={toggleFilterPane}
                    paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                  >
                    <form onSubmit={onSubmitSearch}>
                      {/* TODO: Use forthcoming <SearchGroup> or similar component */}
                      <div className={css.searchGroupWrap}>
                        <FormattedMessage id="ui-plugin-find-license.searchInputLabel">
                          {ariaLabel => (
                            <SearchField
                              aria-label={ariaLabel}
                              autoFocus
                              className={css.searchField}
                              data-test-license-search-input
                              id="input-license-search"
                              inputRef={searchField}
                              marginBottom0
                              name="query"
                              onChange={getSearchHandlers().query}
                              onClear={getSearchHandlers().reset}
                              value={searchValue.query}
                            />
                          )}
                        </FormattedMessage>
                        <Button
                          buttonStyle="primary"
                          disabled={!searchValue.query || searchValue.query === ''}
                          fullWidth
                          id="clickable-search-licenses"
                          marginBottom0
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <div className={css.resetButtonWrap}>
                        <Button
                          buttonStyle="none"
                          disabled={disableReset()}
                          id="clickable-reset-all"
                          onClick={resetAll}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                      </div>
                      <Filters
                        activeFilters={activeFilters.state}
                        data={data}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  appIcon={<AppIcon app="licenses" />}
                  defaultWidth="fill"
                  firstMenu={renderResultsFirstMenu(activeFilters)}
                  padContent={false}
                  paneSub={renderResultsPaneSubtitle()}
                  paneTitle={<FormattedMessage id="ui-plugin-find-license.licenses" />}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={columnMapping}
                    columnWidths={columnWidths}
                    contentData={data.licenses}
                    formatter={formatter}
                    id="list-licenses"
                    isEmptyMessage={renderIsEmptyMessage()}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    onRowClick={onSelectRow}
                    rowFormatter={rowFormatter}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={visibleColumns}
                  />
                </Pane>
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};


View.propTypes = {
  children: PropTypes.node,
  contentRef: PropTypes.object,
  data: PropTypes.object,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  source: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

export default View;
