import axios from "axios";
import React, { Component } from "react";
import Editor from "@monaco-editor/react";
import "./Compiler.css";
export default class Compiler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: localStorage.getItem("input") || ``,
      output: ``,
      language_id: localStorage.getItem("language_Id") || 54,
      user_input: ``,
    };
  }
  input = (event) => {
    event.preventDefault();

    this.setState({ input: event.target.value });
    localStorage.setItem("input", event.target.value);
  };
  userInput = (event) => {
    event.preventDefault();
    this.setState({ user_input: event.target.value });
  };
  language = (event) => {
    event.preventDefault();

    this.setState({ language_id: event.target.value });
    localStorage.setItem("language_Id", event.target.value);
  };
  encode = (input) => {
    return btoa(unescape(encodeURIComponent(input || "")));
  };
  getLanguage = (languageId) => {
    switch (parseInt(languageId)) {
      case 54:
        return "c++";
      case 62:
        return "java";
      case 71:
        return "python";
      case 63:
        return "javascript";
      default:
        return "c++";
    }
  };

  submit = async (e) => {
    e.preventDefault();

    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    const response = await axios.request({
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key": "b981cd2001msh5e29487ed2b4ebep118549jsn7a68667230b1",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "X-Auth-User": "a1133bc6-a0f6-46bf-a2d8-6157418c6fe2",
      },
      data: {
        source_code: this.encode(this.state.input), // Error in state
        stdin: this.encode(this.state.user_input), // - Error in state
        language_id: parseInt(this.state.language_id),
      },
    });
    outputText.innerHTML += "Submission Created ...\n";

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
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
      if (response.data.token) {
        const getSolution = await axios.request({
          method: "GET",
          url: `https://judge0-ce.p.rapidapi.com/submissions/${response.data.token}`,
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "x-rapidapi-key":
              "b981cd2001msh5e29487ed2b4ebep118549jsn7a68667230b1",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "X-Auth-User": "a1133bc6-a0f6-46bf-a2d8-6157418c6fe2",
          },
        });
        jsonGetSolution = getSolution.data;
      }
    }
    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);

      outputText.innerHTML = "";

      outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
    } else if (jsonGetSolution.stderr) {
      let escaped = escape(atob(jsonGetSolution.stderr || ""));
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${decodeURIComponent(escaped)}`;
    } else {
      let escaped = escape(atob(jsonGetSolution.compile_output || ""));
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${decodeURIComponent(escaped)}`;
    }

    localStorage.clear();
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
              <label for="tags" className="mr-1">
                <b className="heading">Language:</b>
              </label>
            </select>
            <button type="submit" className="runbtn" onClick={this.submit}>
              <i class="fas fa-cog fa-fw"></i> Run
            </button>
          </nav>
        </div>

        <div className="grid-container">
          <div className="grid-item-code">
            <legend className="subhead "> Code Here</legend>
            {/* <textarea
              required
              name="solution"
              id="source"
              onChange={this.input}
              className=" source textbox"
              value={this.state.input}
              placeholder="Type Your Code Here"
              rows="34"
              cols="80"
              spellCheck={false}
            ></textarea> */}
            <Editor
              height="50vh"
              defaultLanguage="c++"
              defaultValue="// some comment"
              theme="vs-dark"
            />
          </div>
          <div className="grid-item-output">
            <div>
              <legend className="subhead "> Output</legend>
              <textarea
                id="output"
                className="textbox"
                placeholder="Output Will be Visible Here"
                rows="14"
                cols="80"
              ></textarea>
            </div>
          </div>
          <div className="grid-item-input">
            <legend className="subhead ">User Input</legend>
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
