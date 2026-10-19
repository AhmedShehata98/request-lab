// import SyntaxHighlighter from "react-syntax-highlighter";
// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
// import JsonView from "@uiw/react-json-view";
import RequestManager from "./components/reqeust-manager/RequestManager";

declare const chrome: {
  runtime: {
    sendMessage: (
      message: unknown,
      callback: (response: unknown) => void,
    ) => void;
  };
};

function App() {
  return <RequestManager data={null} />;
}

export default App;
