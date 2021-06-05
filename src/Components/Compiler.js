import axios from "axios";
import React, { Component } from "react";

import "./Compiler.css";
export default class Compiler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: localStorage.getItem("input") || ``,
      output: ``,
      language_id: localStorage.getItem("language_Id") || 52,
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

  submit = async (e) => {
    e.preventDefault();

    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    console.log(JSON.stringify(this.state.input));
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
        source_code:
          "I2luY2x1ZGUgPHN0ZGlvLmg+CgppbnQgbWFpbih2b2lkKSB7CiAgY2hhciBuYW1lWzEwXTsKICBzY2FuZigiJXMiLCBuYW1lKTsKICBwcmludGYoImhlbGxvLCAlc1xuIiwgbmFtZSk7CiAgcmV0dXJuIDA7Cn0=", // Error in state
        stdin: "SnVkZ2Uw", // - Error in state
        language_id: this.state.language_id,
      },
    });
    outputText.innerHTML += "Submission Created ...\n";
    console.log(response.data.token);

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
      const error = atob(jsonGetSolution.stderr);

      outputText.innerHTML = "";

      outputText.innerHTML += `\n Error :${error}`;
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);

      outputText.innerHTML = "";

      outputText.innerHTML += `\n Error :${compilation_error}`;
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
              <option value="2">C++</option>
              <option value="1">C</option>
              <option value="4">Java</option>
              <option value="10">Python</option>
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
            <textarea
              required
              name="solution"
              id="source"
              onChange={this.input}
              className=" source textbox"
              value={this.state.input}
              placeholder="Type Your Code Here"
              rows="34"
              cols="80"
            ></textarea>
          </div>
          <div className="grid-item-output">
            <div>
              {/* <span className="subhead ">Output
              </span> */}
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
