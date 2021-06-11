import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';
import { CustomPropertyFilters, DateFilter, OrganizationSelection } from '@folio/stripes-erm-components';

const FILTERS = [
  'status',
  'type',
];

export default class LicenseFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {}
  };

  state = {
    status: [],
    type: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    FILTERS.forEach(filter => {
      const values = props.data[`${filter}Values`] || [];
      if (values.length !== state[filter].length) {
        newState[filter] = values.map(({ label }) => ({ label, value: label }));
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderCheckboxFilter = (name, props) => {
    const { activeFilters, filterHandlers } = this.props;
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
          dataOptions={this.state[name]}
          name={name}
          onChange={(group) => { this.props.filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  }

  renderOrganizationFilter = () => {
    const { activeFilters } = this.props;
    const orgFilters = activeFilters.orgs || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={orgFilters.length > 0}
        header={FilterAccordionHeader}
        id="organizations-filter"
        label={<FormattedMessage id="ui-plugin-find-license.prop.organization" />}
        onClearFilter={() => {
          this.props.filterHandlers.state({
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
            onChange: value => this.props.filterHandlers.state({ ...activeFilters, orgs: [value] }),
            value: orgFilters[0] || '',
          }}
          path="licenses/org"
        />
      </Accordion>
    );
  }

  renderRoleLabel = () => {
    const roles = this.props.data.orgRoleValues || [];
    const dataOptions = roles.map(role => ({
      value: role.id,
      label: role.label,
    }));

    const { activeFilters } = this.props;
    const orgFilters = activeFilters.orgs || [];
    const roleFilters = activeFilters.role || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={roleFilters.length > 0}
        header={FilterAccordionHeader}
        id="organization-role-filter"
        label={<FormattedMessage id="ui-plugin-find-license.prop.organizationRole" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('role'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          disabled={orgFilters.length === 0}
          onChange={value => this.props.filterHandlers.state({ ...activeFilters, role: [value] })}
          value={roleFilters[0] || ''}
        />
      </Accordion>
    );
  }

  renderTagsFilter = () => {
    const { activeFilters, filterHandlers } = this.props;
    const tagFilters = activeFilters.tags || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={tagFilters.length > 0}
        header={FilterAccordionHeader}
        id="clickable-tags-filter"
        label={<FormattedMessage id="ui-licenses.tags" />}
        onClearFilter={() => { filterHandlers.clearGroup('tags'); }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={this.state.tags || []}
          id="tags-filter"
          name="tags"
          onChange={e => filterHandlers.state({ ...activeFilters, tags: e.values })}
          selectedValues={tagFilters}
        />
      </Accordion>
    );
  };

  renderStartDateFilter = () => {
    const { activeFilters, filterHandlers } = this.props;
    return <DateFilter
      activeFilters={activeFilters}
      filterHandlers={filterHandlers}
      name="startDate"
    />;
  }

 renderEndDateFilter = () => {
   const { activeFilters, filterHandlers } = this.props;
   return (
     <DateFilter
       activeFilters={activeFilters}
       filterHandlers={filterHandlers}
       name="endDate"
     />
   );
 };

  renderCustomPropertyFilters = () => {
    const { activeFilters } = this.props;
    return <CustomPropertyFilters
      activeFilters={activeFilters}
      customProperties={this.props.data.terms || []}
      custPropName="term"
      filterHandlers={this.props.filterHandlers}
    />;
  };

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('status')}
        {this.renderCheckboxFilter('type')}
        {this.renderOrganizationFilter()}
        {this.renderRoleLabel()}
        {this.renderTagsFilter()}
        {this.renderStartDateFilter()}
        {this.renderEndDateFilter()}
        {this.renderCustomPropertyFilters()}
      </AccordionSet>
    );
  }
}
