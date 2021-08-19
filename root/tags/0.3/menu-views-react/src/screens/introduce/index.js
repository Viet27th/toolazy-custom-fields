import React from "react";
import "./index.scss";
import {CommonUtilities} from "../../utilities";

class IntroduceScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageTitle: CommonUtilities.GetSyncScriptParams().pageTitle,
    };
  }

  render() {
    const {
      pageTitle,
    } = this.state;

    return (
      <div id="tcf-introduce-screen">
        <h1>{pageTitle}</h1>
        <p>- Change permalink in setting first: 
          <span className="tcf-text-bold" > Settings {"->"} Permalinks </span>
          look at the <strong>Common Settings</strong> and certain that <b>Post name</b> is selected. <b>Default permalinks will not work.</b>
        </p>
        <p>- For best experience, install <b>Classic Editor</b> plugin. 
        There’s a plugin by the WordPress core team 
        which allows you to use the classic editor even on WordPress 5.0 or later.
        If you are installed, go to <b>Settings {"->"} Writing</b> and certain that <b>Default editor for all users </b>
        is <b>Classic editor</b> and <b>Allow users to switch editors</b> is <b>No</b>
        </p>
        <p>So now, you can go to the <b>Setting</b> page and create <b>Custom Fields</b> for each <b>Post Type</b> </p>
      </div>
    );
  }

  componentDidMount() {

  }

}

export default IntroduceScreen;
