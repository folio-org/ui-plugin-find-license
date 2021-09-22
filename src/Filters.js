import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';
import { CustomPropertyFilters, DateFilter, OrganizationSelection } from '@folio/stripes-erm-components';

const FILTERS = [
  'status',
  'type',
];

export default function Filters({ activeFilters, data, filterHandlers }) {
  const intl = useIntl();

  const [filterState, setFilterState] = useState({
    status: [],
    type: [],
    tags: [],
  });


  useEffect(() => {
    const newState = {};
    FILTERS.forEach(filter => {
      const values = data[`${filter}Values`];
      if (values.length !== filterState[filter]?.length) {
        newState[filter] = values;
      }
    });

    if ((data?.tags?.length ?? 0) !== filterState.tags?.length) {
      newState.tags = data.tags.map(({ label }) => ({ value: label, label }));
    }

    if (Object.keys(newState).length) {
      setFilterState(prevState => ({ ...prevState, ...newState }));
    }
  }, [data, filterState]);

  const renderCheckboxFilter = (name, props) => {
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-plugin-find-license.prop.${name}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(name); }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={filterState[name]}
          name={name}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderOrganizationFilter = () => {
    const orgFilters = activeFilters.orgs || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={orgFilters.length > 0}
        header={FilterAccordionHeader}
        id="organizations-filter"
        label={<FormattedMessage id="ui-plugin-find-license.prop.organization" />}
        onClearFilter={() => {
          filterHandlers.state({
            ...activeFilters,
            role: [],
            orgs: [],
          });
        }}
        separator={false}
      >
        <OrganizationSelection
          input={{
            name: 'license-orgs-filter',
            onChange: value => filterHandlers.state({ ...activeFilters, orgs: [value] }),
            value: orgFilters[0] || '',
          }}
          path="licenses/org"
        />
      </Accordion>
    );
  };

  const renderOrganizationRoleFilter = () => {
    const roles = data.orgRoleValues;
    const dataOptions = roles.map(role => ({
      value: role.id,
      label: role.label,
    }));

    const roleFilters = activeFilters.role || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={roleFilters.length > 0}
        header={FilterAccordionHeader}
        id="organization-role-filter"
        label={<FormattedMessage id="ui-plugin-find-license.prop.organizationRole" />}
        onClearFilter={() => { filterHandlers.clearGroup('role'); }}
        separator={false}
      >
        <FormattedMessage id="ui-plugin-find-license.organizations.selectRole">
          {placeholder => (
            <Selection
              dataOptions={dataOptions}
              onChange={value => filterHandlers.state({ ...activeFilters, role: [value] })}
              placeholder={placeholder}
              value={roleFilters[0] || ''}
            />
          )}
        </FormattedMessage>
      </Accordion>
    );
  };

  const renderTagsFilter = () => {
    const tagFilters = activeFilters.tags || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={tagFilters.length > 0}
        header={FilterAccordionHeader}
        id="clickable-tags-filter"
        label={<FormattedMessage id="ui-plugin-find-license.prop.tags" />}
        onClearFilter={() => { filterHandlers.clearGroup('tags'); }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={filterState.tags || []}
          id="tags-filter"
          name="tags"
          onChange={e => filterHandlers.state({ ...activeFilters, tags: e.values })}
          selectedValues={tagFilters}
        />
      </Accordion>
    );
  };

  const renderStartDateFilter = () => {
    return <DateFilter
      activeFilters={activeFilters}
      filterHandlers={filterHandlers}
      name="startDate"
      resourceName={intl.formatMessage({ id: 'ui-plugin-find-license.licenses' }).toLowerCase()}
    />;
  };

  const renderEndDateFilter = () => {
    return (
      <DateFilter
        activeFilters={activeFilters}
        filterHandlers={filterHandlers}
        name="endDate"
        resourceName={intl.formatMessage({ id: 'ui-plugin-find-license.licenses' }).toLowerCase()}
      />
    );
  };

  const renderCustomPropertyFilters = () => {
    return <CustomPropertyFilters
      activeFilters={activeFilters}
      customProperties={data.terms || []}
      custPropName="term"
      filterHandlers={filterHandlers}
    />;
  };

  return (
    <AccordionSet>
      {renderCheckboxFilter('status')}
      {renderCheckboxFilter('type')}
      {renderOrganizationFilter()}
      {renderOrganizationRoleFilter()}
      {renderTagsFilter()}
      {renderStartDateFilter()}
      {renderEndDateFilter()}
      {renderCustomPropertyFilters()}
    </AccordionSet>
  );
}

Filters.propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired
  }),
};

Filters.defaultProps = {
  activeFilters: {
    status: [],
    type: [],
  }
};

