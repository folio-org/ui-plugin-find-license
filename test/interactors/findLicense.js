import {
  interactor,
  scoped,
  collection,
  clickable,
  fillable,
  is,
  isPresent,
} from '@bigtest/interactor';

import css from '../../src/LicenseSearch/LicenseSearch.css';

@interactor class SearchField {
  static defaultScope = '[data-test-license-search-input]';
  fill = fillable();
}

@interactor class PluginModalInteractor {
  isStatusFilterPresent = isPresent('#accordion-toggle-button-filter-accordion-status')
  isTypeFilterPresent = isPresent('#accordion-toggle-button-filter-accordion-type')
  isOrgsFilterPresent = isPresent('#accordion-toggle-button-organizations-filter');
  isOrgsRoleFilterPresent = isPresent('#accordion-toggle-button-organization-role-filter');

  clickNotYetActiveFilter = clickable('#clickable-filter-status-not-yet-active');
  clickActiveFilter = clickable('#clickable-filter-status-active');
  clickRejectedFilter = clickable('#clickable-filter-status-rejected');
  clickInNegotiationFilter = clickable('#clickable-filter-status-in-negotiation');
  clickExpiredFilter = clickable('#clickable-filter-status-expired');

  clickLocalTypeFilter = clickable('#clickable-filter-type-local');
  clickConsortialFilter = clickable('#clickable-filter-type-consortial');
  clickNationalFilter = clickable('#clickable-filter-type-national');
  clickAllianceFilter = clickable('#clickable-filter-type-alliance');

  instances = collection('[role="rowgroup"] [role="row"]', {
    click: clickable('[role=gridcell]'),
  });

  resetButton = scoped('#clickable-reset-all', {
    isEnabled: is(':not([disabled])'),
    click: clickable()
  });

  searchField = scoped('[data-test-license-search-input]', SearchField);
  searchButton = scoped('#clickable-search-licenses', {
    click: clickable(),
    isEnabled: is(':not([disabled])'),
  });
}

@interactor class FindLicenseInteractor {
  button = scoped('[data-test-plugin-license-button]', {
    click: clickable(),
  });

  closeButton = scoped('#plugin-find-license-modal-close-button', {
    click: clickable(),
  });

  clearButton = scoped('[data-test-clear-button]', {
    click: clickable(),
  });

  modal = new PluginModalInteractor(`.${css.modalContent}`);
}

export default FindLicenseInteractor;
