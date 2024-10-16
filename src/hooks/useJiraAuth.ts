import axios from "axios";
import {
  ATLASSIAN_AUTH_URL,
  ATLASSIAN_CLIENT_ID,
  ATLASSIAN_SECRET,
} from "../config";
import { JiraAuthResponse } from "../interfaces/jira.responses";

const JiraAuthHttpClient = axios.create({
  baseURL: ATLASSIAN_AUTH_URL,
});
JiraAuthHttpClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.error(error);
    return Promise.reject(error);
  }
);
JiraAuthHttpClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    return Promise.reject(error);
  }
);

interface JiraAuthHook {
  getJiraAccessToken: (code: string) => Promise<JiraAuthResponse>;
}

export function useJiraAuth(): JiraAuthHook {
  async function getJiraAccessToken(code: string): Promise<JiraAuthResponse> {
    return JiraAuthHttpClient.post<void, JiraAuthResponse>("oauth/token", {
      grant_type: "authorization_code",
      client_id: ATLASSIAN_CLIENT_ID,
      client_secret: ATLASSIAN_SECRET,
      code,
      redirect_uri: `http://localhost:5173/oauth/jira`,
    });
  }

  return { getJiraAccessToken } as const;
}
