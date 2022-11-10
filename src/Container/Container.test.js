import { React } from 'react';

import {
  mockKintComponents,
  mockErmComponents,
  renderWithIntl
} from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../test/helpers';
import Container from './Container';

jest.mock('../View', () => () => <div>View</div>);

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  ...mockKintComponents
}));

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents
}));

const onSelectRow = jest.fn();

describe('Container', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Container
          onSelectRow={onSelectRow}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the View component', () => {
    const { getByText } = renderComponent;
    expect(getByText('View')).toBeInTheDocument();
  });

  test('should handle onSelectRow', () => {
    expect(onSelectRow).not.toHaveBeenCalled();
  });
});
