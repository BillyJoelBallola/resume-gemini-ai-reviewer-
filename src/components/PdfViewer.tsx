"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type Props = {
  base64: string;
};

export default function PdfViewer({ base64 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);

        // convert base64 → binary
        const binary = atob(base64);

        const loadingTask = pdfjsLib.getDocument({ data: binary });
        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const viewport = page.getViewport({ scale: 1.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvas,
          viewport,
          canvasContext: ctx,
        }).promise;

        setLoading(false);
      } catch (err) {
        console.error("PDF render error:", err);
      }
    };

    loadPdf();
  }, [base64]);

  return (
    <div className="w-full flex justify-center">
      {loading && (
        <p className="text-sm text-muted-foreground">Loading resume...</p>
      )}

      <canvas
        ref={canvasRef}
        className="rounded-xl border shadow-md max-w-full"
      />
    </div>
  );
}
