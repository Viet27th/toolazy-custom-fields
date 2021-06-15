import BaseService from "./base.service";
import {AppConfig} from "../config";

class CommonService extends BaseService {
  constructor() {
    super();
  }

  checkPluginIsActive(data) {
    return this.axiosInstance.post(`${AppConfig.apiUrl}/check-plugin-active`, data);
  }

  /**
   * Get all the post types existing in Wordpress project as Post/Page/Product, etc.
   * 
   * @returns 
   */
  getPostTypes() {
    return this.axiosInstance.get(`${AppConfig.apiUrl}/get-post-types`);
  }

}

export default new CommonService();
