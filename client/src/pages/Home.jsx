import { useState } from 'react';
import './Home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [input, setInput] = useState(localStorage.getItem('input') || '');
  const [output, setOutput] = useState('');
  const [languageId, setLanguageId] = useState(
    localStorage.getItem('language_Id') || '71'
  );
  const [userInput, setUserInput] = useState('');
  const [username, setUsername] = useState('');

  const navigate=useNavigate()

  const handleInput = (event) => {
    setInput(event.target.value);
    localStorage.setItem('input', event.target.value);
  };

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguageId(event.target.value);
    localStorage.setItem('language_Id', event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          method: 'POST',
          headers: {
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key':
              'b446598641msh9d0150766c105efp18b848jsn8a6329888a71', // Put your RapidAPI key here
            'content-type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({
            source_code: input,
            stdin: userInput,
            language_id: languageId,
          }),
        }
      );

      const jsonResponse = await response.json();

      let jsonGetSolution = {
        status: { description: 'Queue' },
        stderr: null,
        compile_output: null,
      };

      while (
        jsonGetSolution.status.description !== 'Accepted' &&
        jsonGetSolution.stderr == null &&
        jsonGetSolution.compile_output == null
      ) {
        if (jsonResponse.token) {
          let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

          const getSolution = await fetch(url, {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
              'x-rapidapi-key':
                'b446598641msh9d0150766c105efp18b848jsn8a6329888a71', // Put your RapidAPI key here
              'content-type': 'application/json',
            },
          });

          jsonGetSolution = await getSolution.json();
        }
      }

      if (jsonGetSolution.stdout) {
        const result = atob(jsonGetSolution.stdout);
        setOutput(result);
      } else if (jsonGetSolution.stderr) {
        const error = atob(jsonGetSolution.stderr);
        setOutput(error);
      } else {
        const compilationError = atob(jsonGetSolution.compile_output);
        setOutput(compilationError);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user', {
        username: username,
        code_language: languageId,
        input_code: input,
        stdin: userInput,
      });

      if (response.status === 201) {
        console.log('User input saved successfully!', response.data);
        // Optionally, you can reset the input fields after successful save
        setInput('');
        setUserInput('');
        setUsername('');
      } else {
        console.error('Failed to save user input:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving user input:', error);
    }
  };

  return (
    <div className="CodeEditor-container">
      <header className="CodeEditor-header">
        <h1>Harshit Online Compiler</h1>
        <button onClick={() => navigate('/table')}>Saved Codes</button>
      </header>

      <div className="CodeEditor-content">
        <div className="CodeEditor-left-section">
          <div className="leftup">
            <div className="CodeEditor-dropdown">
              <label htmlFor="tags" className="heading">
                <b>Language:</b>
              </label>
              <select
                value={languageId}
                onChange={handleLanguageChange}
                id="tags"
                className="form-control form-inline language"
              >
                <option value="54">C++</option>
                <option value="50">C</option>
                <option value="62">Java</option>
                <option value="71">Python</option>
              </select>
            </div>
            <div className="CodeEditor-username-input">
              <label htmlFor="username" className="heading">
                <b>Username:</b>
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button className="btn CodeEditor-save-button" onClick={handleSave}>
              Save
            </button>
          </div>
          <textarea
            required
            name="solution"
            id="source"
            onChange={handleInput}
            className="CodeEditor-code-textarea"
            value={input}
          ></textarea>
          <button
            type="submit"
            className="btn CodeEditor-run-button"
            onClick={handleSubmit}
          >
            Run
          </button>
        </div>
        <div className="CodeEditor-right-section">
          <div className="CodeEditor-right-up">
            <textarea
              id="input"
              onChange={handleUserInput}
              className="CodeEditor-input-textarea"
            ></textarea>
          </div>
          <div className="CodeEditor-right-bottom">
            <pre id="output">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
