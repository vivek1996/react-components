import { history } from './history';

export const session = {
    remove,
    handleAuthorization
}

function remove() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    history.push("/login");
}

function handleAuthorization(error) {
    let errorObj = error.response.data.error;
    if(errorObj.statusCode === 401 && errorObj.code === "AUTHORIZATION_REQUIRED") {
        remove();
    }

    return Promise.reject(error.response.data.error.message);
}