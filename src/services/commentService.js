import API from "./api";

export const getComments = (ideaId) =>
  API.get(`/ideas/${ideaId}/comments`);

export const addComment = (ideaId, text) =>
  API.post(`/ideas/${ideaId}/comments`, { text });

export const deleteComment = (ideaId, commentId) =>
  API.delete(`/ideas/${ideaId}/comments/${commentId}`);