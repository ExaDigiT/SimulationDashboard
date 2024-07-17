import axios from "axios";

axios.defaults.baseURL = import.meta.env.BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem("exadigitAuthToken")}`,
};

export default axios;
