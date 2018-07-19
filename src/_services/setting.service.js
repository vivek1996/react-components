// import { authHeader } from '../_helpers';
import axios from 'axios'
import { API_ROOT } from './api-config';
import { session } from '../_helpers';

export const settingService = {
    getAll,
    update
};

function getAll() {
    let access_token = localStorage.getItem('access_token');
    return axios.get(`${API_ROOT}/Settings?access_token=${access_token}`)
    	.then(response => {
        return response.data;
      })
      .catch(error => {
			return session.handleAuthorization(error);
				// return [];
      });
}

function update(setting) {
    let access_token = localStorage.getItem('access_token');

    return axios.patch(`${API_ROOT}/Settings/${setting.id}?access_token=${access_token}`, setting)
    	.then(response => {
        return response.data;
    	})
    	.catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}