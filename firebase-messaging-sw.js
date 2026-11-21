self.addEventListener("push", function(event) {

    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch (error) {
        data = {
            body: event.data ? event.data.text() : "You have a new message ❤️"
        };
    }

    const title = data.title || "JUST US ❤️";

    const options = {
        body: data.body || "Someone has sent you a message.",
        data: {
            url: data.url || "/"
        },
        tag: "just-us-notification",
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );

});


self.addEventListener("notificationclick", function(event) {

    event.notification.close();

    const targetUrl = new URL(
        event.notification.data.url || "/",
        self.location.origin
    );

    event.waitUntil(

        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then(function(clientList) {

            for (const client of clientList) {

                if (client.url.startsWith(self.location.origin)) {
                    return client.navigate(targetUrl.href)
                        .then(function(c) {
                            return c.focus();
                        });
                }

            }

            return clients.openWindow(targetUrl.href);

        })

    );

});
