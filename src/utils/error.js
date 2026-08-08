export function getApiError(error, fallback = "Something went wrong") {
  const data = error?.response?.data;
  if (Array.isArray(data?.details)) return `${data.message}: ${data.details.join(", ")}`;
  if (data?.details && typeof data.details === "object") {
    return `${data.message}: ${Object.entries(data.details).map(([k, v]) => `${k}=${v}`).join(", ")}`;
  }
  return data?.message || error?.message || fallback;
}
