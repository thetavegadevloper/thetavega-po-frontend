import http from "./http";

export const authApi = {
  login: async (payload) => (await http.post("/auth/login", payload)).data,
  me: async () => (await http.get("/auth/me")).data,
};
