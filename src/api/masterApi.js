import http from "./http";

export const masterApi = {
  list: async (endpoint, params = {}) =>
    (
      await http.get(
        endpoint,
        { params }
      )
    ).data,

  get: async (endpoint, id) =>
    (
      await http.get(
        `${endpoint}/${id}`
      )
    ).data,

  create: async (endpoint, payload) =>
    (
      await http.post(
        endpoint,
        payload
      )
    ).data,

  update: async (endpoint, id, payload) =>
    (
      await http.put(
        `${endpoint}/${id}`,
        payload
      )
    ).data,

  setStatus: async (
    endpoint,
    id,
    isActive
  ) =>
    (
      await http.patch(
        `${endpoint}/${id}/status`,
        { isActive }
      )
    ).data
};