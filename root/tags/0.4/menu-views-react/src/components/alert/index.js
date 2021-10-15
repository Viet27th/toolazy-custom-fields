import React from "react";
import "./index.scss";
import { render } from "react-dom";
import PropTypes from "prop-types";

const domOrder1st = "ParentAlertComponent";
const domOrder2nd = "AlertComponent";

class AlertComponent extends React.Component {
  // Private field declarations

  constructor(props) {
    super(props);
    this.resolve;
    this.parentContainerElement;
    this.containerElement = document.createElement("div");
    this.containerElement.classList.add(domOrder2nd);
  }

  handleConfirm = () => {
    let that = this.props.InstanceOfClass;
    that.containerElement.remove();
    if(!document.getElementsByClassName(domOrder2nd).length) {
      that.parentContainerElement.classList.remove(domOrder1st);
    }
    that.resolve(true);
  }

  handleKeyPress = (event) => {
    if(event.key === "Enter") {
      let that = this.props.InstanceOfClass;
      that.containerElement.remove();

      let allAlertComponentStillExisting = document.getElementsByClassName(domOrder2nd);
      if(!allAlertComponentStillExisting.length) {
        that.parentContainerElement.classList.remove(domOrder1st);
      }

      let lastComponent = allAlertComponentStillExisting[allAlertComponentStillExisting.length - 1];
      if(lastComponent) {
        lastComponent.firstElementChild.focus();
      }

      that.resolve(true);
    }
  }

  static show = (props = {}) => {
    // "this" = ConfirmComponent
    let InstanceOfClass = new this();

    InstanceOfClass.parentContainerElement = document.body;
    InstanceOfClass.parentContainerElement.appendChild(InstanceOfClass.containerElement);

    if(!InstanceOfClass.parentContainerElement.classList.contains(domOrder1st)) {
      InstanceOfClass.parentContainerElement.classList.add(domOrder1st);
    }

    props.InstanceOfClass = InstanceOfClass;

    render(<AlertComponent {...props} />, InstanceOfClass.containerElement);

    InstanceOfClass.containerElement.firstElementChild.focus();

    return new Promise((res) => {
      InstanceOfClass.resolve = res;
    });
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={`v-model ${this.props.size? `v-model--${this.props.size}`: "v-model--extral-small"}`}
          tabIndex="0"
          onKeyPress={this.handleKeyPress}>
          <div className="v-model__head">{this.props.title}</div>
          <div className="v-model__body">{this.props.message}</div>
          <div className="v-model__footer">
            <button type="button" className="btn-confirm" onClick={this.handleConfirm}>{this.props.btnConfirm}</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AlertComponent.defaultProps = {
  title: "Alert",
  message: "Message",
  btnConfirm: "Ok"
};

AlertComponent.propTypes = {
  InstanceOfClass: PropTypes.instanceOf(AlertComponent),
  size: PropTypes.string, // enum extral-small, small, medium, large, extral-large
  title: PropTypes.string,
  message: PropTypes.string,
  btnConfirm: PropTypes.string,
  btnCancel: PropTypes.string
};

export default AlertComponent;
