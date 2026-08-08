import http from "./http";

export const reportApi = {
  list: async (params = {}) =>
    (await http.get("/reports/purchase-orders", { params })).data,
  exportCsv: async (params = {}) =>
    (
      await http.get("/reports/purchase-orders/export", {
        params,
        responseType: "blob",
      })
    ).data,
};
