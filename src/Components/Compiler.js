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
        "X-Auth-User": "a1133bc6-a0f6-46bf-a2d8-6157418c6fe2"
      },
      data: {
        source_code: `${this.state.input}`, // Error in state
        stdin: `${this.state.userInput}`, // - Error in state
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
            "X-Auth-User": "a1133bc6-a0f6-46bf-a2d8-6157418c6fe2"
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
              <option value="52">C++</option>
              {/* <option value="1">C</option> */}
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

// import React, { Component } from "react";
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { Navbar } from 'react-bootstrap';
// import "./Compiler.css";
// export default class Compiler extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       input: localStorage.getItem("input") || ``,
//       output: ``,
//       language_id: localStorage.getItem("language_Id") || 2,
//       user_input: ``,
//     };
//   }
//   input = (event) => {
//     event.preventDefault();

//     this.setState({ input: event.target.value });
//     localStorage.setItem("input", event.target.value);
//   };
//   userInput = (event) => {
//     event.preventDefault();
//     this.setState({ user_input: event.target.value });
//   };
//   language = (event) => {
//     event.preventDefault();

//     this.setState({ language_id: event.target.value });
//     localStorage.setItem("language_Id", event.target.value);
//   };

//   submit = async (e) => {
//     e.preventDefault();

//     let outputText = document.getElementById("output");
//     outputText.innerHTML = "";
//     outputText.innerHTML += "Creating Submission ...\n";
//     const response = await fetch(
//       "https://judge0-ce.p.rapidapi.com/submissions",
//       {
//         method: "POST",
//         headers: {
//           "content-type": "application/json",
//           "x-rapidapi-key":
//             "b981cd2001msh5e29487ed2b4ebep118549jsn7a68667230b1",
//           "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//           useQueryString: true,
//         },
//         query: {
//           base64_encoded: "true",
//           fields: "*",
//         },
//         body: JSON.stringify({
//           source_code: this.state.input,
//           stdin: this.state.user_input,
//           language_id: this.state.language_id,
//         }),
//       }
//     );
//     outputText.innerHTML += "Submission Created ...\n";
//     const jsonResponse = await response.json();

//     let jsonGetSolution = {
//       status: { description: "Queue" },
//       stderr: null,
//       compile_output: null,
//     };

//     while (
//       jsonGetSolution.status.description !== "Accepted" &&
//       jsonGetSolution.stderr == null &&
//       jsonGetSolution.compile_output == null
//     ) {
//       outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
//       if (jsonResponse.token) {
//         let url =
//           `https://judge0-ce.p.rapidapi.com/submissions/${response.data.token}`;

//         const getSolution = await fetch(url, {
//           method: "GET",
//           headers: {
//             "x-rapidapi-key":
//               "b981cd2001msh5e29487ed2b4ebep118549jsn7a68667230b1",
//             "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//             useQueryString: true,
//           },
//           query: {
//             base64_encoded: "true",
//             fields: "*",
//           },
//         });

//         jsonGetSolution = await getSolution.json();
//       }
//     }
//     if (jsonGetSolution.stdout) {
//       const output = atob(jsonGetSolution.stdout);

//       outputText.innerHTML = "";

//       outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
//     } else if (jsonGetSolution.stderr) {
//       const error = atob(jsonGetSolution.stderr);

//       outputText.innerHTML = "";

//       outputText.innerHTML += `\n Error :${error}`;
//     } else {
//       const compilation_error = atob(jsonGetSolution.compile_output);

//       outputText.innerHTML = "";

//       outputText.innerHTML += `\n Error :${compilation_error}`;
//     }
//   };
//   render() {
//     return (
//       <>
//         {/* <Navbar bg="primary" variant="dark" expand="lg">
//                     <Navbar.Brand href="#home">Online Compiler</Navbar.Brand>
//                 </Navbar> */}

//         <div className="row container-fluid">
//           <div className="col-6 ml-4 ">
//             <label htmlFor="solution ">
//               <span className="badge badge-info heading mt-2 ">
//                 <i className="fas fa-code fa-fw fa-lg" size="3"></i>&nbsp;
//                 <font size="3">Code Here</font>
//               </span>
//             </label>
//             <textarea
//               spellcheck="false"
//               required
//               name="solution"
//               id="source"
//               onChange={this.input}
//               className=" source"
//               value={this.state.input}
//             ></textarea>

//             <button
//               type="submit"
//               className="btn btn-danger ml-2 mr-2 "
//               onClick={this.submit}
//             >
//               <i class="fas fa-cog fa-fw"></i> Compile and Run
//             </button>

//             <label htmlFor="tags" className="mr-1">
//               <b className="heading">Language:</b>
//             </label>
//             <select
//               value={this.state.language_id}
//               onChange={this.language}
//               id="tags"
//               className="form-control form-inline mb-2 language"
//             >
//               <option value="54">C++</option>
//               <option value="76">C</option>
//               <option value="62">Java</option>
//               <option value="71">Python</option>
//               <option value="63">Javascript</option>
//               <option value="68">PHP</option>
//             </select>
//           </div>
//           <div className="col-5">
//             <div>
//               <span className="badge badge-info heading my-2 ">
//                 <i className="fas fa-exclamation fa-fw fa-md"></i>
//                 <font size="3">Output</font>
//               </span>
//               <textarea id="output"></textarea>
//             </div>
//           </div>
//         </div>

//         <div className="mt-2 ml-5">
//           <span className="badge badge-primary heading my-2 ">
//             <i className="fas fa-user fa-fw fa-md"></i>
//             <font size="3">User Input </font>
//           </span>
//           <br />
//           <textarea id="input" onChange={this.userInput}></textarea>
//         </div>
//       </>
//     );
//   }
// }
