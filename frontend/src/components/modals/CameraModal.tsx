// src/components/modals/CameraModal.tsx

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCcw, Check, VideoOff } from 'lucide-react';

// A basic modal wrapper component. You can adapt this to your UI library's modal if you prefer.
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-lg relative text-white">
        <button onClick={onClose} className="absolute top-2 right-3 text-2xl font-bold text-white hover:text-gray-300">&times;</button>
        {children}
      </div>
    </div>
  );
};

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string) => void;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment" // Use the rear camera
};

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const handleRetake = () => {
    setImgSrc(null);
    setPermissionDenied(false);
  };

  const handleUsePhoto = () => {
    if (imgSrc) {
      onCapture(imgSrc);
      setImgSrc(null);
      onClose();
    }
  };
  
  const handleClose = () => {
    setImgSrc(null);
    setPermissionDenied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Scan Food</h2>
        <div className="relative bg-black rounded-md overflow-hidden flex items-center justify-center min-h-[250px]">
          {imgSrc ? (
            <img src={imgSrc} alt="Captured food" />
          ) : permissionDenied ? (
            <div className="text-center p-4">
              <VideoOff size={48} className="mx-auto text-red-500 mb-2" />
              <h3 className="font-bold">Camera Access Denied</h3>
              <p className="text-sm text-gray-400">Please allow camera access in browser settings.</p>
            </div>
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-auto"
              onUserMediaError={() => setPermissionDenied(true)}
            />
          )}
        </div>

        {!permissionDenied && (
          <div className="mt-4 flex justify-center items-center space-x-6">
            {imgSrc ? (
              <>
                <button onClick={handleRetake} className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-lg text-white font-semibold">
                  <RefreshCcw size={20} /> Retake
                </button>
                <button onClick={handleUsePhoto} className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-white font-semibold">
                  <Check size={20} /> Use Photo
                </button>
              </>
            ) : (
              <button onClick={capture} className="p-4 bg-blue-600 rounded-full text-white hover:bg-blue-700">
                <Camera size={32} />
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};