import React from "react";
import "./ide.css";
// import "../Api/ide";
function OnlineIde() {
  return (
    <div>
      <div>
        <div id="site-navigation" className="ui small inverted menu">
          <div id="site-header" className="header item">
            <a href="/">
              <h2>AccioJob</h2>
            </a>
          </div>
          <div className="left menu">
            <div className="item borderless">
              <select id="select-language" className="ui dropdown">
                <option value={1002} mode="cpp">
                  C++ (Clang 10.0.1)
                </option>
                <option value={62} mode="java">
                  Java (OpenJDK 13.0.1)
                </option>
                <option value={63} mode="javascript">
                  JavaScript (Node.js 12.14.0)
                </option>
                <option value={71} mode="python">
                  Python (3.8.1)
                </option>
              </select>
            </div>
            <div className="item borderless wide screen only">
              <div className="ui input">
                <input
                  id="command-line-arguments"
                  type="text"
                  placeholder="Command line arguments"
                />
              </div>
            </div>
            <div className="item no-left-padding borderless">
              <button id="run-btn" className="ui primary labeled icon button">
                <i className="play icon" />
                Run (F9)
              </button>
            </div>
            <div id="navigation-message" className="item borderless">
              <span className="navigation-message-text" />
            </div>
          </div>
        </div>
        <div id="site-content" />
        <div id="site-modal" className="ui modal">
          <div className="header">
            <i className="close icon" />
            <span id="title" />
          </div>
          <div className="scrolling content" />
          <div className="actions">
            <div className="ui small labeled icon cancel button">
              <i className="remove icon" />
              Close (ESC)
            </div>
          </div>
        </div>
        <div id="site-footer">
          <div id="editor-status-line" />
          <span>
            © 2021-2022 <a href="https://judge0.com?ref=ide">AccioJob</a> ·
            Powered by <a href="https://judge0.com?ref=ide">AccioJob</a>
            <span id="status-line" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default OnlineIde;
