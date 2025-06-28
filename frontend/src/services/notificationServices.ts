import { getToken } from "../auth/userAuth";
import { toast } from 'react-toastify';

export async function subscribeUser(publicKey: string, userId: string): Promise<void> {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Check if already subscribed
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        console.log('Already subscribed');
        return;
      }

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

export const showToast = (text:string, status?:string)=>{
  if(status==='Ok'){
    return toast.success(text);
  }
  else if(status==='Error'){
    return toast.error(text)
  }
  else if(status==='Warning'){
    return toast.warn(text);
  }
  return toast(text);
}
