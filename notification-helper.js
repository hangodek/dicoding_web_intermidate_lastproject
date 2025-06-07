// Convert base64 string to Uint8Array for applicationServerKey
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if push notifications are supported
export function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

// Get the registered service worker
async function getRegisteredServiceWorker() {
  if (!isPushNotificationSupported()) {
    return null;
  }
  
  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error('Error getting service worker registration:', error);
    return null;
  }
}

// Request permission and subscribe to push notifications
export async function subscribeToPushNotification() {
  try {
    // Check if service worker is ready
    const registration = await getRegisteredServiceWorker();
    if (!registration) {
      console.error('No service worker registration found');
      return false;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      console.log('User is already subscribed to push notifications');
      
      // Send existing subscription to server to ensure it's registered
      await sendSubscriptionToServer(subscription);
      return subscription;
    }

    // Get VAPID public key - using the provided key from documentation
    const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
    
    // Subscribe the user
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(vapidPublicKey)
    });

    console.log('User successfully subscribed to push notifications');
    
    // Send subscription to server
    const result = await sendSubscriptionToServer(subscription);
    
    return result ? subscription : false;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
}

// Send subscription data to server using the correct endpoint from docs
async function sendSubscriptionToServer(subscription) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('User token not found');
    return false;
  }

  try {
    console.log('Sending subscription to server:', subscription);
    
    // Format subscription data according to the API documentation
    const subscriptionJson = subscription.toJSON();
    const subscriptionData = {
      endpoint: subscriptionJson.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode.apply(null, 
          new Uint8Array(subscription.getKey('p256dh')))),
        auth: btoa(String.fromCharCode.apply(null, 
          new Uint8Array(subscription.getKey('auth'))))
      }
    };
    
    // Use the correct endpoint from documentation
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscriptionData)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send subscription to server');
    }
    
    console.log('Subscription sent to server successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending subscription to server:', error);
    return false;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotification() {
  try {
    const registration = await getRegisteredServiceWorker();
    if (!registration) return false;
    
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return true; // Already unsubscribed
    
    // First remove from server
    await unsubscribeFromServer(subscription);
    
    // Then remove from browser
    const result = await subscription.unsubscribe();
    return result;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

// Unsubscribe from server
async function unsubscribeFromServer(subscription) {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Use the correct endpoint and method from documentation
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to unsubscribe from server');
    }
    
    return true;
  } catch (error) {
    console.error('Error unsubscribing from server:', error);
    return false;
  }
}