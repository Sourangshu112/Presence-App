import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
  runAsync,
  useCameraFormat,
} from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import { useCameraPermission } from '../hooks/useCameraPermission';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Circle dimensions — centered on screen
const CIRCLE_SIZE = 300;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const CIRCLE_CENTER_X = SCREEN_WIDTH / 2;
const CIRCLE_CENTER_Y = SCREEN_HEIGHT / 2;

export default function CameraScreen() {
  const { hasPermission, isLoading } = useCameraPermission();
  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [
    { fps: 30,
      videoResolution: '720p'  
    }
  ])

  const [faceInCircle, setFaceInCircle] = useState(false);

  const faceDetectionOptions = useRef({
    performanceMode: 'fast',
    landmarkMode: 'none',
    // 'all' is required so we get eyeOpenProbability for liveness check
    classificationMode: 'all',
    minFaceSize: 0.55,
    trackingEnabled: false,
    cameraFacing: 'front',
    // autoMode scales face bounds to screen coordinates
    // so we can directly compare against circle position
    autoMode: true,
    windowWidth: SCREEN_WIDTH,
    windowHeight: SCREEN_HEIGHT,
  }).current;

  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    return () => stopListeners();
  }, []);

  useEffect(() => {
    if (!device) stopListeners();
  }, [device]);

  const handleDetectedFaces = Worklets.createRunOnJS((faces) => {
    if (!faces || faces.length === 0) {
      setFaceInCircle(false);
      return;
    }

    const validFace = faces.find((face) => {
      // --- Liveness check: prevent photo/screen detection ---
      // A printed photo or screen will have static eye values
      // We require BOTH eyes to have a reasonable open probability
      // This won't work on a flat photo since MLKit returns null/low values
      const leftEye = face.leftEyeOpenProbability ?? 0;
      const rightEye = face.rightEyeOpenProbability ?? 0;
      const isLive = leftEye > 0.6 && rightEye > 0.6;

      if (!isLive) return false;

      // --- Circle bounds check ---
      // Check if face center falls within the circle
      const bounds = face.bounds;
      const faceCenterX = bounds.x + bounds.width / 2;
      const faceCenterY = bounds.y + bounds.height / 2;

      const distance = Math.sqrt(
        Math.pow(faceCenterX - CIRCLE_CENTER_X, 2) +
        Math.pow(faceCenterY - CIRCLE_CENTER_Y, 2)
      );

      return distance < CIRCLE_RADIUS;
    });

    setFaceInCircle(!!validFace);
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      runAsync(frame, () => {
        'worklet';
        const faces = detectFaces(frame);
        handleDetectedFaces(faces);
      });
    },
    [handleDetectedFaces, detectFaces]
  );

  // --- Loading ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  // --- No Permission ---
  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>🚫</Text>
        <Text style={styles.errorTitle}>Camera Access Denied</Text>
        <Text style={styles.errorSubtitle}>
          Please enable camera access in your device Settings.
        </Text>
      </View>
    );
  }

  // --- No Device ---
  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>📷</Text>
        <Text style={styles.errorTitle}>No Camera Found</Text>
        <Text style={styles.errorSubtitle}>
          No usable camera device was found.
        </Text>
      </View>
    );
  }

  // --- Camera Active ---
  return (
    <View style={styles.container}>

      {/* Camera feed — full screen behind everything */}
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        format={format}
        pixelFormat="yuv"
        enableZoomGesture={true}
      />


      {/* Circle border — glows green when face detected */}
      <View
        style={[
          styles.circle,
          {
            top: CIRCLE_CENTER_Y - CIRCLE_RADIUS,
            left: CIRCLE_CENTER_X - CIRCLE_RADIUS,
            borderColor: faceInCircle
              ? '#22c55e'
              : 'rgba(255, 255, 255, 0.5)',
          },
        ]}
      />

      {/* Top instruction text */}
      <View style={styles.topTextContainer}>
        <Text style={styles.topText}>Face Verification</Text>
        <Text style={styles.topSubText}>
          Position your face inside the circle
        </Text>
      </View>

      {/* Bottom status text */}
      <View style={styles.bottomTextContainer}>
        <Text style={[
          styles.statusText,
          { color: faceInCircle ? '#22c55e' : 'rgba(255,255,255,0.7)' }
        ]}>
          {faceInCircle ? '✓  Face Detected' : 'No face detected'}
        </Text>
        <Text style={styles.platformText}>
          {Platform.OS.toUpperCase()} · MLKit · Front Camera
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 32,
  },
  loadingText: {
    color: '#aaa',
    marginTop: 12,
    fontSize: 15,
  },
  errorIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  camera:{
  width: CIRCLE_SIZE,
  height: CIRCLE_SIZE,
  alignSelf: 'center',
  marginTop: CIRCLE_CENTER_Y - CIRCLE_RADIUS,
  overflow: 'hidden',
  },


  // The circle with border
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 3,
    backgroundColor: 'transparent',
    // Shadow for the glow effect (iOS)
  },

  topTextContainer: {
    position: 'absolute',
    top: CIRCLE_CENTER_Y - CIRCLE_RADIUS - 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  topText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  topSubText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },

  bottomTextContainer: {
    position: 'absolute',
    top: CIRCLE_CENTER_Y + CIRCLE_RADIUS + 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  platformText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
  },
});