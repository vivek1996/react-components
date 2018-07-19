// import { authHeader } from '../_helpers';
import axios from 'axios'
import { API_ROOT } from './api-config';

export const reportService = {
    userEarning,
    monthlyTaskReport,
    userAnalytics,
    completedTask,
    modifiedTask,
    unreadableTask,
    unmodifiedTask,
    goldTask
};

function userEarning() {
    let access_token = localStorage.getItem('access_token');
    return axios.get(`${API_ROOT}/Reports/userEarning?access_token=${access_token}`)
    .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log("error", error);
        return Promise.reject(error.response.data.error.message);
      });
}

function monthlyTaskReport() {
    let access_token = localStorage.getItem('access_token');
    return axios.get(`${API_ROOT}/Reports/monthlyTaskReport?access_token=${access_token}`)
    .then(response => {
        return response.data;
      })
      .catch(error => {
        return Promise.reject(error.response.data.error.message);
      });
}

function userAnalytics(userId) {
  let access_token = localStorage.getItem('access_token');
  var apiUrl = `${API_ROOT}/Reports/analytics`;
  if(userId) {
    apiUrl = apiUrl + '/' + userId
  }
  return axios.get(apiUrl + `?access_token=${access_token}`)
  .then(response => {
      return response.data;
    })
    .catch(error => {
      return Promise.reject(error.response.data.error.message);
    });
}

function completedTask(userId) {
  let access_token = localStorage.getItem('access_token');
  var apiUrl = `${API_ROOT}/Reports/completedTask`;
  if(userId) {
    apiUrl = apiUrl + '/' + userId
  }
  return axios.get(apiUrl + `?access_token=${access_token}`)
  .then(response => {
      return response.data;
    })
    .catch(error => {
      return Promise.reject(error.response.data.error.message);
    });
}

function modifiedTask(userId) {
  let access_token = localStorage.getItem('access_token');
  var apiUrl = `${API_ROOT}/Reports/modifiedTask`;
  if(userId) {
    apiUrl = apiUrl + '/' + userId
  }
  return axios.get(apiUrl + `?access_token=${access_token}`)
  .then(response => {
      return response.data;
    })
    .catch(error => {
      return Promise.reject(error.response.data.error.message);
    });
}

function unmodifiedTask(userId) {
  let access_token = localStorage.getItem('access_token');
  var apiUrl = `${API_ROOT}/Reports/unmodifiedTask`;
  if(userId) {
    apiUrl = apiUrl + '/' + userId
  }
  return axios.get(apiUrl + `?access_token=${access_token}`)
  .then(response => {
      return response.data;
    })
    .catch(error => {
      return Promise.reject(error.response.data.error.message);
    });
}

function unreadableTask(userId) {
  let access_token = localStorage.getItem('access_token');
  var apiUrl = `${API_ROOT}/Reports/unreadableTask`;
  if(userId) {
    apiUrl = apiUrl + '/' + userId
  }
  return axios.get(apiUrl + `?access_token=${access_token}`)
  .then(response => {
      return response.data;
    })
    .catch(error => {
      return Promise.reject(error.response.data.error.message);
    });
}

function goldTask(userId) {
  let access_token = localStorage.getItem('access_token');
  var apiUrl = `${API_ROOT}/Reports/goldTask`;
  if(userId) {
    apiUrl = apiUrl + '/' + userId
  }
  return axios.get(apiUrl + `?access_token=${access_token}`)
  .then(response => {
      return response.data;
    })
    .catch(error => {
      return Promise.reject(error.response.data.error.message);
    });
}