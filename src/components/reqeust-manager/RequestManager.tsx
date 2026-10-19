import { useEffect, useMemo, useState } from "react";
// import RequestAuth from "./RequestAuth";
import RequestBody from "./RequestBody";
import RequestHeaders from "./RequestHeaders";
import RequestParams from "./RequestParams";
import ResponseViewer from "./reponse-viewer/ResponseViewer";
import useWorkerFetch from "../../hooks/use-worker-fetch";
import type { BodyType, RequestType } from "../../types/request-type";

type TabType = {
  label: string;
  count: number;
  value: "params" | "headers" | "body" | "auth";
};

export default function RequestManager({ data }: { data: RequestType | null }) {
  const [requestMethod, setRequestMethod] = useState(data?.method ?? "GET");
  const [requestUrl, setRequestUrl] = useState(data?.url ?? "");
  const [requestHeaders, _setRequestHeaders] = useState(data?.headers ?? []);
  const [requestParams, _setRequestParams] = useState(data?.params ?? []);
  // const [requestAuth, _setRequestAuth] = useState(data.auth ?? []);
  const [requestBody, setRequestBody] = useState<BodyType>(data?.body ?? { mode: "none" });
  const [currentTab, setCurrentTab] = useState<TabType>({
    label: "params",
    count: 0,
    value: "params",
  });
  const { fetchNetworkRequest, response, error, loading } = useWorkerFetch();

  function sendRequestHandler() {
    const request: RequestType = {
      url: requestUrl,
      method: requestMethod,
      headers: requestHeaders,
      params: requestParams,
      body: requestBody,

    }
    fetchNetworkRequest(request);
  }


  const getMethodColor = useMemo(() => {
    switch (requestMethod) {
      case "GET":
        return "#4ea965";
      case "POST":
        return "#5955b3";
      case "PUT":
        return "#d6a659";
      case "DELETE":
        return "#ca5959";
      case "PATCH":
        return "#d6a659";
      default:
        return "#4ea965";
    }
  }, [requestMethod])

  useEffect(() => {
    if (requestBody.mode === "none") {
      setRequestMethod("GET");
    } else {
      setRequestMethod("POST");
    }
  }, [requestBody]);

  return (
    <section className="bg-background w-full flex items-stretch justify-start flex-col">
      {/* URL and Method inputs */}
      <div className="flex items-center gap-1 p-4 mb-2">
        <select
          value={requestMethod}
          onChange={({ target }) => setRequestMethod(target.value)}
          style={{ color: getMethodColor }}
          className="bg-foreground text-primary-text border border-border rounded-xs py-2 px-4 focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer hover:bg-foreground-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          type="text"
          placeholder="Enter URL here ..."
          value={requestUrl}
          onChange={({ target }) => setRequestUrl(target.value)}
          className="bg-foreground text-primary-text placeholder:text-muted-text border border-border focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 rounded-xs py-2 px-4 flex-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          className="bg-secondary px-6 py-2 leading-6.5 rounded-xs text-background font-semibold transition-colors duration-150 enabled:cursor-pointer enabled:hover:bg-secondary-hover disabled:bg-secondary-dark/30 disabled:text-muted-text disabled:cursor-not-allowed disabled:hover:bg-secondary-dark/30 data-[loading=true]:bg-secondary/50 data-[loading=true]:cursor-not-allowed data-[loading=true]:hover:bg-secondary/50"
          onClick={sendRequestHandler}
          disabled={!requestMethod || requestUrl.length < 5}
          data-loading={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2 text-primary-text">
              <div className="w-4 h-4 border-2 border-t-transparent border-primary-text rounded-full animate-spin"></div>
              <span className="animate-pulse">sending...</span>
            </div>
          ) : (
            "send"
          )}
        </button>
      </div>
      {/* Tabs container (Params - headers - Body - cookies - response) */}
      <div className="px-4">
        <div className="w-full flex flex-col items-stretch justify-start border border-border rounded-xs overflow-hidden">
          {/* tabs buttons */}
          <ul className="w-full grid grid-cols-4 bg-background-secondary border-b border-border items-center justify-start">
            <li>
              <button
                type="button"
                className={`relative w-full flex items-center justify-center text-center cursor-pointer capitalize px-6 py-4 transition-colors ${currentTab.value === "params" ? "bg-foreground text-secondary font-medium" : "bg-background-secondary text-secondary-text hover:text-primary-text hover:bg-foreground-hover/40 font-normal"}`}
                onClick={() => setCurrentTab({ label: "params", count: 0, value: "params" })}
              >
                params
                <span className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ease-in-out ${currentTab.value === "params" ? "bg-secondary" : "bg-transparent"}`} />
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`relative w-full flex items-center justify-center text-center cursor-pointer capitalize px-6 py-4 transition-colors ${currentTab.value === "headers" ? "bg-foreground text-secondary font-medium" : "bg-background-secondary text-secondary-text hover:text-primary-text hover:bg-foreground-hover/40 font-normal"}`}
                onClick={() => setCurrentTab({ label: "headers", count: 0, value: "headers" })}
              >
                headers
                <span className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ease-in-out ${currentTab.value === "headers" ? "bg-secondary" : "bg-transparent"}`} />
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`relative w-full flex items-center justify-center text-center cursor-pointer capitalize px-6 py-4 transition-colors ${currentTab.value === "body" ? "bg-foreground text-secondary font-medium" : "bg-background-secondary text-secondary-text hover:text-primary-text hover:bg-foreground-hover/40 font-normal"}`}
                onClick={() => setCurrentTab({ label: "body", count: 0, value: "body" })}
              >
                body
                <span className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ease-in-out ${currentTab.value === "body" ? "bg-secondary" : "bg-transparent"}`} />
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`relative w-full flex items-center justify-center text-center cursor-pointer capitalize px-6 py-4 transition-colors ${currentTab.value === "auth" ? "bg-foreground text-secondary font-medium" : "bg-background-secondary text-secondary-text hover:text-primary-text hover:bg-foreground-hover/40 font-normal"}`}
                onClick={() => setCurrentTab({ label: "auth", count: 0, value: "auth" })}
              >
                auth
                <span className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ease-in-out ${currentTab.value === "auth" ? "bg-secondary" : "bg-transparent"}`} />
              </button>
            </li>
          </ul>
          <div className="bg-foreground">
            {currentTab.value === "params" && (
              <RequestParams initialValue={requestParams} />
            )}
            {currentTab.value === "headers" && (
              <RequestHeaders initialValue={requestHeaders} />
            )}
            {currentTab.value === "body" && (
              <RequestBody initialValue={requestBody} onChange={setRequestBody} />
            )}
            {/*{currentTab.value === "auth" && (
              <RequestAuth initialValue={requestAuth} />
            )} */}
          </div>
        </div>
      </div>
      {/* response result container */}
      {error && (
        <p role="alert" className="mx-4 mt-4 rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-red-700">
          Request failed: {error.message}
        </p>
      )}
      {response && <ResponseViewer response={response} />}
    </section>
  );
}
