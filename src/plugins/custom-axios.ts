import axios from 'axios'

const customAxios = axios

customAxios.defaults.withCredentials = true
customAxios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL

export default customAxios
