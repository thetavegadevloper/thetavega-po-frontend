import http from "./http";

export const poApi = {
  list: async (params = {}) =>
    (await http.get("/purchase-orders", { params })).data,
  get: async (id) => (await http.get(`/purchase-orders/${id}`)).data,
  create: async (payload) =>
    (await http.post("/purchase-orders", payload)).data,
  update: async (id, payload) =>
    (await http.put(`/purchase-orders/${id}`, payload)).data,
  submit: async (id, comment = "") =>
    (await http.post(`/purchase-orders/${id}/submit`, { comment })).data,
  approve: async (id, comment = "") =>
    (await http.post(`/purchase-orders/${id}/approve`, { comment })).data,
  reject: async (id, reason) =>
    (await http.post(`/purchase-orders/${id}/reject`, { reason })).data,
  issue: async (id) => (await http.post(`/purchase-orders/${id}/issue`)).data,
  revise: async (id, reason) =>
    (await http.post(`/purchase-orders/${id}/revise`, { reason })).data,
  cancel: async (id, reason) =>
    (await http.post(`/purchase-orders/${id}/cancel`, { reason })).data,
  close: async (id, remarks = "") =>
    (await http.post(`/purchase-orders/${id}/close`, { remarks })).data,
  audit: async (id) =>
    (await http.get(`/purchase-orders/${id}/audit`)).data,
  attachments: async (id) =>
    (await http.get(`/purchase-orders/${id}/attachments`)).data,
  uploadAttachment: async (id, file, fileType = "Supporting Document") => {
    const body = new FormData();
    body.append("file", file);
    body.append("fileType", fileType);
    return (
      await http.post(`/purchase-orders/${id}/attachments`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },
  downloadAttachment: async (id, attachmentId) =>
    (
      await http.get(`/purchase-orders/${id}/attachments/${attachmentId}/download`, {
        responseType: "blob",
      })
    ).data,
  pdfBlob: async (id, { preview = false, download = false } = {}) =>
    (
      await http.get(`/purchase-orders/${id}/pdf`, {
        params: { preview, download },
        responseType: "blob",
      })
    ).data,
  regeneratePdf: async (id, reason = "") =>
    (await http.post(`/purchase-orders/${id}/pdf/regenerate`, { reason })).data,
  email: async (id, payload) =>
    (await http.post(`/purchase-orders/${id}/email`, payload)).data,
};
