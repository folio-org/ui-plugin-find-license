const activeFilters = {
  'status': [
    'active'
  ]
};

const data = {
  'licenses': [{
    'id': '328c311b-8882-46ae-b3b6-2d702baeb692',
    'endDateSemantics': {
      'id': '2c91809d84577bc4018457838d7f0009',
      'value': 'implicit',
      'label': 'Implicit',
      'owner': {
        'id': '2c91809d84577bc4018457838d6d0006',
        'desc': 'License.EndDateSemantics',
        'internal': true
      }
    },
    'dateCreated': '2022-11-09T10:07:28Z',
    'customProperties': '{}',
    'contacts': '[]',
    'tags': '[]',
    'lastUpdated': '2022-11-09T10:07:28Z',
    'docs': '[]',
    'name': 'MR Test License 1',
    'status': {
      'id': '2c91809d84577bc4018457838d96000d',
      'value': 'active',
      'label': 'Active',
      'owner': {
        'id': '2c91809d84577bc4018457838d85000a',
        'desc': 'License.Status',
        'internal': true
      }
    },
    'supplementaryDocs': '[]',
    'openEnded': false,
    'amendments': '[]',
    'orgs': '[]',
    'type': {
      'id': '2c91809d84577bc4018457838dce0017',
      'value': 'local',
      'label': 'Local',
      'owner': {
        'id': '2c91809d84577bc4018457838dcb0016',
        'desc': 'License.Type',
        'internal': false
      }
    },
    'alternateNames': '[]'
  }],
  'orgRoleValues': [{
    'id': '2c91809d84577bc4018457838d670005',
    'value': 'licensor',
    'label': 'Licensor'
  }],
  'statusValues': [{
    'id': '2c91809d84577bc4018457838d96000d',
    'value': 'active',
    'label': 'Active'
  },
  {
    'id': '2c91809d84577bc4018457838da2000f',
    'value': 'expired',
    'label': 'Expired'
  },
  {
    'id': '2c91809d84577bc4018457838d88000b',
    'value': 'in_negotiation',
    'label': 'In negotiation'
  },
  {
    'id': '2c91809d84577bc4018457838d90000c',
    'value': 'not_yet_active',
    'label': 'Not yet active'
  },
  {
    'id': '2c91809d84577bc4018457838d9c000e',
    'value': 'rejected',
    'label': 'Rejected'
  }
  ],
  'typeValues': [{
    'id': '2c91809d84577bc4018457838ddf001a',
    'value': 'alliance',
    'label': 'Alliance'
  },
  {
    'id': '2c91809d84577bc4018457838dd30018',
    'value': 'consortial',
    'label': 'Consortial'
  },
  {
    'id': '2c91809d84577bc4018457838dce0017',
    'value': 'local',
    'label': 'Local'
  },
  {
    'id': '2c91809d84577bc4018457838dda0019',
    'value': 'national',
    'label': 'National'
  }
  ],
  'tags': [{
    'id': '0aa69140-14ff-4986-866f-b104d2f43ac1',
    'label': 'important',
    'metadata': {
      'createdDate': '2022-11-08T13:52:08.633+00:00'
    }
  },
  {
    'id': '9d74634c-5d29-48be-a558-a778435cb1c0',
    'label': 'urgent',
    'description': 'Requires urgent attention',
    'metadata': {
      'createdDate': '2022-11-08T13:52:08.640+00:00'
    }
  }
  ]
};

export { activeFilters, data };
