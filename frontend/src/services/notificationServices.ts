import { getToken } from "../auth/userAuth";

export async function subscribeUser(publicKey: string, userId: string): Promise<void> {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');

      const subscription: PushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      const url = 'http://localhost:3000/api/v1/user/save-subscription';
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ subscription, userId }),
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ getToken() }`
        }
      });
      const push = await res.json();
      alert(push.message);
    } catch (err) {
      console.error('Push error:', err);
    }
  } else {
    alert('Push not supported!');
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
