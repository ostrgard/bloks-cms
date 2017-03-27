import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}, ignoreCache) => new Promise((resolve, reject) => {
        const request = superagent[method](path);

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));

          /* Don't cache requests from server as this code will only run when cache needs to be refreshed */
          request.set('Pragma', 'no-cache');
        }

        if (ignoreCache) {
          request.set('Pragma', 'no-cache');
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body, headers } = {}) => err ? reject({err, body, headers}) : resolve({body, headers}));
      }));
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
