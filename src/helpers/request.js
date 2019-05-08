const API_ROOT = '';
import { appConstants } from './../constants';

let requestHeader = {
  "Content-Type": "application/json; charset=utf-8",
};

const handleError = (error) => {
  if(error instanceof Promise) {
    return error.then(data => { console.log("handleError data : ", data); return Promise.reject(data.error);})
  } else {
    return Promise.reject({message: window.error.request, error: error});
  }
};

export const request = {
  handleError: handleError,
  get: (url) => {
    const token  = appConstants.getToken();
    if(token) {
      requestHeader["Authorization"] = `Bearer ${token}`;
    }
    
    // console.log("requestHeader GET", requestHeader);
    return fetch(`${API_ROOT}/${url}`, {
      method: "GET",
      cache: "no-cache",
      headers: requestHeader,
    })
    // .then(response => response.json()); 
    .then(response => {
      // console.log("get Request Response : ", response);
      if (!response.ok) {
        if(!response.bodyUsed) {
          // return Promise.reject({message: response.statusText});
          const text = response.text(); // Parse it as text
          console.log("Get Response Text", text);
          try {
            console.log("Get In Try");
            if(text instanceof Promise) {
              return Promise.reject(text);
            } else {
              const data = JSON.parse(text); // Try to parse it as json
              return Promise.reject(data);
            }
          } catch (e) {
            console.log("Get In Catch");
            return Promise.reject({message: text});
          }
        } else {
          try {
            return Promise.reject(response.json());
          } catch (e) {
            return Promise.reject({message: response});
          }
        }
      }

      return response.json();
    }, request.handleError);
  },

  post: (url, data) => {
	  const token  = appConstants.getToken();
    if(token) {
      requestHeader["Authorization"] = `Bearer ${token}`;
    }
    
    // console.log("requestHeader POST", requestHeader);
    return fetch(`${API_ROOT}/${url}`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: requestHeader,
        // redirect: "follow", // manual, *follow, error
        // referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
      // console.log("Post Request Response : ", response);
      if (!response.ok) {
        try {
          return Promise.reject(response.json());
        } catch (e) {
          return Promise.reject({message: response});
        }
      }

      return response.json();
    }, request.handleError);
  },

  patch: (url, data) => {
	  const token  = appConstants.getToken();
    if(token) {
      requestHeader["Authorization"] = `Bearer ${token}`;
    }
    
    // console.log("requestHeader PATCH", requestHeader);
    return fetch(`${API_ROOT}/${url}`, {
        method: "PATCH", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: requestHeader,
        // redirect: "follow", // manual, *follow, error
        // referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
    .then(response => {
      // console.log("patch Request Response : ", response);
      if (!response.ok) {
        try {
          return Promise.reject(response.json());
        } catch (e) {
          return Promise.reject({message: response});
        }
      }

      return response.json();
    }, request.handleError);
  }
}