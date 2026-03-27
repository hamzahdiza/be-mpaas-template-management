/**
 * generalError - A generic error handling function that processes and presents error information to the user.
 *
 * @param {Object} options - Configuration object encapsulating various parameters required for error handling.
 * @param {Object} options.err - Error object containing details such as error code and HTTP status code.
 * @param {string} [options.event=''] - Event name to distinguish different error handling scenarios.
 * @param {Object} [options.param={}] - Additional parameters passed through to the error handling page or logic.
 * @param {boolean} [options.isSwipe=true] - Enables swipe animation by default.
 * @param {boolean} [options.isRefresh=false] - Specifies if a refresh action is needed, defaults to false.
 *
 * This function receives an error object as its primary parameter and invokes the `my.generalErrorFunc` interface,
 * passing along error details and configuration to the framework's error management mechanism. It is suited for centralized 
 * handling of various API request failures, business logic errors, etc., with customizable behaviors for error handling,
 * including swipe navigation and data refreshing options.
 */
export default function generalError({err, event = '', param = '', isSwipe, isRefresh = false}) {
  my.generalErrorFunc({
    errorCode: err.data.errorCode,
    isSwipe: isSwipe,
    event: event,
    param: param,
    isRefresh: isRefresh,
    isIntercept: err.isIntercept || false,
    errorHttpStatus: err.statusCode
  });
}
