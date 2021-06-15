import BaseService from "./base.service";
import {AppConfig} from "../config";

class CustomFieldService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Get all the custom fields of all post types.
   * 
   * @returns 
   */
  getAllCustomFields() {
    return this.axiosInstance.get(`${AppConfig.apiUrl}/get-all-custom-fields`);
  }

  /**
   * Get the supported custom field type as Input, checkbox, text area, radio, select, file, ...
   * 
   * @returns 
   */
  getCustomFieldTypes() {
    return this.axiosInstance.get(`${AppConfig.apiUrl}/get-custom-field-types`);
  }

  /**
   * Create custom field
   * 
   * @param {*} data 
   * @returns 
   */
  createCustomField(data) {
    return this.axiosInstance.post(`${AppConfig.apiUrl}/create-custom-field`, data);
  }

  /**
   * Update custom field
   * 
   * @param {*} data 
   * @returns 
   */
  updateCustomField(data) {
    return this.axiosInstance.put(`${AppConfig.apiUrl}/update-custom-field`, data);
  }

  /**
   * Update custom field
   * 
   * @param {*} data 
   * @returns 
   */
  deleteCustomFieldById(data) {
    return this.axiosInstance.post(`${AppConfig.apiUrl}/delete-custom-field-by-id`, data);
  }

}

export default new CustomFieldService();
