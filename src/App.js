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

  const context = [
    "you are a rehub institution assistant, you will be answering queries from patients administered in the rehub, you will only answer questions regarding rehabilitation. If the questions are beyond this scope, reply that the question asked is beyond the required scope, stating the scope back to the user. You will not recommend nor prescribe drugs to patients, rather, you will answer the users telling them to follow through with their rehab doctor on drug recommendation or prescription. You will also provide the user with rehab centers near them giving them directions and contact details, as long as they have provided their location, if they have not or the location is unknown, reply telling them to put their location in the next prompt, or give a more recognized location.",
  ];

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
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    const parts = [
      { text: context[0] },
      { text: `Query: ${inputPrompt}` },
      { text: "Query answer: " },
    ];

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
    <div>
      <h1>Enter Your Prompt</h1>
      <input
        type="text"
        value={inputPrompt}
        onChange={(e) => setInputPrompt(e.target.value)}
        placeholder="Type your prompt here"
      />
      <button onClick={handlePromptSubmit}>Submit Prompt</button>
      <div>
        <h2>Response:</h2>
        <p>{promptResponse || "No response yet."}</p>
      </div>
    </div>
  );
}

export default App;
