import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, Check, RotateCcw, VideoOff, SwitchCamera } from 'lucide-react';
import Button from './Button';

/**
 * Universal Camera Modal Component
 * Features:
 * - Smart device detection: defaults to 'user' on desktop/laptop webcams to prevent black screens,
 *   and appropriate camera mode on mobile devices.
 * - Multi-tier constraint fallback (ideal resolution -> basic video)
 * - Safe stream binding with direct property configuration (muted, playsInline, autoplay)
 * - Verification of actual video dimensions before allowing photo capture
 * - Guaranteed unclipped responsive layout: flex-1 min-h-0 viewport with shrink-0 sticky footer
 * - Single-step capture with review & approval (Retake / Use Photo)
 * - Customizable alignment guides (oval for body signs, rectangle for nutrition labels)
 */
const CameraModal = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Camera',
  guideType = 'rectangle', // 'rectangle' | 'oval' | 'square'
  instruction = 'Align subject within the frame and hold steady.',
  fileName = 'capture.jpg'
}) => {
  // Check if running on mobile device
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

  // Default facing mode:
  // Desktop/laptop: default to 'user' because webcams are front-facing and 'environment' often binds to inactive sensors
  // Mobile: 'user' for body signs (face/tongue/eyes), 'environment' for label scanning
  const initialFacingMode = isMobile ? (guideType === 'oval' ? 'user' : 'environment') : 'user';

  const [facingMode, setFacingMode] = useState(initialFacingMode);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasVideoDimensions, setHasVideoDimensions] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop all camera media tracks safely
  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop error:', e);
        }
      });
      streamRef.current = null;
    }
    setStream(null);
    setIsStreaming(false);
    setHasVideoDimensions(false);
  }, []);

  // Enumerate video devices to detect multiple cameras
  const refreshDevices = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(videoInputs);
      } catch (e) {
        console.warn('Device enumeration error:', e);
      }
    }
  }, []);

  // Start camera stream with multi-level fallback
  const startCamera = useCallback(
    async (targetFacingMode, targetDeviceId) => {
      setIsLoading(true);
      setErrorMsg('');
      setCapturedImage(null);
      setHasVideoDimensions(false);
      stopTracks();

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(
            'Camera API is not supported on this browser or requires a secure connection (HTTPS or localhost).'
          );
        }

        let mediaStream = null;

        // Step 1: Build constraints based on specified deviceId or facingMode
        let constraints = {
          audio: false,
          video: targetDeviceId
            ? { deviceId: { exact: targetDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
            : {
                facingMode: { ideal: targetFacingMode },
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
        };

        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (constraintErr) {
          console.warn('Detailed camera constraints failed, attempting fallback:', constraintErr);

          // Step 2: Try basic facingMode without resolution constraints
          try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: targetDeviceId ? { deviceId: { exact: targetDeviceId } } : { facingMode: targetFacingMode }
            });
          } catch (facingErr) {
            console.warn('FacingMode constraint failed, falling back to any available video track:', facingErr);

            // Step 3: Minimal fallback: any available video device
            mediaStream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: true
            });
          }
        }

        streamRef.current = mediaStream;
        setStream(mediaStream);

        // Bind directly to video element if ready
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          videoRef.current.autoplay = true;
          videoRef.current.srcObject = mediaStream;

          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsStreaming(true);
                setIsLoading(false);
                if (videoRef.current && videoRef.current.videoWidth > 0) {
                  setHasVideoDimensions(true);
                }
              })
              .catch((err) => {
                console.warn('Autoplay error handled:', err);
                setIsStreaming(true);
                setIsLoading(false);
              });
          }
        } else {
          setIsLoading(false);
        }

        // Refresh enumerated devices list after permission has been granted
        refreshDevices();
      } catch (err) {
        console.error('Camera initialization error:', err);
        setIsLoading(false);
        setIsStreaming(false);
        setHasVideoDimensions(false);

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMsg(
            'Camera access was denied. Please allow camera permissions in your browser settings (look for the camera icon in your address bar) and click Try Again.'
          );
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setErrorMsg(
            'No camera found on this device. You can upload an image from your files instead.'
          );
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setErrorMsg(
            'Camera is in use by another application. Please close other apps using the camera and try again.'
          );
        } else if (err.name === 'OverconstrainedError') {
          setErrorMsg(
            'Camera hardware constraints could not be satisfied. Please select a different camera or upload an image.'
          );
        } else if (err.name === 'SecurityError' || window.isSecureContext === false) {
          setErrorMsg('Camera access requires a secure context (HTTPS or localhost).');
        } else {
          setErrorMsg(err.message || 'Unable to access camera on this device.');
        }
      }
    },
    [stopTracks, refreshDevices]
  );

  // Manage camera on modal open/close
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode, selectedDeviceId);
      refreshDevices();
    } else {
      stopTracks();
      setCapturedImage(null);
      setErrorMsg('');
      setHasVideoDimensions(false);
    }

    return () => {
      stopTracks();
    };
  }, [isOpen, facingMode, selectedDeviceId, startCamera, stopTracks, refreshDevices]);

  // Handle stream assignment to video element whenever stream changes
  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      video
        .play()
        .then(() => {
          setIsStreaming(true);
          if (video.videoWidth > 0) {
            setHasVideoDimensions(true);
          }
        })
        .catch((e) => console.warn('Direct video play error:', e));
    }
  }, [stream]);

  // Toggle between front/rear or cycle through multiple video inputs
  const toggleCameraFacing = () => {
    if (videoDevices.length > 2) {
      const currentIndex = videoDevices.findIndex((d) => d.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      const nextDevice = videoDevices[nextIndex];
      setSelectedDeviceId(nextDevice.deviceId);
      startCamera(facingMode, nextDevice.deviceId);
    } else {
      const nextMode = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(nextMode);
      setSelectedDeviceId('');
      startCamera(nextMode, '');
    }
  };

  // Video loaded metadata handler
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setHasVideoDimensions(true);
      }
      setIsStreaming(true);
      setIsLoading(false);
    }
  };

  // Video canplay handler
  const handleCanPlay = () => {
    const video = videoRef.current;
    if (video && video.videoWidth > 0) {
      setHasVideoDimensions(true);
    }
  };

  // Capture current frame onto canvas
  const handleSnap = () => {
    const video = videoRef.current;
    if (!video || !isStreaming) return;

    try {
      const canvas = document.createElement('canvas');
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Mirror user-facing camera frame for natural selfie orientation
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(dataUrl);

      // Pause live video while reviewing
      if (video.pause) {
        video.pause();
      }
    } catch (err) {
      console.error('Frame capture error:', err);
      setErrorMsg('Failed to capture snapshot from camera stream.');
    }
  };

  // Retake photo: clear snapshot and resume live stream
  const handleRetake = () => {
    setCapturedImage(null);
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.warn('Resume play error:', e));
    }
  };

  // Confirm photo: convert data URL to File and trigger parent callback
  const handleUsePhoto = () => {
    if (!capturedImage) return;

    try {
      const arr = capturedImage.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const file = new File([blob], fileName, { type: mime, lastModified: Date.now() });

      stopTracks();
      onCapture(file, capturedImage);
      onClose();
    } catch (err) {
      console.error('Failed to export captured photo:', err);
      setErrorMsg('Failed to process captured image.');
    }
  };

  // Clean close
  const handleClose = () => {
    stopTracks();
    setCapturedImage(null);
    setErrorMsg('');
    setHasVideoDimensions(false);
    onClose();
  };

  if (!isOpen) return null;

  const canFlip = videoDevices.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      {/* Modal Container: strictly max-h-[90vh] with flex flex-col to prevent overflow clipping */}
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header (shrink-0) */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/95">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">{title}</h3>
              <p className="text-xs text-neutral-400 line-clamp-1">{instruction}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
            aria-label="Close camera modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area: flex-1 min-h-0 allows scaling down without pushing footer */}
        <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            /* Review Preview */
            <div className="relative w-full h-full flex items-center justify-center p-3">
              <img
                src={capturedImage}
                alt="Captured Preview"
                className="max-h-[50vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-medium flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Photo Captured — Review Below</span>
              </div>
            </div>
          ) : (
            /* Live Camera Feed */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                className={`w-full h-full max-h-[50vh] object-contain ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Guide Overlay Frame */}
              {!isLoading && !errorMsg && isStreaming && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  {guideType === 'oval' ? (
                    <div className="w-48 h-64 sm:w-56 sm:h-72 border-2 border-dashed border-emerald-400/80 rounded-[50%] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center">
                      <span className="text-[11px] font-medium text-emerald-300 bg-black/70 px-3 py-1 rounded-full backdrop-blur-sm">
                        Align body sign inside frame
                      </span>
                    </div>
                  ) : (
                    <div className="w-11/12 max-w-md h-44 sm:h-56 border-2 border-dashed border-emerald-400/80 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center">
                      <span className="text-[11px] font-medium text-emerald-300 bg-black/70 px-3 py-1 rounded-full backdrop-blur-sm">
                        Position nutrition facts within frame
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Loading State Indicator */}
              {isLoading && (
                <div className="absolute inset-0 bg-neutral-900/85 flex flex-col items-center justify-center space-y-3 z-10">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-sm font-medium text-neutral-200">Connecting to camera...</p>
                </div>
              )}

              {/* Error State Banner */}
              {errorMsg && (
                <div className="absolute inset-0 bg-neutral-900/95 p-6 flex flex-col items-center justify-center text-center space-y-4 z-20">
                  <div className="p-3 bg-rose-500/10 rounded-full text-rose-400">
                    <VideoOff className="w-8 h-8" />
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-sm font-semibold text-rose-400 mb-1">Camera Notice</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">{errorMsg}</p>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startCamera(facingMode, selectedDeviceId)}
                      className="border-neutral-700 text-neutral-200"
                    >
                      <RefreshCw className="w-4 h-4 mr-1.5" />
                      Try Again
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleClose}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Use File Upload Instead
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Controls Toolbar (shrink-0, sticky bottom-0 z-20: strictly never clipped) */}
        <div className="shrink-0 px-5 py-3.5 bg-neutral-900 border-t border-neutral-800 sticky bottom-0 z-20">
          {capturedImage ? (
            /* Review State: Retake / Use Photo / Cancel */
            <div className="flex items-center justify-between sm:justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="border-neutral-700 text-neutral-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Retake
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUsePhoto}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-900/30"
              >
                <Check className="w-4 h-4 mr-1.5" />
                Use Photo
              </Button>
            </div>
          ) : (
            /* Live Stream State: Flip / Shutter / Cancel */
            <div className="flex items-center justify-between">
              <div className="w-12">
                {canFlip && (
                  <button
                    onClick={toggleCameraFacing}
                    disabled={isLoading || !isStreaming}
                    className="p-2.5 text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-full transition disabled:opacity-40"
                    title="Switch camera"
                    aria-label="Switch camera"
                  >
                    <SwitchCamera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>

              {/* Shutter Button (Centered & unclipped) */}
              <div className="flex justify-center flex-1">
                <button
                  onClick={handleSnap}
                  disabled={isLoading || !isStreaming || !hasVideoDimensions || Boolean(errorMsg)}
                  className="group relative p-1 rounded-full border-4 border-emerald-500/80 hover:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Take photo"
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white group-hover:scale-95 transition-transform flex items-center justify-center shadow-lg">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neutral-100 border border-neutral-300" />
                  </div>
                </button>
              </div>

              <div className="w-12 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-neutral-400 hover:text-white px-2 py-1 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
