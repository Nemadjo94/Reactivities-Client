import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import { history } from '../..'; // this is for index file
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(undefined, error => { // axios intercepts the server response errors
    if (error.message === 'Network Error' && !error.response){
        toast.error('Network error - check your network connection!');
    }

    const {status, data, config} = error.response;

    if (status === 404){
        history.push('/notfound');
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')){
        history.push('/notfound');
    }
    if (status === 500){
        toast.error("Server error - check the terminal for more info!");
    }
})

const responseBody = (response: AxiosResponse) => response.data; // 1. Save our response from api 

// Since we're testing on local host, simulate response time from api by adding sleep method
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = { // 2. This is how our http methods should look like
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}

const Activities = { // 3. Here we implement http methods
    list: (): Promise<IActivity[]> => requests.get('/activities'), // 5. Promise<IActivity[]> Because we use TS, we should specify what should our promise return
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`/activities/${id}`)
}

export default{ // 4. Export our activities so we have access from our components
    Activities
}