import axios from "axios";
import React, { Component } from "react";
import Editor from "@monaco-editor/react";
import "./Compiler.css";
export default class Compiler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: localStorage.getItem("input") || "",
      output: "",
      language_id: localStorage.getItem("language_Id") || 54,
      user_input: "",
    };
  }

  static defaultProps = {
    54: "cpp",
    62: "java",
    71: "python",
    63: "javascript",
  };

  input = (value) => {
    this.setState({ input: value });
    localStorage.setItem("input", value);
  };
  userInput = (evt) => {
    this.setState({ user_input: evt.target.value });
  };
  language = (evt) => {
    this.setState({ language_id: evt.target.value }, () => {});
    localStorage.setItem("language_Id", evt.target.value);
  };
  encode = (input) => {
    return btoa(unescape(encodeURIComponent(input || "")));
  };
  submit = async () => {
    this.setState({
      output: "",
    });
    this.setState({
      output: "Creating Submission ...\n",
    });
    const response = await axios.request({
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key": "b981cd2001msh5e29487ed2b4ebep118549jsn7a68667230b1",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
      data: {
        source_code: this.encode(this.state.input),
        stdin: this.encode(this.state.user_input),
        language_id: parseInt(this.state.language_id),
      },
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        output: prevState.output + "Creating Submission ...\n",
      };
    });

    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };

    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      this.setState({
        output: `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`,
      });
      if (response.data.token) {
        const getSolution = await axios.request({
          method: "GET",
          url: `https://judge0-ce.p.rapidapi.com/submissions/${response.data.token}`,
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "x-rapidapi-key":
              "b981cd2001msh5e29487ed2b4ebep118549jsn7a68667230b1",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        });
        jsonGetSolution = getSolution.data;
      }
    }
    if (jsonGetSolution.stdout) {
      const output = decodeURIComponent(escape(atob(jsonGetSolution.stdout)));
      this.setState({
        output: `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`,
      });
    } else if (jsonGetSolution.stderr) {
      const res = decodeURIComponent(
        escape(atob(jsonGetSolution.stderr || ""))
      );
      this.setState({
        output: `\n Error :${res}`,
      });
    } else {
      const res = decodeURIComponent(
        escape(atob(jsonGetSolution.compile_output || ""))
      );
      this.setState({
        output: `\n Error :${res}`,
      });
    }
  };

  render() {
    return (
      <>
        <div className="header">
          <nav className="navigation">
            <h1 className="heading">AccioJob</h1>
            <select
              value={this.state.language_id}
              onChange={this.language}
              id="tags"
              className="form-control form-inline language options"
            >
              <option value="54">C++</option>
              <option value="62">Java</option>
              <option value="71">Python</option>
              <option value="63">Javascript</option>
            </select>
            <button type="submit" className="runbtn" onClick={this.submit}>
              <i className="fas fa-cog fa-fw"></i> Run
            </button>
          </nav>
        </div>

        <div className="grid-container">
          <div className="grid-item-code">
            <legend className="subhead "> Code Here</legend>
            <Editor
              height="75vh"
              defaultLanguage={this.props[this.state.language_id]}
              defaultValue={`\n \n \n \n \n`}
              theme="vs-dark"
              onChange={this.input}
            />
          </div>
          <div className="grid-item-output">
            <div>
              <legend className="subhead ">Output</legend>
              <textarea
                id="output"
                className="textbox"
                placeholder="Output Will be Visible Here"
                rows="14"
                cols="80"
                value={this.state.output}
                readOnly
              />
            </div>
          </div>
          <div className="grid-item-input">
            <legend className="subhead">User Input</legend>
            <br />
            <textarea
              id="input"
              className="textbox"
              placeholder="Enter User's input"
              onChange={this.userInput}
              rows="14"
              cols="80"
            ></textarea>
          </div>
        </div>
      </>
    );
  }
}
