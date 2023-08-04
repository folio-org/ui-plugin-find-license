import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import {
  Accordion,
  Checkbox,
  mockKintComponents,
  mockErmComponents,
  Selection,
  SelectionList,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import { activeFilters, data } from './testResources';
import translationsProperties from '../../test/helpers';
import Filters from './Filters';

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  ...mockKintComponents,
  CustomPropertiesFilter: () => <div>CustomPropertiesFilter</div>,
}));

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents,
  OrganizationSelection: () => <div>OrganizationSelection</div>,
  DateFilter: () => <div>DateFilter</div>,
}));

const stateMock = jest.fn();

const filterHandlers = {
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
  state: stateMock
};

describe('Filters', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Filters
          activeFilters={activeFilters}
          data={data}
          filterHandlers={filterHandlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the CustomPropertiesFilter component', () => {
    const { getByText } = renderComponent;
    expect(getByText('CustomPropertiesFilter')).toBeInTheDocument();
  });

  test('renders the OrganizationSelection component', () => {
    const { getByText } = renderComponent;
    expect(getByText('OrganizationSelection')).toBeInTheDocument();
  });

  test('renders DateFilter components', () => {
    const { queryAllByText } = renderComponent;
    expect(queryAllByText('DateFilter').length).toEqual(2);
  });

  test('renders the Status Accordion', async () => {
    await Accordion('Status').is({ open: true });
  });

  test('renders Status Checkboxs', async () => {
    await Checkbox({ id: 'clickable-filter-status-active' }).exists();
    await Checkbox({ id: 'clickable-filter-status-expired' }).exists();
    await Checkbox({ id: 'clickable-filter-status-in-negotiation' }).exists();
    await Checkbox({ id: 'clickable-filter-status-not-yet-active' }).exists();
    await Checkbox({ id: 'clickable-filter-status-rejected' }).exists();
  });

  test('renders Type Checkboxs', async () => {
    await Checkbox({ id: 'clickable-filter-type-alliance' }).exists();
    await Checkbox({ id: 'clickable-filter-type-consortial' }).exists();
    await Checkbox({ id: 'clickable-filter-type-local' }).exists();
    await Checkbox({ id: 'clickable-filter-type-national' }).exists();
  });

  let index = 1;
  const testFilterCheckbox = (field, value) => (
    test(`clicking the ${value} checkbox`, async () => {
      await waitFor(async () => {
        await Checkbox({ id: `clickable-filter-${field}-${value}` }).click();
      });

      await waitFor(() => {
        expect(stateMock.mock.calls.length).toEqual(index);
      });

      index++;
    })
  );

  testFilterCheckbox('status', 'active');
  testFilterCheckbox('status', 'expired');
  testFilterCheckbox('status', 'in-negotiation');
  testFilterCheckbox('status', 'not-yet-active');
  testFilterCheckbox('status', 'rejected');

  testFilterCheckbox('type', 'alliance');
  testFilterCheckbox('type', 'consortial');
  testFilterCheckbox('type', 'local');
  testFilterCheckbox('type', 'national');

  test('renders the Type Accordion', async () => {
    await Accordion('Type').exists();
  });

  test('renders the Organization Accordion', async () => {
    await Accordion('Organization').exists();
  });

  test('renders the Organization role Accordion', async () => {
    await Accordion('Organization role').exists();
  });

  test('renders the Tags Accordion', async () => {
    await Accordion('Tags').exists();
  });

  it('choosing organizations role option', async () => {
    await Selection().exists();
    await waitFor(async () => {
      await Selection().open();
    });
    await SelectionList({ optionCount: 1 }).exists();
  });
});
