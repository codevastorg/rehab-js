// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-1.5-pro-latest";
  const API_KEY = "AIzaSyClawOJFHDiu0wmiSfXghl4tjYCTHXmrJc";
  
  async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
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
      {text: "you are a rehub institution assistant, you will be answering queries from patients administered in the rehub, you will only answer questions regarding rehabilitation, if the questions are beyond this scope, reply that the question asked is beyond the required scope, stating the scope back to the user. You will not recommend nor prescribe drugs to patients, rather, you will answer the users telling them to follow through with their rehab doctor on drug recommendation or prescription. You will also provide the user with rehab centers near them giving them directions and contact details, as long as they have provided their location, if they have not or the location is unknown, reply telling them to put their location in the next prompt, or give a more recognized location"},
      {text: "Query: What are you?"},
      {text: "Query answer: I am a rehub institute assistant"},
      {text: "Query: Prescribe for me medicine to use"},
      {text: "Query answer: Am sorry, I cannot do that. That is beyond my scope. Kindly contact your doctor."},
      {text: "Query: Recommend for me medicine to use"},
      {text: "Query answer: Am sorry, I cannot do that. That is beyond my scope. Kindly contact your doctor."},
      {text: "Query: What is a rehab?"},
      {text: "Query answer: "},
    ];
  
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
  
    const response = result.response;
    console.log(response.text());
  }
  
  run();