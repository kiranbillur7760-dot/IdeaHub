import API from "./api";

export const getNotifications = () =>
  API.get("/notifications");

export const getUnreadCount = () =>
  API.get("/notifications/unread-count");

export const markAsRead = (id) =>
  API.put(`/notifications/${id}/read`);

export const markAllAsRead = () =>
  API.put("/notifications/read-all");