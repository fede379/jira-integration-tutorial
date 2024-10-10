export function getJiraConsentUrl(): string {
  const ATLASSIAN_CLIENT_ID = "vILo9cuIgJwJADeFVGaioo4THjAfdNA7";
  const ATLASSIAN_AUTH_URL = "https://auth.atlassian.com/authorize";
  const redirectUri = encodeURIComponent(`http://localhost:5173/oauth/jira`);
  const scopes = encodeURIComponent(
    "read:jira-work write:jira-work read:me offline_access"
  );
  return `${ATLASSIAN_AUTH_URL}?state=user_id&scope=${scopes}&client_id=${ATLASSIAN_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&prompt=consent&audience=api.atlassian.com`;
}
