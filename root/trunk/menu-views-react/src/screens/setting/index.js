import React from "react";
import "./index.scss";
import {AppConfig} from "../../config";
import {CommonService, CustomFieldService} from "../../services";
import {CommonUtilities, RegexUtilities} from "../../utilities";
import {LoadingSpinnerComponent} from "../../components";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageTitle: CommonUtilities.GetSyncScriptParams().pageTitle,
      pluginsSuggestion: [
        {
          name: "Classic Editor",
          path: "classic-editor/classic-editor.php",
        },
      ],
      groupPostTypes: [],
      customFieldTypes: [],
      isShowLoading: false,
    };

    this.customFieldStructureMapping = {
      input: this.customFieldInputData,
      multipleInput: this.customFieldMultipleInputData,
      checkbox: this.customFieldCheckboxData,
      textarea: this.customFieldTextareaData,
      select: this.customFieldSelectData,
      radio: this.customFieldRadioData,
      file: this.customFieldFileData,
      image: this.customFieldImageData,
    };
  }

  render() {
    const {
      pageTitle,
      pluginsSuggestion,
      groupPostTypes,
      isShowLoading,
    } = this.state;

    return (
      <div id="tcf-setting-screen">
        <h1>
          {pageTitle}
          <img className="tcf-title-logo-icon ml-10" src={`${AppConfig.tcfPluginUrl}/assets/images/icon-setting.png`} />
        </h1>

        <div className="tcf-mb-20">
          <h3 className="tcf-mb-10">Plugins suggestion:</h3>
          <div className="tcf-ml-20">
            {
              pluginsSuggestion.map((obj, index) => {
                return (
                  <div key={index}>
                    <span className="tcf-mb-5 tcf-mt-0 tcf-mr-5 tcf-text-bold">- {obj.name}:</span>
                    <span className={obj.isActive? "tcf-text-success" : "tcf-text-error"}>
                      {obj.isActive ? "Active" : "Inactivate"}
                    </span>
                  </div>
                );
              })
            }
          </div>
        </div>
        
        <div className="tcf-mb-20">
          <h3 className="tcf-mb-10">Settings</h3>
          <div className="setting-container">

            {
              groupPostTypes.map((postType, postTypeIndex) => {
                return (
                  <React.Fragment key={postTypeIndex}>
                    {/* Custom Post Types Block */}
                    <button 
                      type="button" 
                      className={
                        "tcf-collapsible " + 
                        (postType.isExpand ? "active" : "")
                      } 
                      onClick={(event) => this.allowCollapsible(event, postTypeIndex)}
                    >
                      <span className="tcf-text-capitalize">Post type: {postType.postType}</span>
                      <span>{postType.isExpand ? "-" : "+"}</span>
                    </button>
                    <div className={
                      "tcf-collap-body " +
                      (postType.isExpand ? "active" : "")
                    }>
                      <div className="tcf-py-15">

                        <div className="tcf-d-flex tcf-justify-content-flex-start">
                          <button 
                            type="button"
                            className="tcf-btn tcf-btn-blue tcf-text-capitalize"
                            onClick={() => this.addNewCustomField(postType.postType, postTypeIndex)}
                          >
                            Add new custom field
                          </button>
                        </div>

                        <div className="tcf-content">
                          {/* Custom fields Block */}
                          {
                            postType.customFields.map((customField, customFieldIndex) => {
                              return (
                                <React.Fragment key={customFieldIndex}>
                                  <button 
                                    type="button" 
                                    className={
                                      "tcf-collapsible tcf-mt-10 tcf-p-11 " + 
                                      (customField.isExpand ? "active" : "")
                                    } 
                                    onClick={(event) => this.allowCollapsible(event, postTypeIndex, customFieldIndex)}
                                  >
                                    <span className="tcf-text-capitalize">{customField.metaboxTitle || "A new custom field"}</span>
                                    <span>{customField.isExpand? "-" : "+"}</span>
                                  </button>

                                  <div className={
                                    "tcf-collap-body " +
                                    (customField.isExpand ? "active" : "")
                                  }>
                                    <div className="tcf-py-15">
                                      {
                                        (() => {
                                          return this.generateCustomFieldLayout(postTypeIndex, customFieldIndex);
                                        })()
                                      }
                                    </div>

                                    <div className="tcf-d-flex tcf-justify-content-flex-end">
                                      <button 
                                        type="button"
                                        className="tcf-btn tcf-btn-gray tcf-text-capitalize tcf-ml-5"
                                        onClick={() => this.cancelChanged()}
                                      >
                                        Cancel Changed
                                      </button>
                                      <button 
                                        type="button"
                                        className="tcf-btn tcf-btn-danger tcf-text-capitalize tcf-ml-5"
                                        onClick={() => this.removeCustomField(postTypeIndex, customFieldIndex)}
                                      >
                                        Remove
                                      </button>
                                      <button 
                                        type="button"
                                        className="tcf-btn tcf-btn-blue tcf-text-capitalize tcf-ml-5"
                                        onClick={() => this.onSubmit(postTypeIndex, customFieldIndex)}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            })
                          }
                          {/* End Custom Field Block */}

                        </div>
                      </div>
                    </div>
                    {/* End Custom Post Types Block */}
                  </React.Fragment>
                );
              })
            }

          </div>
        </div>

        <LoadingSpinnerComponent show={isShowLoading} />
      </div>
    );
  }

  async componentDidMount() {
    this.checkRequiredPluginIsActive();
    await this.getCustomFieldTypes();
    await this.getData();
  }

  checkRequiredPluginIsActive = () => {
    CommonService.checkPluginIsActive(this.state.pluginsSuggestion).then(res => {
      this.setState({pluginsSuggestion: res.data});
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Get all the suported custom field types as input, textarea, checkbox, ect.
   */
  getCustomFieldTypes = async () => {
    try {
      this.setState({isShowLoading: true});
      let customFieldTypes = await CustomFieldService.getCustomFieldTypes();
      this.setState({
        customFieldTypes: customFieldTypes.data,
        isShowLoading: false,
      });
    } catch(error) {
      this.setState({isShowLoading: false});
    }
  }

  /**
   * Get all the Post Types of this Wordpress project.
   * Get all the Custom Fields existing on this Wordpress project.
   */
  getData = async () => {
    try {
      this.setState({isShowLoading: true});
      let postTypes = await CommonService.getPostTypes();
      postTypes = postTypes.data;
      let customFields = await CustomFieldService.getAllCustomFields();
      customFields = customFields.data; // Must be an array.

      let convertPostTypes = Object.keys(postTypes).map((postType) => {
        let customFieldClassificationByPostType = customFields.filter(cf => {
          // Group custom fields by same postType.
          return cf.postType === postType;
        }).map(cf => {
          // Convert data structure for custom field
          return this.customFieldStructureMapping[cf["metaboxType"]](cf);
        });

        return {
          postType: postType, // This field is always unique
          isExpand: false,
          customFields: customFieldClassificationByPostType, // Must be an array.
        };
      });
      this.setState({
        groupPostTypes: convertPostTypes,
        isShowLoading: false,
      });

    } catch(e) {
      this.setState({isShowLoading: false});
    }
  }

  /**
   * Handle change "isExpand" field.
   * 
   * @param {*} event 
   * @param {number|undefined} postTypeIndex - Used to update post type state is collap/expand
   * @param {number|undefined} customFieldIndex - Used to update custom field state is collap/expand
   */
  allowCollapsible = (event, postTypeIndex, customFieldIndex) => {
    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));

    if(customFieldIndex === undefined) {
      cloneGroupPostTypeState[postTypeIndex].isExpand = !this.state.groupPostTypes[postTypeIndex].isExpand;
    }
    
    if(customFieldIndex !== undefined) {
      cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex].isExpand = !cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex].isExpand;
    }
    this.setState({groupPostTypes: cloneGroupPostTypeState});
  }

  /**
   * Add a new Custom Field for a give Post Type
   * 
   * @param {string} postType - The post type will be add new custom field.
   * @param {number} postTypeIndex - Index of post type in array.
   */
  addNewCustomField = (postType, postTypeIndex) => {
    let customFieldInput = this.customFieldInputData();
    customFieldInput.postType = postType;
    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));
    cloneGroupPostTypeState[postTypeIndex].customFields.unshift(customFieldInput);
    this.setState({groupPostTypes: cloneGroupPostTypeState});
  }

  /**
   * Remove a custom field by id if it's existing in DB or remove directly if is creating
   * 
   * @param {number} postTypeIndex 
   * @param {number} customFieldIndex 
   */
  removeCustomField = async (postTypeIndex, customFieldIndex) => {
    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));
    let customField = cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex];

    if(window.confirm("Do you want to remove this custom field?")) {
      this.setState({isShowLoading: true});
      try {
        let isDeleted;
        if(customField.id !== "") {
          // If is custom field existing on Database, call api to delete first
          isDeleted = await CustomFieldService.deleteCustomFieldById(customField);
        }
        if(isDeleted) {
          cloneGroupPostTypeState[postTypeIndex].customFields.splice(customFieldIndex, 1);
          this.setState({
            groupPostTypes: cloneGroupPostTypeState,
            isShowLoading: false,
          });
          window.alert("Deleted successfuly.");
        } else {
          window.alert("Error.");
          this.setState({isShowLoading: false});
        }
      } catch(error) {
        this.setState({isShowLoading: false});
      }
    }
  }

  /**
   * Refresh page to Cancel all the changed in Custom Field without click "Submit" button.
   */
  cancelChanged = () => {
    if(window.confirm("Do you want to cancel all the changed?")) {
      location.reload();
    }
  }

  /**
   * Submit data to create a new custom field.
   * 
   * @param {*} postTypeIndex 
   * @param {*} customFieldIndex 
   * @returns 
   */
  onSubmit = async (postTypeIndex, customFieldIndex) => {
    let newCustomField = this.state.groupPostTypes[postTypeIndex].customFields[customFieldIndex];
    let dataToSend = JSON.parse(JSON.stringify(newCustomField));
    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));
    let allCustomFieldsInGroupPostType = JSON.parse(JSON.stringify(cloneGroupPostTypeState[postTypeIndex].customFields));
    allCustomFieldsInGroupPostType.splice(customFieldIndex, 1); // Remove newCustomField from array.
    let otherCustomFieldsInGroupPostType = allCustomFieldsInGroupPostType;

    let errorMessage = "";
    let checkRequiredFields = () => {
      if(dataToSend.metaboxTitle === "") {
        errorMessage += "Metabox Title is required.\n";
      }
      if(dataToSend.metaKey === "") {
        errorMessage += "Meta Key is required.\n";
      }
    };
    checkRequiredFields();
    
    for(let i = 0; i < otherCustomFieldsInGroupPostType.length; i++) {
      if(otherCustomFieldsInGroupPostType[i].metaKey === dataToSend.metaKey){
        document.getElementById(`tcf-metaKey-${postTypeIndex}-${customFieldIndex}`).focus();
        window.alert(`Your "Meta Key" field must be unique in a "Post Type".`);
        return;
      }
    }

    if(errorMessage === "") {
      if(window.confirm(`${dataToSend.id === ""? "Created" : "Updated"} Custom Field?`)) {
        this.setState({isShowLoading: true});
        delete dataToSend.isNewCustomField;
        delete dataToSend.isExpand;
        try {
          let newCustomFielCreatedOrUpdated;
          if(dataToSend.id === "") {
            newCustomFielCreatedOrUpdated = await CustomFieldService.createCustomField(dataToSend);
          } else {
            newCustomFielCreatedOrUpdated = await CustomFieldService.updateCustomField(dataToSend);
          }
           
          newCustomFielCreatedOrUpdated = newCustomFielCreatedOrUpdated.data;
          if(newCustomFielCreatedOrUpdated) {
            let convertedCustomFieldObjectStructure = this.customFieldStructureMapping[newCustomFielCreatedOrUpdated.metaboxType](newCustomFielCreatedOrUpdated);
            convertedCustomFieldObjectStructure.isExpand = true;
            cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex] = convertedCustomFieldObjectStructure;
            
            this.setState({
              groupPostTypes: cloneGroupPostTypeState,
              isShowLoading: false
            });
            window.alert(`${dataToSend.id === ""? "Created" : "Updated"} successfuly.`);
          } else {
            window.alert("Error.");
            this.setState({isShowLoading: false});
          }
        } catch(error) {
          this.setState({isShowLoading: false});
        }
      }
    } else {
      window.alert(errorMessage);
    }
  }

  /**
   * Generate object data structure common for setting Custom field
   * 
   * @param {*} data 
   * @returns Object
   */
  customFieldCommonData = (data) => {
    return {
      isNewCustomField: data? false : true,
      isExpand: data? false : true,
      id: data? data.id : "",
      postType: data? data.postType : "",
      metaboxTitle: data? data.metaboxTitle : "A new custom field",
      metaKey: data? data.metaKey : "", // It's should be unique in a Post Type
      instructions: data? data.instructions : "",
      isRequired: data? data.isRequired : false,
      context: data? data.context : "normal", // enum s: normal, side
      priority: data? data.priority : "high", // 'high', 'core', 'default', or 'low'.
      wrapperClassAttributes: data? data.wrapperClassAttributes : "",
    };
  }

  /**
   * Generate object data structure for setting Custom field Input
   * 
   * @param {*} data 
   * @returns Object
   */
  customFieldInputData = (data) => {
    let commonAttributes = this.customFieldCommonData(data);
    let dedicatedAttributes = {
      metaboxType: data? data.metaboxType : "input",
      inputType: data? data.inputType : "text", // enums: text, password, color, date, datetime-local, email, month, number, time, url, week
      placeholderText: data? data.placeholderText: "",
      defaultValue: data? data.defaultValue : "",
      characterLimit: data? data.characterLimit : "",
    };

    return {...commonAttributes, ...dedicatedAttributes};
  }

  /**
   * Generate object data structure for setting Custom field Multiple Input
   * 
   * @param {*} data 
   * @returns Object
   */
  customFieldMultipleInputData = (data) => {
    let commonAttributes = this.customFieldCommonData(data);
    let dedicatedAttributes = {
      metaboxType: data? data.metaboxType : "multipleInput",
      inputType: data? data.inputType : "text", // enums: text, password, color, date, datetime-local, email, month, number, time, url, week
      placeholderText: data? data.placeholderText: "",
      defaultValue: data? data.defaultValue : "",
      characterLimit: data? data.characterLimit : "",
    };

    return {...commonAttributes, ...dedicatedAttributes};
  }

  /**
   * Generate object data structure for setting Custom field Checkbox
   * 
   * @param {*} data 
   * @returns Object
   */
  customFieldCheckboxData = (data) => {
    let commonAttributes = this.customFieldCommonData(data);
    let dedicatedAttributes = {
      metaboxType: data? data.metaboxType : "checkbox",
      value: data? data.value : [],
    };

    return {...commonAttributes, ...dedicatedAttributes};
  }

  /**
   * Generate object data structure for setting Custom field Text Area
   * 
   * @param {*} data 
   * @returns Object
   */
  customFieldTextareaData = (data) => {
    let commonAttributes = this.customFieldCommonData(data);
    let dedicatedAttributes = {
      metaboxType: data? data.metaboxType : "textarea",
      placeholderText: data? data.placeholderText: "",
      defaultValue: data? data.defaultValue : "",
      characterLimit: data? data.characterLimit : "",
      visibleLinesNumber: data? data.visibleLinesNumber : 10,
      visibleColsNumber: data? data.visibleColsNumber : 40,
    };

    return {...commonAttributes, ...dedicatedAttributes};
  }

  /**
   * Generate object data structure for setting Custom field Select
   * 
   * @param {*} data 
   * @returns Object
   */
  customFieldSelectData = (data) => {
    let commonAttributes = this.customFieldCommonData(data);
    let dedicatedAttributes = {
      metaboxType: data? data.metaboxType : "select",
      value: data? data.value : [],
    };

    return {...commonAttributes, ...dedicatedAttributes};
  }

  /**
   * Generate object data structure for setting Custom field Radio
   * 
   * @param {*} data 
   * @returns Object
  */
  customFieldRadioData = (data) => {
    let commonAttributes = this.customFieldCommonData(data);
    let dedicatedAttributes = {
      metaboxType: data? data.metaboxType : "radio",
      value: data? data.value : [],
    };

    return {...commonAttributes, ...dedicatedAttributes};
  }

  /**
   * Generate object data structure for setting Custom field File
   * 
   * @param {*} data 
   * @returns Object
  */
  customFieldFileData = (data) => {
    let commonAttributes = this.customFieldCommonData(data);
    let dedicatedAttributes = {
      metaboxType: data? data.metaboxType : "file",
      allowMultipleSelection: data? data.allowMultipleSelection : true,
      fileTypeAllowed: data? data.fileTypeAllowed : [], // Empty array allow Wordpress media modal show all file type as .mp3, .mp4, any image as .png, etc.
    };

    return {...commonAttributes, ...dedicatedAttributes};
  }

  /**
   * Generate object data structure for setting Custom field Image
   * 
   * @param {*} data 
   * @returns Object
  */
  customFieldImageData = (data) => {
    let commonAttributes = this.customFieldCommonData(data);
    let dedicatedAttributes = {
      metaboxType: data? data.metaboxType : "image",
      allowMultipleSelection: data? data.allowMultipleSelection : true,
      fileTypeAllowed: data? data.fileTypeAllowed : ["image"] // Wordpress modal filter and show image only.
    };

    return {...commonAttributes, ...dedicatedAttributes};
  }

  /**
   * When "metabox type" selection is changed, create new object data and update state.
   * 
   * @param {*} event 
   * @param {number} postTypeIndex 
   * @param {number} customFieldIndex 
   */
  handleChangeMetaboxType = (event, postTypeIndex, customFieldIndex) => {
    let postTypeData = this.state.groupPostTypes[postTypeIndex];
    let newCustomFieldData = this.customFieldStructureMapping[event.target.value]();

    newCustomFieldData.postType = postTypeData.postType;
    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));
    cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex] = newCustomFieldData;
    this.setState({groupPostTypes: cloneGroupPostTypeState});
  }

  /**
   * Generate HTML layout for custom field setting.
   * 
   * @param {*} postTypeIndex 
   * @param {*} customFieldIndex 
   * @returns 
   */
  generateCustomFieldLayout = (postTypeIndex, customFieldIndex) => {
    let postTypeData = this.state.groupPostTypes[postTypeIndex];
    let customFieldData = this.state.groupPostTypes[postTypeIndex].customFields[customFieldIndex];
    let {
      customFieldTypes,
    } = this.state;

    return (
      <React.Fragment>
        {/*  */}
        <div className="tcf-row tcf-py-15">
          <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
            <label 
              className="tcf-text-bold h3" 
              htmlFor={"tcf-metaboxTitle-" + postTypeIndex + "-" + customFieldIndex}
            >
              Metabox Title
              <span className="tcf-text-error tcf-ml-5">*</span>
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">This is the name which will appear on the CREATE/EDIT page</p>
            </label>
          </div>
          <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
            <input 
              name={"metaboxTitle" + "-" + postTypeIndex + "-" + customFieldIndex}
              id={"tcf-metaboxTitle-" + postTypeIndex + "-" + customFieldIndex}
              type="text" 
              className="tcf-w-100"
              value={customFieldData.metaboxTitle}
              onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
            />
          </div>
        </div>

        {/*  */}
        <div className="tcf-row tcf-py-15">
          <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
            <label 
              className="tcf-text-bold h3" 
              htmlFor={"tcf-metaKey-" + postTypeIndex + "-" + customFieldIndex}
            >
              Meta Key
              <span className="tcf-text-error tcf-ml-5">*</span>
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                Single word, no spaces. Underscores and dashes allowed
              </p>
              <p className="tcf-text-error tcf-my-0 tcf-h6 tcf-text-normal">
                It should be unique in {postTypeData.postType.toUpperCase()} post type.
              </p>
            </label>
          </div>
          <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
            <input 
              name={"metaKey" + "-" + postTypeIndex + "-" + customFieldIndex}
              id={"tcf-metaKey-" + postTypeIndex + "-" + customFieldIndex}
              type="text" 
              className="tcf-w-100" 
              value={customFieldData.metaKey}
              onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
              disabled={!customFieldData.isNewCustomField}
            />
          </div>
        </div>

        {/*  */}
        <div className="tcf-row tcf-py-15">
          <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
            <label 
              className="tcf-text-bold h3" 
              htmlFor={"tcf-instruction-" + postTypeIndex + "-" + customFieldIndex}
            >
              Instructions
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                Instructions for authors. Shown when submitting data in CREATE/EDIT page.
              </p>
            </label>
          </div>
          <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
            <textarea 
              name={"instructions" + "-" + postTypeIndex + "-" + customFieldIndex}
              id={"tcf-instructions-" + postTypeIndex + "-" + customFieldIndex}
              rows="5"
              className="tcf-w-100"
              value={customFieldData.instructions}
              onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
            />
          </div>
        </div>

        {/*  */}
        <div className="tcf-row tcf-py-15">
          <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
            <label 
              className="tcf-text-bold h3" 
              htmlFor={"tcf-metaboxType-" + postTypeIndex + "-" + customFieldIndex}
            >
              Meta Box Type
              <span className="tcf-text-error tcf-ml-5">*</span>
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                The type of custom field.
              </p>
              {
                !customFieldData.isNewCustomField && 
                <p className="tcf-text-error tcf-my-0 tcf-h6 tcf-text-normal">
                  You're not allow to edit this field.
                </p>
              }
            </label>
          </div>
          <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
            <select
              name={"metaboxType" + "-" + postTypeIndex + "-" + customFieldIndex}
              id={"tcf-metaboxType-" + postTypeIndex + "-" + customFieldIndex}
              className="tcf-w-100" 
              value={customFieldData.metaboxType}
              disabled={!customFieldData.isNewCustomField}
              onChange={(event) => this.handleChangeMetaboxType(event, postTypeIndex, customFieldIndex)}
            >
              {
                customFieldTypes.map((customFieldType, index) => {
                  return (
                    <option 
                      key={index} 
                      value={customFieldType.value}
                    >
                      {customFieldType.name}
                    </option>
                  );
                })
              }
            </select>
          </div>
        </div>

        {/*  */}
        <div className="tcf-row tcf-py-15">
          <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
            <label 
              className="tcf-text-bold h3"
            >
              Required?
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                Mark this field is require.
              </p>
            </label>
          </div>
          <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
            <div onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}>
              <span className="tcf-mr-27">
                <input 
                  type="radio" 
                  value="true" 
                  name={"isRequired" + "-" + postTypeIndex + "-" + customFieldIndex} 
                  checked={customFieldData.isRequired == true} onChange={() => {}} 
                  id={"tcf-isRequired-yes-" + postTypeIndex + "-" + customFieldIndex}
                />
                <label htmlFor={"tcf-isRequired-yes-" + postTypeIndex + "-" + customFieldIndex}>Yes</label>
              </span>
              <span className="tcf-mr-27">
                <input 
                  type="radio" 
                  value="false" 
                  name={"isRequired" + "-" + postTypeIndex + "-" + customFieldIndex}  
                  checked={customFieldData.isRequired == false} onChange={() => {}}
                  id={"tcf-isRequired-no-" + postTypeIndex + "-" + customFieldIndex}
                />
                <label htmlFor={"tcf-isRequired-no-" + postTypeIndex + "-" + customFieldIndex}>No</label>
              </span>
              
            </div>
          </div>
        </div>

        {
          (() => {
            switch (customFieldData.metaboxType) {
              case "input":
              case "multipleInput":
                return (
                  <React.Fragment>
                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-inputType-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Input Type
                          <span className="tcf-text-error tcf-ml-5">*</span>
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            Define the type of input tag.
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <select
                          name={"inputType" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-inputType-" + postTypeIndex + "-" + customFieldIndex}
                          className="tcf-w-100" 
                          value={customFieldData.inputType}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        >
                          <option value="text">Text</option>
                          <option value="password">Password</option>
                          <option value="color">Color</option>
                          <option value="date">Date</option>
                          <option value="datetime-local">Datetime Local</option>
                          <option value="email">Email</option>
                          <option value="month">Month</option>
                          <option value="number">Number</option>
                          <option value="time">Time</option>
                          <option value="url">Url</option>
                          <option value="week">Week</option>
                        </select>
                      </div>
                    </div>

                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-placeholderText-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Placeholder
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            Appears within the input
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <input 
                          name={"placeholderText" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-placeholderText-" + postTypeIndex + "-" + customFieldIndex}
                          type="text" 
                          className="tcf-w-100"
                          value={customFieldData.placeholderText}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        />
                      </div>
                    </div>

                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-defaultValue-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Default Value
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            The default value in custom field appears on CREAT/EDIT page.
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <input 
                          name={"defaultValue" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-defaultValue-" + postTypeIndex + "-" + customFieldIndex}
                          type="text" 
                          className="tcf-w-100"
                          value={customFieldData.defaultValue}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        />
                      </div>
                    </div>

                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-characterLimit-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Character Limit
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            Leave blank for no limit
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <input 
                          name={"characterLimit" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-characterLimit-" + postTypeIndex + "-" + customFieldIndex}
                          type="number" 
                          className="tcf-w-100"
                          value={customFieldData.characterLimit}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                );
              case "checkbox":
              case "select":
              case "radio":
                return (
                  <React.Fragment>
                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-value-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Value
                          <span className="tcf-text-error tcf-ml-5">*</span>
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            Create the selectable for custom field type checkbox.
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <button 
                          type="button" 
                          className="tcf-btn tcf-btn-blue tcf-h2 tcf-py-3 tcf-px-9 tcf-border-radius-3"
                          onClick={() => this.addValue(postTypeIndex, customFieldIndex)}
                        >
                          +
                        </button>
                        {
                          customFieldData.value.map((obj, customFieldValueIndex) => {
                            return (
                              <div className="tcf-row tcf-mt-10" key={customFieldValueIndex}>
                                <input 
                                  type="text" 
                                  className="tcf-col-3" 
                                  placeholder="Label"
                                  value={obj.label}
                                  name="label"
                                  onChange={(event) => this.onCustomFieldValueChange(event, postTypeIndex, customFieldIndex, customFieldValueIndex)}
                                />
                                <input 
                                  type="text" 
                                  className="tcf-col-6" 
                                  placeholder="Value"
                                  value={obj.value} 
                                  name="value"
                                  onChange={(event) => this.onCustomFieldValueChange(event, postTypeIndex, customFieldIndex, customFieldValueIndex)}
                                />
                                <div className="tcf-col tcf-d-flex">
                                  <button 
                                    type="button" 
                                    className="tcf-btn tcf-btn-danger tcf-h2 tcf-py-3 tcf-px-9 tcf-border-radius-3"
                                    onClick={() => this.removeValue(postTypeIndex, customFieldIndex, customFieldValueIndex)}
                                  >
                                    -
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  </React.Fragment>
                );
              case "textarea":
                return (
                  <React.Fragment>
                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-placeholderText-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Placeholder
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            Appears within the input
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <input 
                          name={"placeholderText" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-placeholderText-" + postTypeIndex + "-" + customFieldIndex}
                          type="text" 
                          className="tcf-w-100"
                          value={customFieldData.placeholderText}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        />
                      </div>
                    </div>

                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-defaultValue-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Default Value
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            The default value in custom field appears on CREAT/EDIT page.
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <input 
                          name={"defaultValue" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-defaultValue-" + postTypeIndex + "-" + customFieldIndex}
                          type="text" 
                          className="tcf-w-100"
                          value={customFieldData.defaultValue}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        />
                      </div>
                    </div>

                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-characterLimit-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Character Limit
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            Leave blank for no limit
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <input 
                          name={"characterLimit" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-characterLimit-" + postTypeIndex + "-" + customFieldIndex}
                          type="number" 
                          className="tcf-w-100"
                          value={customFieldData.characterLimit}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        />
                      </div>
                    </div>

                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-visibleLinesNumber-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Visible Lines Number
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            Number of visible lines of custom field type Text Area
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <input 
                          name={"visibleLinesNumber" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-visibleLinesNumber-" + postTypeIndex + "-" + customFieldIndex}
                          type="number" 
                          className="tcf-w-100"
                          value={customFieldData.visibleLinesNumber}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        />
                      </div>
                    </div>

                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3" 
                          htmlFor={"tcf-visibleColsNumber-" + postTypeIndex + "-" + customFieldIndex}
                        >
                          Visible Cols Number
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            Number of visible columns of custom field type Text Area
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <input 
                          name={"visibleColsNumber" + "-" + postTypeIndex + "-" + customFieldIndex}
                          id={"tcf-visibleColsNumber-" + postTypeIndex + "-" + customFieldIndex}
                          type="number" 
                          className="tcf-w-100"
                          value={customFieldData.visibleColsNumber}
                          onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                );
              case "file":
              case "image":
                return (
                  <React.Fragment>
                    {/*  */}
                    <div className="tcf-row tcf-py-15">
                      <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
                        <label 
                          className="tcf-text-bold h3"
                        >
                          Allow Multiple Selection?
                          <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                            You can select one or multiple File.
                          </p>
                        </label>
                      </div>
                      <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
                        <div onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}>
                          <span className="tcf-mr-27">
                            <input 
                              type="radio" 
                              value="true" 
                              name={"allowMultipleSelection" + "-" + postTypeIndex + "-" + customFieldIndex}
                              checked={customFieldData.allowMultipleSelection == true} onChange={() => {}} 
                              id={"tcf-allowMultipleSelection-yes-" + postTypeIndex + "-" + customFieldIndex}
                            />
                            <label htmlFor={"tcf-allowMultipleSelection-yes-" + postTypeIndex + "-" + customFieldIndex}>Yes</label>
                          </span>
                          <span className="tcf-mr-27">
                            <input 
                              type="radio" 
                              value="false" 
                              name={"allowMultipleSelection" + "-" + postTypeIndex + "-" + customFieldIndex}
                              checked={customFieldData.allowMultipleSelection == false} onChange={() => {}}
                              id={"tcf-allowMultipleSelection-no-" + postTypeIndex + "-" + customFieldIndex}
                            />
                            <label htmlFor={"tcf-allowMultipleSelection-no-" + postTypeIndex + "-" + customFieldIndex}>No</label>
                          </span>
                          
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
            }
          })()
        }

        {/*  */}
        <div className="tcf-row tcf-py-15">
          <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
            <label 
              className="tcf-text-bold h3" 
              htmlFor={"tcf-context-" + postTypeIndex + "-" + customFieldIndex}
            >
              Context
              <span className="tcf-text-error tcf-ml-5">*</span>
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                Used to provide the position of the custom meta on the display screen
              </p>
            </label>
          </div>
          <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
            <select
              name={"context" + "-" + postTypeIndex + "-" + customFieldIndex}
              id={"tcf-context-" + postTypeIndex + "-" + customFieldIndex}
              className="tcf-w-100" 
              value={customFieldData.context}
              onChange={(event) => this.handleChangeMetaboxType(event, postTypeIndex, customFieldIndex)}
            >
              <option value="normal">Normal</option>
              <option value="side">Side</option>
            </select>
          </div>
        </div>

        {/*  */}
        <div className="tcf-row tcf-py-15">
          <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
            <label 
              className="tcf-text-bold h3" 
              htmlFor={"tcf-priority-" + postTypeIndex + "-" + customFieldIndex}
            >
              Priority
              <span className="tcf-text-error tcf-ml-5">*</span>
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                Used to provide the position of the box in the provided context
              </p>
            </label>
          </div>
          <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
            <select
              name={"priority" + "-" + postTypeIndex + "-" + customFieldIndex}
              id={"tcf-priority-" + postTypeIndex + "-" + customFieldIndex}
              className="tcf-w-100" 
              value={customFieldData.priority}
              onChange={(event) => this.handleChangeMetaboxType(event, postTypeIndex, customFieldIndex)}
            >
              <option value="high">High</option>
              <option value="core">Core</option>
              <option value="default">Default</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/*  */}
        <div className="tcf-row tcf-py-15">
          <div className="tcf-col-3 tcf-pl-0 tcf-pt-0">
            <label 
              className="tcf-text-bold h3" 
              htmlFor={"tcf-wrapperClassAttributes-" + postTypeIndex + "-" + customFieldIndex}
            >
              Wrapper Class Attributes
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                Define class wrap around custom field appears on CREATE/EDIT page.
              </p>
              <p className="tcf-text-gray tcf-my-0 tcf-h5 tcf-text-normal">
                Multiple class are allowed by spaces.
              </p>
            </label>
          </div>
          <div className="tcf-col-9 tcf-pr-0 tcf-pt-0">
            <input 
              name={"wrapperClassAttributes" + "-" + postTypeIndex + "-" + customFieldIndex}
              id={"tcf-wrapperClassAttributes-" + postTypeIndex + "-" + customFieldIndex}
              type="text" 
              className="tcf-w-100"
              value={customFieldData.wrapperClassAttributes}
              onChange={(event) => this.onChangeValue(event, postTypeIndex, customFieldIndex)}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  /**
   * Update custom field in state.
   * 
   * @param {*} event 
   * @param {number} postTypeIndex 
   * @param {number} customFieldIndex 
   */
  onChangeValue = (event, postTypeIndex, customFieldIndex) => {
    let key = event.target.name.split("-")[0];
    let value = event.target.value;
    // Convert input radio value to boolean
    if(value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }
    
    if(key === "metaKey") {
      value = RegexUtilities.ToSlug(value);
    }

    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));
    cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex][key] = value;
    this.setState({groupPostTypes: cloneGroupPostTypeState});
  }

  /**
   * Push new value into "value" attribute of custom field as checkbox, radio, ect.
   * 
   * @param {*} postTypeIndex 
   * @param {*} customFieldIndex 
   */
  addValue = (postTypeIndex, customFieldIndex) => {
    let newValue = {
      label: "",
      value: "",
    };
    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));
    cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex].value.unshift(newValue);
    this.setState({groupPostTypes: cloneGroupPostTypeState});
  }

  /**
   * Remove value in "value" attribute of custom field as checkbox, radio, ect.
   * 
   * @param {*} postTypeIndex 
   * @param {*} customFieldIndex 
   */
  removeValue = (postTypeIndex, customFieldIndex, customFieldValueIndex) => {
    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));
    cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex].value.splice(customFieldValueIndex, 1);
    this.setState({groupPostTypes: cloneGroupPostTypeState});
  }

  /**
   * Handle when value in "value" attribute of custom field as checkbox, radio, ect. changed.
   * 
   * @param {*} event 
   * @param {*} postTypeIndex 
   * @param {*} customFieldIndex 
   * @param {*} customFieldValueIndex 
   */
  onCustomFieldValueChange = (event, postTypeIndex, customFieldIndex, customFieldValueIndex) => {
    let key = event.target.name;
    let value = event.target.value;
    let cloneGroupPostTypeState = JSON.parse(JSON.stringify(this.state.groupPostTypes));
    cloneGroupPostTypeState[postTypeIndex].customFields[customFieldIndex].value[customFieldValueIndex][key] = value;
    this.setState({groupPostTypes: cloneGroupPostTypeState});
  }

}

HomeScreen.propTypes = {
};

export default HomeScreen;
