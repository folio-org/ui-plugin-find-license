
import { get, isEmpty } from 'lodash';
import parseQueryString from './util';

const getItems = (schema, request, recordName) => {
  const queryString = request.url.split('?')[1];
  const params = parseQueryString(queryString);
  let { filters } = params;

  // when there is only one filter and its not an array
  if (filters && !isEmpty(filters) && !Array.isArray(filters)) filters = [filters];

  // returns a flattened array of { name, value } pairs of filter name and its value
  const parsed = filters && filters.map((filter) => {
    return filter.split('||').map(f => {
      const [name, value] = f.split('==');
      return { name, value };
    });
  }).flat();

  let results;
  if (parsed) {
    results = schema[recordName]?.where(record => {
      return parsed.reduce((acc, { name, value }) => {
        return acc || get(record, name) === value;
      }, false);
    }).models ?? [];
  } else {
    results = schema[recordName].all().models;
  }

  return { results, totalRecords: results?.length ?? 0 };
};

export default function config() {
  this.get('/licenses/licenses', (schema, request) => {
    return getItems(schema, request, 'licenses');
  });

  this.get('/licenses/org', () => []);

  this.get('/licenses/custprops', () => []);

  this.get('/tags', { tags: [] });

  this.get('/licenses/refdata/License/status', () => {
    return [
      {
        'id':'2c91809b74d7849d0174d7872ad70004',
        'value':'in_negotiation',
        'label':'In negotiation',
        'owner':{
          'id':'2c91809b74d7849d0174d7872acd0003',
          'desc':'License.Status',
          'internal':true
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872ae00005',
        'value':'not_yet_active',
        'label':'Not yet active',
        'owner':{
          'id':'2c91809b74d7849d0174d7872acd0003',
          'desc':'License.Status',
          'internal':true
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872ae70006',
        'value':'active',
        'label':'Active',
        'owner':{
          'id':'2c91809b74d7849d0174d7872acd0003',
          'desc':'License.Status',
          'internal':true
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872aed0007',
        'value':'rejected',
        'label':'Rejected',
        'owner':{
          'id':'2c91809b74d7849d0174d7872acd0003',
          'desc':'License.Status',
          'internal':true
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872af40008',
        'value':'expired',
        'label':'Expired',
        'owner':{
          'id':'2c91809b74d7849d0174d7872acd0003',
          'desc':'License.Status',
          'internal':true
        }
      }
    ];
  });

  this.get('/licenses/refdata/License/type', () => {
    return [
      {
        'id':'2c91809b74d7849d0174d7872b1d000f',
        'value':'local',
        'label':'Local',
        'owner':{
          'id':'2c91809b74d7849d0174d7872b19000e',
          'desc':'License.Type',
          'internal':false
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872b240010',
        'value':'consortial',
        'label':'Consortial',
        'owner':{
          'id':'2c91809b74d7849d0174d7872b19000e',
          'desc':'License.Type',
          'internal':false
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872b2b0011',
        'value':'national',
        'label':'National',
        'owner':{
          'id':'2c91809b74d7849d0174d7872b19000e',
          'desc':'License.Type',
          'internal':false
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872b310012',
        'value':'alliance',
        'label':'Alliance',
        'owner':{
          'id':'2c91809b74d7849d0174d7872b19000e',
          'desc':'License.Type',
          'internal':false
        }
      }
    ];
  });

  this.get('/licenses/refdata/LicenseOrg/role', () => {
    return [
      {
        'id':'2c91809b74d7849d0174d7872afe000a',
        'value':'licensor',
        'label':'Licensor',
        'owner':{
          'id':'2c91809b74d7849d0174d7872afb0009',
          'desc':'LicenseOrg.Role',
          'internal':true
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872b05000b',
        'value':'licensee',
        'label':'Licensee',
        'owner':{
          'id':'2c91809b74d7849d0174d7872afb0009',
          'desc':'LicenseOrg.Role',
          'internal':true
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872b0c000c',
        'value':'consortium',
        'label':'Consortium',
        'owner':{
          'id':'2c91809b74d7849d0174d7872afb0009',
          'desc':'LicenseOrg.Role',
          'internal':true
        }
      },
      {
        'id':'2c91809b74d7849d0174d7872b12000d',
        'value':'consortium_administrator',
        'label':'Consortium Administrator',
        'owner':{
          'id':'2c91809b74d7849d0174d7872afb0009',
          'desc':'LicenseOrg.Role',
          'internal':true
        }
      }
    ];
  });
}
