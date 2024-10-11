import { ATLASSIAN_AUTH_URL, ATLASSIAN_CLIENT_ID } from "../config";

export function getJiraConsentUrl(): string {
  const redirectUri = encodeURIComponent(`http://localhost:5173/oauth/jira`);
  const scopes = encodeURIComponent(
    "read:jira-work write:jira-work read:me offline_access"
  );
  return `${ATLASSIAN_AUTH_URL}/authorize?state=user_id&scope=${scopes}&client_id=${ATLASSIAN_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&prompt=consent&audience=api.atlassian.com`;
}
