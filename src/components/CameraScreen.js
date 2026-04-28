import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, Dimensions, } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor, runAsync, useCameraFormat, } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import { useCameraPermission } from '../hooks/useCameraPermission';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Circle dimensions — centered on screen
const CIRCLE_SIZE = 300;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const CIRCLE_CENTER_X = SCREEN_WIDTH / 2;
const CIRCLE_CENTER_Y = SCREEN_HEIGHT / 2;

export default function CameraScreen({onVerify}) {
  const { hasPermission, isLoading } = useCameraPermission();
  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [
    { fps: 15, videoResolution: '720p' }
  ]);

  const cameraRef = useRef(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [instructionText, setInstructionText] = useState('Position your face inside the circle');
  const [isCapturing, setIsCapturing] = useState(false);

  // Tracking blink state across frames without triggering re-renders
  const eyesWereClosed = useRef(false);
  const hasBlinked = useRef(false);
  const captureTriggered = useRef(false);

  const faceDetectionOptions = useRef({
    performanceMode: 'fast',
    landmarkMode: 'all',
    classificationMode: 'all', // Required for eyeOpenProbability
    minFaceSize: 0.8,
    trackingEnabled: false,
    cameraFacing: 'front',
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

  const capturePhotoAndFinish = async () => {
    try{
    if (cameraRef.current && !captureTriggered.current) {
      captureTriggered.current = true;
      setIsCapturing(true);
      setInstructionText('Capturing securely...');
      
      try {
        // Take a fast photo without flash
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
        });
        // Send the photo file path back to the parent page
        onVerify(photo);
      } catch (error) {
        console.error("Failed to capture photo:", error);
        setInstructionText('Capture failed. Please try again.');
        captureTriggered.current = false;
        setIsCapturing(false);
      }
    }
    } catch (error){
      console.log("Failed", error)
    }
  };

  const handleDetectedFaces = Worklets.createRunOnJS((faces) => {

    if (captureTriggered.current) return;

    // 1. Reset everything if no face is detected
    if (!faces || faces.length === 0 || faces.length > 1) {
      setFaceVerified(false);
      if (!faces || faces.length === 0)
        setInstructionText('Position your face inside the circle');
      else if (faces.length > 1)
        setInstructionText('Multiple Faces Detected... Please move to a empty location')
      else {
        eyesWereClosed.current = false;
        hasBlinked.current = false;
        return
      }
    }

    // 2. Find the first face and check if it's inside the bounds
    const face = faces[0]; 
    const bounds = face.bounds;
    const faceCenterX = bounds.x + bounds.width / 2;
    const faceCenterY = bounds.y + bounds.height / 2;

    const distance = Math.sqrt(
      Math.pow(faceCenterX - CIRCLE_CENTER_X, 2) +
      Math.pow(faceCenterY - CIRCLE_CENTER_Y, 2)
    );

    const isInCircle = distance < (CIRCLE_RADIUS * 0.8);

    // 3. If face leaves the circle, reset liveness checks
    if (!isInCircle) {
      setFaceVerified(false);
      setInstructionText('Position your face inside the circle');
      eyesWereClosed.current = false;
      hasBlinked.current = false;
      return;
    }

    const MIN_FACE_WIDTH = 200; 

    if (bounds.width < MIN_FACE_WIDTH) {
      setFaceVerified(false);
      setInstructionText('Move closer to the camera');
      eyesWereClosed.current = false;
      hasBlinked.current = false;
      return;
    }

    // 4. Liveness Check: Blink Detection State Machine
    // Default to 1 (open) if undefined to prevent false positives on bad frames
    const leftEye = face.leftEyeOpenProbability ?? 1;
    const rightEye = face.rightEyeOpenProbability ?? 1;

    // Only run the blink check if they haven't already passed it
    if (!hasBlinked.current) {
      if (leftEye < 0.3 && rightEye < 0.3) {
        // State 1: Both eyes closed
        eyesWereClosed.current = true;
        setInstructionText('Good! Now open your eyes.');
      } else if (eyesWereClosed.current && leftEye > 0.7 && rightEye > 0.7) {
        // State 2: Eyes were closed, now they are open -> Blink complete!
        hasBlinked.current = true;
        capturePhotoAndFinish();
        setInstructionText('Verification Complete!');
      } else {
        // State 0: Waiting for blink
        setInstructionText('Please blink a few times to verify liveness');
      }
    }

    // Update UI state based on successful blink completion
    setFaceVerified(hasBlinked.current);
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

  // --- Render Loading/Error States ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

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

  // --- Render Camera Active ---
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        format={format}
        pixelFormat="yuv"
        enableZoomGesture={true}
        photo={true}
      />

      <View
        style={[
          styles.circle,
          {
            top: CIRCLE_CENTER_Y - CIRCLE_RADIUS,
            left: CIRCLE_CENTER_X - CIRCLE_RADIUS,
            borderColor: faceVerified
              ? '#22c55e' // Green on success
              : 'rgba(255, 255, 255, 0.5)',
          },
        ]}
      />

      <View style={styles.topTextContainer}>
        <Text style={styles.topText}>Face Verification</Text>
        <Text style={[
          styles.topSubText, 
          { color: faceVerified ? '#22c55e' : '#facc15' } // Yellow for instruction, green for success
        ]}>
          {instructionText}
        </Text>
      </View>

      <View style={styles.bottomTextContainer}>
        <Text style={[
          styles.statusText,
          { color: faceVerified ? '#22c55e' : 'rgba(255,255,255,0.7)' }
        ]}>
          {faceVerified ? '✓ Verified Live Face' : 'Awaiting verification...'}
        </Text>
        <Text style={styles.platformText}>
          {Platform.OS.toUpperCase()} · MLKit · Active Liveness
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 32,
  },
  loadingText: { color: '#aaa', marginTop: 12, fontSize: 15 },
  errorIcon: { fontSize: 56, marginBottom: 16 },
  errorTitle: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  errorSubtitle: { color: '#aaa', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  camera: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignSelf: 'center',
    marginTop: CIRCLE_CENTER_Y - CIRCLE_RADIUS,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 3,
    backgroundColor: 'transparent',
  },
  topTextContainer: {
    position: 'absolute',
    top: CIRCLE_CENTER_Y - CIRCLE_RADIUS - 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  topText: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  topSubText: { fontSize: 15, fontWeight: '500' },
  bottomTextContainer: {
    position: 'absolute',
    top: CIRCLE_CENTER_Y + CIRCLE_RADIUS + 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 6,
  },
  statusText: { fontSize: 16, fontWeight: '600' },
  platformText: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
});