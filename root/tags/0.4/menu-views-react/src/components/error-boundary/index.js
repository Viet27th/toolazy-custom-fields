import React from "react";
import "./index.scss";
import PropTypes from "prop-types";

/**
 * This component catch JavaScript errors anywhere in their child component tree,
 * log those errors, and display a fallback UI
 * @extends React
 */
class ErrorBoundaryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.mailSubject = encodeURIComponent("StockQuotes Error Feedback");
    this.mailBody = encodeURIComponent("Hãy chụp ảnh màn hình bị lỗi để chúng tôi có thể nhanh chóng hỗ trợ bạn. Xin cảm ơn!");
    this.state = { hasError: false };
  }

  /* eslint-disable-next-line */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log("Toolazy Cutom Fields - index:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return(
        <div>
          <h4 className="SQ-text-center">
            Đã có lỗi xảy ra, xin vui lòng làm mới trang để thử lại
            <br/>
            hoặc ấn vào email dưới đây để
            <br/>
            gửi phản hồi về hòm thư
            <br/>
            <a href={`mailto:viet27th@gmail.com?subject=${this.mailSubject}&body=${this.mailBody}`}
              className="SQ-text-green SQ-cursor-pointer"
              target="_blank"
              rel="noopener noreferrer">
              viet27th@gmail.com
            </a>
            <br/>
            Xin cảm ơn!
          </h4>
        </div>
      );
    }

    return this.props.children? this.props.children : null;
  }
}

ErrorBoundaryComponent.propTypes = {
  children: PropTypes.element
};

export default ErrorBoundaryComponent;
