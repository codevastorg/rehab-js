import React, { useState } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const API_KEY = "AIzaSyClawOJFHDiu0wmiSfXghl4tjYCTHXmrJc";
const MODEL_NAME = "gemini-1.5-pro-latest";
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [promptResponse, setPromptResponse] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");

  const context =
    "You are a ReHub institution assistant. Your role is to answer queries from patients at ReHub regarding their rehabilitation. If questions are outside of this scope, inform users accordingly.";

  const handlePromptSubmit = async () => {
    if (!inputPrompt) {
      alert("Please enter a prompt");
      return;
    }
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    const parts = [{ text: context }, { text: `Query: ${inputPrompt}` }];

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });
      const response = await result.response;
      const text = await response.text();
      setPromptResponse(text);
    } catch (error) {
      console.error(error);
      alert(error?.message ?? "Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1>Welcome to ReHub Assistant</h1>
          <p className="lead">
            Enter your rehabilitation-related queries below and get instant guidance from our smart assistant. Please keep your questions relevant to rehabilitation topics.
          </p>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control custom-focus"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Type your prompt here"
              onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
              onBlur={(e) => e.target.style.borderColor = '#ced4da'}
            />
            <div className="input-group-append" style={{ marginLeft: "8px" }}>
              <button className="btn btn-primary" onClick={handlePromptSubmit}>
                Submit Prompt
              </button>
            </div>
          </div>
          <div>
            <h2>Response:</h2>
            <p className="response">{promptResponse}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
