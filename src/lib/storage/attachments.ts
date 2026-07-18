"use client";

import type { CivicAttachment } from "@/types/report";

const DATABASE = "civicshield-media";
const STORE = "attachments";

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLocalAttachments(reportId: string, files: File[], attachments: CivicAttachment[]) {
  if (!files.length || typeof window === "undefined" || !window.indexedDB) return;
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE, "readwrite");
    files.forEach((file, index) => transaction.objectStore(STORE).put({
      id: attachments[index]?.id,
      reportId,
      file,
      savedAt: new Date().toISOString(),
    }));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function getLocalAttachmentFiles(reportId: string) {
  if (typeof window === "undefined" || !window.indexedDB) return [] as File[];
  const database = await openDatabase();
  const records = await new Promise<Array<{ reportId: string; file: File }>>((resolve, reject) => {
    const transaction = database.transaction(STORE, "readonly");
    const request = transaction.objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result as Array<{ reportId: string; file: File }>);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return records.filter((record) => record.reportId === reportId).map((record) => record.file);
}
