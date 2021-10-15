import React from "react";
import "./App.scss";
import {CommonUtilities} from "./utilities";

import {
  SettingScreen, 
  IntroduceScreen,
} from "./screens";
import {ErrorBoundaryComponent} from "./components";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: CommonUtilities.GetSyncScriptParams(),
    };
  }

  render() {
    return (
      <div id="tcf-app">
        <ErrorBoundaryComponent>
          {
            (() => {
              switch(this.state.data.pageTitle) {
                case "Setting":
                  return <SettingScreen />;
                case "Introduce":
                  return <IntroduceScreen />;
                default:
                  return <p>Opps!!!</p>;
              }
            })()
          }
        </ErrorBoundaryComponent>
      </div>
    );
  }

  async componentDidMount() {

  }
}


App.propTypes = {
};

export default App;
