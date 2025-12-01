"use client";

import { useState } from "react";
import { CameraRecorder } from "./CameraRecorder";
import { VideoEditor } from "./VideoEditor";
import { UploadView } from "./UploadView";
import { useLanguage } from "@/components/i18n/language-provider";
import { AnimatePresence, motion } from "framer-motion";

export type CreateMode = "recorder" | "editor" | "upload";

export default function CreateView() {
  const [mode, setMode] = useState<CreateMode>("recorder");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const handleRecordingComplete = (blob: Blob) => {
    setRecordedBlob(blob);
    setMode("editor");
  };

  const handleEditComplete = (finalBlob: Blob) => {
    // In a real app, this might include burnt-in effects
    setRecordedBlob(finalBlob);
    setMode("upload");
  };

  const handleBackToRecorder = () => {
    setRecordedBlob(null);
    setMode("recorder");
  };

  const handleBackToEditor = () => {
    setMode("editor");
  };

  return (
    <div className="h-full w-full bg-black overflow-hidden relative">
      <AnimatePresence mode="wait">
        {mode === "recorder" && (
          <motion.div
            key="recorder"
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CameraRecorder onComplete={handleRecordingComplete} />
          </motion.div>
        )}

        {mode === "editor" && recordedBlob && (
          <motion.div
            key="editor"
            className="h-full w-full"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <VideoEditor
                blob={recordedBlob}
                onBack={handleBackToRecorder}
                onNext={handleEditComplete}
            />
          </motion.div>
        )}

        {mode === "upload" && recordedBlob && (
            <motion.div
                key="upload"
                className="h-full w-full"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
            >
                <UploadView
                    blob={recordedBlob}
                    onBack={handleBackToEditor}
                />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
