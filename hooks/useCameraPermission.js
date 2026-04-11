import { useEffect, useState } from 'react';
import { Camera } from 'react-native-vision-camera';

export function useCameraPermission() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAndRequestPermission();
  }, []);

  async function checkAndRequestPermission() {
    try {
      // Check current status first
      const currentStatus = await Camera.getCameraPermissionStatus();

      if (currentStatus === 'granted') {
        setHasPermission(true);
      } else if (currentStatus === 'not-determined') {
        // First time — request it
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'granted');
      } else {
        // 'denied' or 'restricted' — user must go to Settings
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }

  return { hasPermission, isLoading };
}