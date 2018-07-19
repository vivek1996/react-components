// import { authHeader } from '../_helpers';
import axios from 'axios'
import { API_ROOT } from './api-config';
import { session } from '../_helpers';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    create,
    update,
    active,
    inactive,
    resetPassword,
    getTransactions,
    getPaymentRequests,
    countTransactions,
    countPaymentRequests
};

function logout() {
	session.remove();
}

function login(username, password) {
    return axios.post(`${API_ROOT}/UserProfiles/login?include=user`, { username: username, password: password })
    	.then(response => {
        let data = response.data;
        let user = data.user;
        // login successful if there's a jwt token in the response
        if (data && data.id) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('access_token', data.id);
            localStorage.setItem('user', JSON.stringify(user));
        }

        return user;
      })
      .catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
      });
}

function getAll() {
    let access_token = localStorage.getItem('access_token');
    return axios.get(`${API_ROOT}/UserProfiles?access_token=${access_token}`)
    	.then(response => {
        return response.data;
      })
      .catch(error => {
				return session.handleAuthorization(error);
      });
}

function getById(id) {
    let access_token = localStorage.getItem('access_token');
    return axios.get(`${API_ROOT}/UserProfiles/${id}?access_token=${access_token}`)
    	.then(response => {
        return response.data;
      })
      .catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
      });
}

function register(user) {
    let access_token = localStorage.getItem('access_token');

    return axios.post(`${API_ROOT}/UserProfiles?access_token=${access_token}`, user)
    	.then(response => {
        return response;
      })
      .catch(error => {
        return session.handleAuthorization(error);
        // return Promise.reject(error.response.data.error.message);
      });
}

function create(user) {
    let access_token = localStorage.getItem('access_token');

    return axios.post(`${API_ROOT}/UserProfiles?access_token=${access_token}`, user)
    	.then(response => {
        console.log("response", response);
        return response;
   		})
    	.catch(error => {
            return session.handleAuthorization(error);
            // return "";
            // return Promise.reject(error.response.data.error.message);
    	});
}

function update(user) {
    let access_token = localStorage.getItem('access_token');

    // return this.http.patch(this.baseUrl + '/UserProfiles/' + user.id + '?access_token=' + this.tokenId, user).map((response: Response) => response.json());
    return axios.patch(`${API_ROOT}/UserProfiles/${user.id}?access_token=${access_token}`, user)
    	.then(response => {
            return response.data;
    	})
    	.catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}

function resetPassword(user) {
    let access_token = localStorage.getItem('access_token');

    return axios.post(`${API_ROOT}/UserProfiles/update-password/${user.id}?access_token=${access_token}`, user)
    	.then(response => {
        return response.data;
   		})
    	.catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}

function active(id) {
    let access_token = localStorage.getItem('access_token');

    return axios.post(`${API_ROOT}/UserProfiles/active/${id}?access_token=${access_token}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}

function inactive(id) {
    let access_token = localStorage.getItem('access_token');

    return axios.post(`${API_ROOT}/UserProfiles/inactive/${id}?access_token=${access_token}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}

function getTransactions(id) {
    let access_token = localStorage.getItem('access_token');

    return axios.get(`${API_ROOT}/UserProfiles/${id}/transactions?access_token=${access_token}`)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}

function getPaymentRequests(id) {
    let access_token = localStorage.getItem('access_token');

    return axios.get(`${API_ROOT}/UserProfiles/${id}/paymentRequests?access_token=${access_token}`)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}

function countTransactions(id) {
    let access_token = localStorage.getItem('access_token');

    return axios.get(`${API_ROOT}/UserProfiles/${id}/transactions/count?access_token=${access_token}`)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}

function countPaymentRequests(id) {
    let access_token = localStorage.getItem('access_token');

    return axios.get(`${API_ROOT}/UserProfiles/${id}/paymentRequests/count?access_token=${access_token}`)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        // return Promise.reject(error.response.data.error.message);
        return session.handleAuthorization(error);
    });
}