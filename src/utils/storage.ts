const JIRA_AUTH = "JIRA_AUTH";
const JIRA_CLOUD_ID = "JIRA_CLOUD_ID";

export function saveJiraTokenIntoLocalStorage(accessToken: string) {
  window.localStorage.setItem(JIRA_AUTH, accessToken);
}

export function getJiraTokenFromLocalStorage() {
  return window.localStorage.getItem(JIRA_AUTH);
}

export function saveCloudIdIntoLocalStorage(accessToken: string) {
  window.localStorage.setItem(JIRA_CLOUD_ID, accessToken);
}

export function getCloudIdFromLocalStorage() {
  return window.localStorage.getItem(JIRA_CLOUD_ID);
}
