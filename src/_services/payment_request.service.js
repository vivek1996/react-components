import { authHeader } from '../_helpers';
import axios from 'axios'
import { API_ROOT } from './api-config';

export const paymentRequestService = {
    getAll,
    getById,
    update,
    delete: _delete
};

function getAll() {
    let access_token = localStorage.getItem('access_token');
    return axios.get(`${API_ROOT}/PaymentRequests?filter=%7B%22include%22%3A%22user%22%7D&access_token=${access_token}`)
    .then(response => {
        return response.data;
      })
      .catch(error => {
        return Promise.reject(error.response.data.error.message);
      });
}

function getById(id) {
    let access_token = localStorage.getItem('access_token');
    return axios.get(`${API_ROOT}/PaymentRequests/${id}?access_token=${access_token}`)
    .then(response => {
        return response.data;
      })
      .catch(error => {
        return Promise.reject(error.response.data.error.message);
      });
}

function update(paymentRequest) {
    let access_token = localStorage.getItem('access_token');

    return axios.patch(`${API_ROOT}/PaymentRequests/${paymentRequest.id}?access_token=${access_token}`, paymentRequest)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        return Promise.reject(error.response.data.error.message);
    });
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch('/users/' + id, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    if (!response.ok) { 
        return Promise.reject(response.statusText);
    }

    return response.json();
}