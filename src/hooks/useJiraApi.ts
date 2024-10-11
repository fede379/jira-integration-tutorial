import axios from "axios";
import { ATLASSIAN_API_URL } from "../config";
import { getJiraTokenFromLocalStorage } from "../utils/storage";

const JiraApiHttpClient = axios.create({
  baseURL: ATLASSIAN_API_URL,
});
JiraApiHttpClient.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${getJiraTokenFromLocalStorage()}`;
    return config;
  },
  function (error) {
    console.error(error);
    return Promise.reject(error);
  }
);
JiraApiHttpClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    return Promise.reject(error);
  }
);

export interface JiraResource {
  id: string;
  name: string;
  url: string;
  scopes: string[];
  avatarUrl: string;
}

interface JiraAuthHook {
  getJiraResources: () => Promise<JiraResource[]>;
}

export function useJiraApi(): JiraAuthHook {
  async function getJiraResources(): Promise<JiraResource[]> {
    return JiraApiHttpClient.get<void, JiraResource[]>(
      "/oauth/token/accessible-resources"
    );
  }

  return { getJiraResources } as const;
}
