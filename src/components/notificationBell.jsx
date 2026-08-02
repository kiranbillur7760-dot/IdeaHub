import { useEffect, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../services/notificationApi";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const notificationRes = await getNotifications();
      const countRes = await getUnreadCount();

      setNotifications(notificationRes.data);
      setCount(countRes.data.count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-2xl"
      >
        🔔

        {count > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-red-500
            text-white rounded-full text-xs px-2"
          >
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">

          {notifications.length === 0 ? (
            <p className="p-4">
              No notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() =>
                  handleRead(notification._id)
                }
                className={`p-3 border-b cursor-pointer
                  ${
                    notification.isRead
                      ? "bg-white"
                      : "bg-blue-50"
                  }`}
              >
                <p>{notification.message}</p>

                <small>
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </small>
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}

export default NotificationBell;