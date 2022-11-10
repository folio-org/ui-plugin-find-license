
import { renderWithIntl, mockErmComponents } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Pane, SearchField, MultiColumnList } from '@folio/stripes-testing';
import data from './testResources';
import translationsProperties from '../../test/helpers';
import View from './View';

jest.mock('../Filters', () => () => <div>Filters</div>);

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents,
  LicenseEndDate: () => <div>LicenseEndDate</div>,
}));

const onNeedMoreData = jest.fn();
const onSelectRow = jest.fn();
const queryGetter = jest.fn();
const querySetter = jest.fn();

const source = {
  'totalCount': () => {},
  'loaded': () => {},
  'pending': () => {},
  'failure': () => {},
  'failureMessage': () => {},
};

describe('View', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <View
          data={data}
          onNeedMoreData={onNeedMoreData}
          onSelectRow={onSelectRow}
          queryGetter={queryGetter}
          querySetter={querySetter}
          source={source}
          visibleColumns={['name', 'type', 'status', 'startDate', 'endDate']}

        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Filters component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Filters')).toBeInTheDocument();
  });

  test('renders the LicenseEndDate component', () => {
    const { getByText } = renderComponent;
    expect(getByText('LicenseEndDate')).toBeInTheDocument();
  });

  test('renders the expected Search and Filter Pane', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  test('renders the expected search field', async () => {
    await SearchField().has({ id: 'input-license-search' });
  });

  test('renders the expected MCL', async () => {
    await MultiColumnList('list-licenses').exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['Name', 'Type', 'Status', 'Start date', 'End date'] }).exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 5 }).exists();
  });
});
