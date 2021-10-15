import React from "react";
import "./index.scss";
import { render } from "react-dom";
import PropTypes from "prop-types";

const domOrder1st = "ParentConfirmComponent";
const domOrder2nd = "ConfirmComponent";

class ConfirmComponent extends React.Component {
  // Private field declarations

  constructor(props) {
    super(props);
    this.resolve;
    this.parentContainerElement;
    this.containerElement = document.createElement("div");
    this.containerElement.classList.add(domOrder2nd);
  }

  handleCancel = () => {
    let that = this.props.InstanceOfClass;
    that.containerElement.remove();
    if(!document.getElementsByClassName(domOrder2nd).length) {
      that.parentContainerElement.classList.remove(domOrder1st);
    }
    that.resolve(false);
  }

  handleConfirm = () => {
    let that = this.props.InstanceOfClass;
    that.containerElement.remove();
    if(!document.getElementsByClassName(domOrder2nd).length) {
      that.parentContainerElement.classList.remove(domOrder1st);
    }
    that.resolve(true);
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

    render(<ConfirmComponent {...props} />, InstanceOfClass.containerElement);
    return new Promise((res) => {
      InstanceOfClass.resolve = res;
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className={`v-model ${this.props.size? `v-model--${this.props.size}`: "v-model--extral-small"}`}>
          <div className="v-model__head">{this.props.title}</div>
          <div className="v-model__body">{this.props.message}</div>
          <div className="v-model__footer">
            <button type="button" className="btn-cancel" onClick={this.handleCancel}>{this.props.btnCancel}</button>
            <button type="button" className="btn-confirm" onClick={this.handleConfirm}>{this.props.btnConfirm}</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ConfirmComponent.defaultProps = {
  title: "Confirmation",
  message: "Are you sure?",
  btnConfirm: "Ok",
  btnCancel: "Cancel"
};

ConfirmComponent.propTypes = {
  InstanceOfClass: PropTypes.instanceOf(ConfirmComponent),
  size: PropTypes.string, // enum extral-small, small, medium, large, extral-large
  title: PropTypes.string,
  message: PropTypes.string,
  btnConfirm: PropTypes.string,
  btnCancel: PropTypes.string
};

export default ConfirmComponent;
