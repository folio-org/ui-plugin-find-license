import { mockKintComponents, renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../test/helpers';
import LicenseSearch from './LicenseSearch';

jest.mock('../Modal', () => () => <div>Modal</div>);

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  ...mockKintComponents
}));

const renderTrigger = jest.fn();

describe('LicenseSearch', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <LicenseSearch
        renderTrigger={renderTrigger}
      />,
      translationsProperties
    );
  });

  test('renders the Modal component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Modal')).toBeInTheDocument();
  });

  test('should handle renderTrigger', () => {
    expect(renderTrigger).toHaveBeenCalled();
  });
});
