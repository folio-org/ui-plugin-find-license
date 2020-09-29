import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import faker from 'faker';
import spies from 'chai-spies';

import setupApplication, { mount } from '../helpers/helpers';
import PluginHarness from '../helpers/PluginHarness';
import FindLicenseInteractor from '../interactors/findLicense';

chai.use(spies);
const { expect, spy } = chai;

const onLicenseSelected = spy();

const activeStatusLicensesCount = 1;
const activeStatus = {
  status: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Status', internal: true },
    label: 'Active',
    value: 'active',
  }
};

const inNegotiationStatusLicensesCount = 2;
const inNegotiationStatus = {
  status: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Status', internal: true },
    label: 'In negotiation',
    value: 'in_negotiation'
  }
};

const notYetActiveLicensesCount = 3;
const notYetActiveStatus = {
  status: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Status', internal: true },
    label: 'Not yet active',
    value: 'not_yet_active',
  }
};

const rejectedLicensesCount = 1;
const rejectedStatus = {
  status: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Status', internal: true },
    label: 'Rejected',
    value: 'rejected',
  }
};

const expiredLicensesCount = 1;
const expiredStatus = {
  status: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Status', internal: true },
    label: 'Expired',
    value: 'expired',
  }
};

const localTypeLicensesCount = 2;
const localType = {
  type: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Type', internal: false },
    label: 'Local',
    value: 'local',
  }
};

const consortialTypeLicensesCount = 3;
const consortialType = {
  type: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Type', internal: false },
    label: 'Consortial',
    value: 'consortial',
  }
};

const nationalTypeLicensesCount = 4;
const nationalType = {
  type: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Type', internal: false },
    label: 'National',
    value: 'national',
  }
};

const allianceTypeLicensesCount = 5;
const allianceType = {
  type: {
    id: faker.random.uuid(),
    owner: { id: faker.random.uuid(), desc: 'License.Type', internal: false },
    label: 'Alliance',
    value: 'alliance',
  }
};

describe('UI-plugin-find-license', function () {
  const findLicense = new FindLicenseInteractor();
  setupApplication();

  describe('plugin', function () {
    beforeEach(async function () {
      await mount(
        <PluginHarness
          onLicenseSelected={onLicenseSelected}
        />
      );
    });

    it('renders trigger button', function () {
      expect(findLicense.button.isPresent).to.be.true;
    });

    describe('clicking the trigger button', function () {
      beforeEach(async function () {
        await this.server.createList('license', activeStatusLicensesCount, activeStatus);
        await this.server.createList('license', inNegotiationStatusLicensesCount, inNegotiationStatus);
        await this.server.createList('license', notYetActiveLicensesCount, notYetActiveStatus);
        await this.server.createList('license', rejectedLicensesCount, rejectedStatus);
        await this.server.createList('license', expiredLicensesCount, expiredStatus);
        await this.server.createList('license', localTypeLicensesCount, localType);
        await this.server.createList('license', consortialTypeLicensesCount, consortialType);
        await this.server.createList('license', nationalTypeLicensesCount, nationalType);
        await this.server.createList('license', allianceTypeLicensesCount, allianceType);
        await findLicense.button.click();
      });

      describe('should', function () {
        it('open a modal', function () {
          expect(findLicense.modal.isPresent).to.be.true;
        });

        it('displays licenses list', function () {
          expect(findLicense.modal.instances().length).to.equal(activeStatusLicensesCount);
        });

        it('render the status filter', function () {
          expect(findLicense.modal.isStatusFilterPresent).to.be.true;
        });

        it('render the type filter', function () {
          expect(findLicense.modal.isTypeFilterPresent).to.be.true;
        });

        it('render the organizations filter', function () {
          expect(findLicense.modal.isOrgsFilterPresent).to.be.true;
        });

        it('render the organizations role filter', function () {
          expect(findLicense.modal.isOrgsRoleFilterPresent).to.be.true;
        });

        describe('selecting a license', function () {
          beforeEach(async function () {
            await findLicense.button.click();
            await findLicense.modal.instances(0).click();
          });

          it('hides the modal', function () {
            expect(findLicense.modal.isPresent).to.be.false;
          });

          it('calls the onLicenseSelected callback', function () {
            expect(onLicenseSelected).to.have.been.called();
          });
        });

        describe('clicking the close button', function () {
          beforeEach(async function () {
            await findLicense.button.click();
            await findLicense.closeButton.click();
          });

          it('hides the modal', function () {
            expect(findLicense.modal.isPresent).to.be.false;
          });
        });

        describe('reset all filters', function () {
          beforeEach(async function () {
            await findLicense.button.click();
            await findLicense.clearButton.click();
          });

          describe('selecting in negotiation filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickInNegotiationFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(inNegotiationStatusLicensesCount);
            });
          });

          describe('selecting not yet active filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickNotYetActiveFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(notYetActiveLicensesCount);
            });
          });

          describe('selecting active status filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickActiveFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(activeStatusLicensesCount);
            });
          });

          describe('selecting rejected status filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickRejectedFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(rejectedLicensesCount);
            });
          });

          describe('selecting expired filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickExpiredFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(expiredLicensesCount);
            });
          });

          describe('selecting local filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickLocalTypeFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(localTypeLicensesCount);
            });
          });

          describe('selecting consortial filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickConsortialFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(consortialTypeLicensesCount);
            });
          });

          describe('selecting national filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickNationalFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(nationalTypeLicensesCount);
            });
          });

          describe('selecting alliance filter', function () {
            beforeEach(async function () {
              await findLicense.modal.clickAllianceFilter();
            });

            it('renders the expected number of licenses', function () {
              expect(findLicense.modal.instances().length).to.equal(allianceTypeLicensesCount);
            });
          });
        });

        describe('filling in the searchField', function () {
          beforeEach(async function () {
            await findLicense.button.click();
            await findLicense.modal.searchField.fill('a');
          });

          it('enables the reset button', function () {
            expect(findLicense.modal.resetButton.isEnabled).to.be.true;
          });

          it('enables the search button', function () {
            expect(findLicense.modal.searchButton.isEnabled).to.be.true;
          });
        });
      });
    });
  });
});
