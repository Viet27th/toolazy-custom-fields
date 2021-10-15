/**
 * References:
 * 
 * *How to use "Nonce" in Wordpress:
 * https://stackoverflow.com/questions/42179869/not-getting-wordpress-nonce-to-work-with-wp-rest-api-
 * https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/
 * https://codex.wordpress.org/WordPress_Nonces
 */

import axios from "axios";
import {CommonUtilities} from "../utilities";

class BaseService {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 20000, // 20s
      headers: {
        "X-WP-Nonce": CommonUtilities.GetSyncScriptParams().nonce
      },
    });
    // Add a request interceptor
    this.axiosInstance.interceptors.request.use(async (config) => {
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    // Add a response interceptor
    this.axiosInstance.interceptors.response.use((response) => {
      return response.data;
    }, function (error) {
      return Promise.reject(error.response.data); // error.response.data is "body" of an error response
    });

  }
}

export default BaseService;
