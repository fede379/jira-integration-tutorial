import axios from "axios";
import { ATLASSIAN_API_URL } from "../config";
import {
  getCloudIdFromLocalStorage,
  getJiraTokenFromLocalStorage,
} from "../utils/storage";
import { useCallback } from "react";
import { JiraResource } from "../interfaces/jira.responses";

const ACCESSIBLE_RESOURCES_URL = "oauth/token/accessible-resources";

const JiraApiHttpClient = axios.create({
  baseURL: ATLASSIAN_API_URL,
});
JiraApiHttpClient.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${getJiraTokenFromLocalStorage()}`;
    const cloudId = getCloudIdFromLocalStorage();
    if (cloudId && !config.url?.includes(ACCESSIBLE_RESOURCES_URL)) {
      config.baseURL = `${ATLASSIAN_API_URL}/ex/jira/${cloudId}/rest/api/3/`;
    }
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

interface JiraApiHook {
  getJiraResources: () => Promise<JiraResource[]>;
  fetcher: <T>(args: {
    url: string;
    params?: Record<string, unknown>;
  }) => Promise<T>;
}

export function useJiraApi(): JiraApiHook {
  async function getJiraResources(): Promise<JiraResource[]> {
    return JiraApiHttpClient.get<void, JiraResource[]>(
      ACCESSIBLE_RESOURCES_URL
    );
  }

  const fetcher = useCallback(function <T>(args: {
    url: string;
    params?: Record<string, unknown>;
  }): Promise<T> {
    return JiraApiHttpClient.get<void, T>(args.url, { params: args.params });
  },
  []);

  return { getJiraResources, fetcher } as const;
}
