self.addEventListener("push", function(event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "通知";
  const body = data.body || "";

  // 🔥 通知表示
  const options = {
    body: body,
    icon: "icon.png",

    // ★ ここ重要：クリック用データ
    data: {
      url: data.url || "https://script.google.com/macros/s/AKfycbyBZLegcV8mJ_JXGzvTZ9kC2Q3p3BAqQb80chNl9SEIYyZvUFVi3WXHXGtnZU8j3DeO/exec"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


// =======================
// 🔥 通知クリック時の動作
// =======================
self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  const url = event.notification.data?.url;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // すでに開いてるタブがあればそれを使う
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        // なければ新しく開く
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});