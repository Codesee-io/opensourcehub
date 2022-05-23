/**
 * Returns `true` if the request has a valid API key, or `false` otherwise.
 */
export function requestHasValidAPIKey(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const receivedToken = authHeader.substring("Bearer ".length);

    if (receivedToken === process.env.BOT_API_KEY) {
      return true;
    }
  }
  return false;
}
