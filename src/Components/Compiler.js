import axios from "axios";
import React, { Component } from "react";
// import { useMediaQuery } from "react-responsive";
import Editor from "@monaco-editor/react";
import "./Compiler.css";
import Header from "./Header/header";
import Modal from "react-modal";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default class Compiler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: localStorage.getItem("input") || "",
      output: "",
      language_id: localStorage.getItem("language_Id") || 54,
      user_input: "",
      theme: "vs-dark",
      modalIsOpen: false,
      secondModalIsOpen: false,
      windowWidth: window.innerWidth,
    };
  }
  static defaultProps = {
    54: "cpp",
    62: "java",
    71: "python",
    63: "javascript",
  };
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  closeSecondModal = () => {
    this.setState({ secondModalIsOpen: false });
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
        output: `Result :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`,
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
  openSecondModal = () => {
    this.submit();
    this.setState({ secondModalIsOpen: true });
    localStorage.clear();
  };
  changeTheme = () => {
    this.setState({
      theme: this.state.theme === "vs-light" ? "vs-dark" : "vs-light",
    });
  };
  
  render() {
    
    return (
      <>
        {/* Header Starts */}
        <Header />
        {/* Header Ends */}

        {/* Main Page Code Starts*/}
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-col">
            <div className="flex flex-col sm:flex-row mt-10">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx={12} cy={7} r={4} />
                  </svg>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
                    Question
                  </h2>
                  <div className="w-12 h-1 bg-red-500 rounded mt-2 mb-4" />
                  <p className="text-base">
                    Problem Statement / Quesiont Description will be shown here
                  </p>
                </div>
              </div>
              <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                {/* Language Selection Starts */}
                <header class="text-gray-600 bg-white body-font rounded-t-lg">
                  <div class="container mx-auto flex flex-wrap p-2 flex-col md:flex-row items-center">
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
                    <button
                      onClick={this.changeTheme}
                      class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                    >
                      Change Theme
                    </button>
                  </div>
                </header>
                {/* Language Selection Ends */}
                {/* Editon Code Starts */}
                <Editor
                  height="75vh"
                  defaultLanguage={this.props[this.state.language_id]}
                  defaultValue={`#include <iostream> \nusing namespace std; \n\nint main(){\n\t//Code Here\n\treturn 0;\n} `}
                  theme={this.state.theme}
                  onChange={this.input}
                />
                {/* Editor Code Ends */}

                {/* Submit Button Start */}
                <footer className="text-gray-600 bg-white body-font rounded-b-lg">
                  <div className="container py-3 px-3 mx-auto flex items-center sm:flex-row flex-col">
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                      <button
                        type="submit"
                        onClick={this.openModal}
                        className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded-full mr-2"
                      >
                        User Input
                      </button>
                      <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                      >
                        <button
                          onClick={this.closeModal}
                          className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded-full"
                        >
                          OK
                        </button>
                        <div>
                          <textarea
                            id="input"
                            className="textbox"
                            placeholder="Enter User's input"
                            onChange={this.userInput}
                            rows="14"
                            cols="80"
                          ></textarea>
                        </div>
                      </Modal>
                      <button
                        type="submit"
                        onClick={this.openSecondModal}
                        className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded-full"
                      >
                        Submit
                      </button>
                      <Modal
                        isOpen={this.state.secondModalIsOpen}
                        onRequestClose={this.closeSecondModal}
                        style={customStyles}
                      >
                        <button
                          className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded-full"
                          onClick={this.closeSecondModal}
                        >
                          close
                        </button>
                        <div>
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
                      </Modal>
                    </span>
                  </div>
                </footer>
                {/* Submit Button Ends */}
              </div>
            </div>
          </div>
        </section>
        {/* Main Page Code Ends */}
      </>
    );
  }
}
