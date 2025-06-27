self.addEventListener('push', function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/goal.svg'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});