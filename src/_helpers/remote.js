import { API_ROOT } from '../_services/api-config';

const querystring   = require('qs');
const access_token  = localStorage.getItem('access_token');

export const remote = (options, cb) => {
  let filterOptions = options.filter;
  let filter = {
    order: (filterOptions.orderBy) ? `${filterOptions.orderBy} ${(filterOptions.order) ? filterOptions.order : 'asc'}` : 'id asc',
    limit: (filterOptions.rowsPerPage) ? filterOptions.rowsPerPage : 10,
    skip: (filterOptions.page) ? filterOptions.page * ((filterOptions.rowsPerPage) ? filterOptions.rowsPerPage : 10) : 0,
    include: (filterOptions.include) ? filterOptions.include : [],
    fields: (filterOptions.fields) ? filterOptions.fields : [],
    where: (filterOptions.where) ? filterOptions.where : {},
  };

  let queryParams = {
    access_token: access_token,
    filter: filter
  }

  let countQueryParams = {
    access_token: access_token,
    where: filter.where
  }
  
  fetch(`${API_ROOT}${options.url}/count?${querystring.stringify(countQueryParams)}`)
    .then(response => response.json())
    .then(data => {
      if(data.count) {
        fetch(`${API_ROOT}${options.url}?${querystring.stringify(queryParams)}`)
        .then(response => response.json())
        .then(records => {
          cb({records: records, count: data.count});
        })
        .catch(error => console.error(error));
      } else {
        cb({records: [], count: data.count});
      }
    })
    .catch(error => console.error(error));
}