import React from "react";
import "./index.scss";
import PropTypes from "prop-types";

export default class LoadingSpinnerComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.show) {
      return (
        <div id="SQ-loading-spinner">
          <div className="circle1"></div>
          <div className="circle2"></div>
        </div>
      );
    } else {
      return null;
    }
  }
}

LoadingSpinnerComponent.propTypes = {
  show: PropTypes.bool,
};

LoadingSpinnerComponent.defaultProps = {
  show: false,
};
