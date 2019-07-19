import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';

import {
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

export default class View extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    contentRef: PropTypes.object,
    data: PropTypes.object,
    onNeedMoreData: PropTypes.func,
    onSelectRow: PropTypes.func,
    queryGetter: PropTypes.func,
    querySetter: PropTypes.func,
    searchString: PropTypes.string,
    source: PropTypes.object,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    data: {},
    searchString: '',
    visibleColumns: ['name', 'type', 'status', 'startDate', 'endDate'],
  }

  state = {
    filterPaneIsVisible: true,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-plugin-find-license.prop.name" />,
    type: <FormattedMessage id="ui-plugin-find-license.prop.type" />,
    status: <FormattedMessage id="ui-plugin-find-license.prop.status" />,
    startDate: <FormattedMessage id="ui-plugin-find-license.prop.startDate" />,
    endDate: <FormattedMessage id="ui-plugin-find-license.prop.endDate" />
  }

  columnWidths = {
    name: 300,
    type: 150,
    status: 150,
    startDate: 150,
    endDate: 150
  }

  formatter = {
    type: ({ type }) => type && type.label,
    status: ({ status }) => status && status.label,
    startDate: ({ startDate }) => (startDate ? <FormattedDate value={startDate} /> : ''),
    endDate: license => <LicenseEndDate license={license} />,
  }

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;

    return (
      <div
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[
          rowData.name,
          this.formatter.type(rowData),
          this.formatter.status(rowData),
        ].join('...')}
        key={`row-${rowIndex}`}
        role="row"
        {...rowProps}
      >
        {cells}
      </div>
    );
  }

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return 'no source yet';
    }

    return (
      <div data-test-licenses-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  }

  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
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
                  visible={filterPaneIsVisible}
                  aria-label={`${hideOrShowMessage}...s${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderResultsPaneSubtitle = (source) => {
    if (source && source.loaded()) {
      const count = source ? source.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  render() {
    const {
      contentRef,
      data,
      onNeedMoreData,
      onSelectRow,
      queryGetter,
      querySetter,
      source,
      visibleColumns,
    } = this.props;

    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';

    return (
      <div data-test-licenses ref={contentRef}>
        <SearchAndSortQuery
          initialFilterState={{ status: ['Active'] }}
          initialSortState={{ sort: 'name' }}
          initialSearchState={{ query: '' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
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
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="22%"
                      onClose={this.toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        {/* TODO: Use forthcoming <SearchGroup> or similar component */}
                        <div className={css.searchGroupWrap}>
                          <FormattedMessage id="ui-plugin-find-license.searchInputLabel">
                            { ariaLabel => (
                              <SearchField
                                aria-label={ariaLabel}
                                autoFocus
                                className={css.searchField}
                                data-test-license-search-input
                                id="input-license-search"
                                inputRef={this.searchField}
                                marginBottom0
                                name="query"
                                onChange={getSearchHandlers().query}
                                onClear={() => {
                                  getSearchHandlers().clear();
                                  // TODO: Add way to trigger search automatically
                                  // onSubmitSearch();
                                }}
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
                            id="clickable-reset-all"
                            disabled={disableReset()}
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
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    padContent={false}
                    paneTitle={<FormattedMessage id="ui-plugin-find-license.licenses" />}
                    paneSub={this.renderResultsPaneSubtitle(source)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={data.licenses}
                      formatter={this.formatter}
                      id="list-licenses"
                      isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={onSelectRow}
                      rowFormatter={this.rowFormatter}
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
  }
}
