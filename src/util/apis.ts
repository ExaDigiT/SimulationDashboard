import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_PATH;
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem("exadigitAuthToken")}`,
};

export default axios;
