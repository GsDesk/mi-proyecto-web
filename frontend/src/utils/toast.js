// Lightweight toast utility that uses Bootstrap classes when running in web (document exists).
// On native, falls back to Alert.alert.
import { Alert } from 'react-native';

export function showToast(title, message, type = 'info', timeout = 4000) {
  if (typeof document === 'undefined') {
    // Native fallback
    Alert.alert(title || (type === 'error' ? 'Error' : 'Info'), message);
    return;
  }

  // Ensure container
  let container = document.getElementById('rnweb-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'rnweb-toast-container';
    container.style.position = 'fixed';
    container.style.top = '16px';
    container.style.right = '16px';
    container.style.zIndex = 99999;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bsClass = type === 'error' ? 'alert-danger' : type === 'success' ? 'alert-success' : 'alert-info';
  toast.className = `alert ${bsClass} shadow-sm`;
  toast.style.marginBottom = '8px';
  toast.style.minWidth = '220px';

  if (title) {
    const strong = document.createElement('strong');
    strong.textContent = title + ' ';
    toast.appendChild(strong);
  }
  const span = document.createElement('span');
  span.textContent = message || '';
  toast.appendChild(span);

  container.appendChild(toast);

  setTimeout(() => {
    // fade out
    toast.style.transition = 'opacity 0.4s ease';
    toast.style.opacity = '0';
    setTimeout(() => container.removeChild(toast), 400);
  }, timeout);
}

export default showToast;
