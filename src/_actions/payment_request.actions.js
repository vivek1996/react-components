import { paymentRequestConstants } from '../_constants';
import { paymentRequestService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const paymentRequestActions = {
    update,
    getAll,
    delete: _delete
};

function update(paymentRequest) {
    return dispatch => {
        dispatch(request(paymentRequest));

        paymentRequestService.update(paymentRequest)
            .then(
                paymentRequest => { 
                    history.push('/payment_request/list');
                    dispatch(success());
                    
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(paymentRequest) { return { type: paymentRequestConstants.REGISTER_REQUEST, paymentRequest } }
    function success(paymentRequest) { return { type: paymentRequestConstants.REGISTER_SUCCESS, paymentRequest } }
    function failure(error) { return { type: paymentRequestConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        paymentRequestService.getAll()
            .then(
                paymentRequests => dispatch(success(paymentRequests)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: paymentRequestConstants.GETALL_REQUEST } }
    function success(paymentRequests) { return { type: paymentRequestConstants.GETALL_SUCCESS, paymentRequests } }
    function failure(error) { return { type: paymentRequestConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        paymentRequestService.delete(id)
            .then(
                paymentRequest => { 
                    dispatch(success(id));
                },
                error => {
                    dispatch(failure(id, error));
                }
            );
    };

    function request(id) { return { type: paymentRequestConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: paymentRequestConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: paymentRequestConstants.DELETE_FAILURE, id, error } }
}