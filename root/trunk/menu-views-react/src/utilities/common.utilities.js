import {ColorConfig} from "../config";

/**
 * Get data attribute on <script></script> tag
 * 
 * https://stackoverflow.com/questions/5292372/how-to-pass-parameters-to-a-script-tag
 */
let GetSyncScriptParams = () => {
  let data = document.currentScript || (function() {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();
  return JSON.parse(data.getAttribute("data"));
};

let DecodeTokenBase64 = (token) => {
  let userData = token.split(".")[1];
  return window.atob(userData);
};

/**
 * Show log as console func
 * @param {String} [message=""]                  [description]
 * @param {String} [backgroundColor=Color.black] [description]
 * @param {String} [color=Color.lightYellow]     [description]
 */
let ShowLog = (message = "", backgroundColor = ColorConfig.black, color = ColorConfig.lightYellow) => {
  console.log(`%c Toolazy Cutom Fields: ${message}`, `background: ${backgroundColor}; color: ${color}`);
};

let WindowConfirm = (message = "") => {
  let promise = new Promise((resolve) => {
    if(confirm(`Toolazy Cutom Fields: ${message}`)) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
  return promise;
};

let Delay = (millisecond) => {
  let condition = new Date().getTime();
  let start = condition;
  while(start <= condition + millisecond) {
    start = new Date().getTime();
  }
};

let WindowAlert = (message = "") => {
  alert(`Toolazy Cutom Fields: ${message}`);
};

let RandomValue = (id = "") => {
  return Math.random().toString(36).substring(7) + id;
};

export const CommonUtilities = {
  GetSyncScriptParams,
  DecodeTokenBase64,
  ShowLog,
  WindowConfirm,
  WindowAlert,
  Delay,
  RandomValue
};
