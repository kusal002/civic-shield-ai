"use client";

import { Camera, CircleStop, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type CaptureMode = "photo" | "video";

export function LiveCapture({ onCapture }: { onCapture: (file: File) => void }) {
  const [mode, setMode] = useState<CaptureMode | null>(null);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => () => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  async function openCamera(nextMode: CaptureMode) {
    setError("");
    setMode(nextMode);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: nextMode === "video",
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setError("Camera permission is needed for live capture. You can still choose an existing image or video.");
    }
  }

  function stopCamera() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setRecording(false);
  }

  function closeCapture() {
    stopCamera();
    setMode(null);
  }

  function takePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      onCapture(new File([blob], `civicshield-photo-${Date.now()}.jpg`, { type: "image/jpeg" }));
      closeCapture();
    }, "image/jpeg", 0.9);
  }

  function startOrStopRecording() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    const stream = streamRef.current;
    if (!stream || !window.MediaRecorder) {
      setError("Video recording is not supported in this browser. Use the upload option instead.");
      return;
    }
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : undefined });
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      if (chunksRef.current.length) {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
        onCapture(new File([blob], `civicshield-video-${Date.now()}.webm`, { type: blob.type }));
        closeCapture();
      }
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }

  return <>
    <Button type="button" variant="secondary" onClick={() => void openCamera("photo")}><Camera aria-hidden="true" size={16} /> Take photo</Button>
    <Button type="button" variant="secondary" onClick={() => void openCamera("video")}><Video aria-hidden="true" size={16} /> Record video</Button>
    {mode ? <div className="fixed inset-0 z-[2000] grid place-items-center bg-[#132421]/80 p-4"><section className="w-full max-w-xl rounded-3xl bg-surface p-5 shadow-surface"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Live capture</p><h2 className="mt-1 font-display text-xl font-bold">{mode === "photo" ? "Take a photo" : "Record a video"}</h2></div><button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-[#edf3f1]" onClick={closeCapture}>Close</button></div><div className="mt-4 overflow-hidden rounded-2xl bg-black"><video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline /></div>{error ? <p className="mt-3 text-sm font-medium text-danger">{error}</p> : null}<div className="mt-4 flex flex-wrap gap-3">{mode === "photo" ? <Button type="button" onClick={takePhoto} disabled={Boolean(error)}><Camera aria-hidden="true" size={16} /> Capture photo</Button> : <Button type="button" variant={recording ? "danger" : "primary"} onClick={startOrStopRecording} disabled={Boolean(error)}>{recording ? <CircleStop aria-hidden="true" size={16} /> : <Video aria-hidden="true" size={16} />}{recording ? "Stop and save video" : "Start recording"}</Button>}</div></section></div> : null}
  </>;
}
