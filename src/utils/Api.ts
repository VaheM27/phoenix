import auth from '@react-native-firebase/auth';
import axios from 'axios';
// import config from '../config';

// const {BASE_URL} = config;

const apiClient = axios.create({
  baseURL: 'BASE_URL',
  responseType: 'json',
});

apiClient.interceptors.request.use(
  async request => {
    try {
      const {currentUser} = auth();
      if (currentUser) {
        const token = await currentUser.getIdToken(true);
        if (!request.headers) {
          request.headers = {};
        }
        request.headers.Authorization = 'Bearer ' + token;
      }
    } finally {
      return request;
    }
  },
  error => {
    console.error(error);
  },
);

// intercept response and handle global errors
apiClient.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.error(error); commented this out @egehanozsoy
    return Promise.reject(error);
  },
);

export const Api = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return {
    get: apiClient.get,
    post: apiClient.post,
    put: apiClient.put,
    delete: apiClient.delete,
    patch: apiClient.patch,
    apiClient: apiClient,
    source: source,
  };
};
