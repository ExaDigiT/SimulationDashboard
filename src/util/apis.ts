import axios from "axios";

axios.defaults.baseURL = "https://obsidian.ccs.ornl.gov/exadigit/api";
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem("exadigitAuthToken")}`,
};

export default axios;
