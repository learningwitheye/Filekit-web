"use client"

import * as React from "react"
import { UploadCloud, FileCheck, X, Crown, Download, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { processFile, triggerDownload, type ProcessResult } from "@/lib/tool-processors"

const MAX_SIZE_MB = 50
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const MIN_DELAY_MS = 3000

// Jin tools mein ek se zyada files lagti hain
const MULTI_FILE_SLUGS = ["merge-pdf", "organize-pdf"]

// 🚨 NAYA FIX: Saare possible slugs add kar diye taaki koi block na ho
const SUPPORTED_SLUGS = [
  "word-to-pdf", "excel-to-pdf", "ppt-to-pdf", "powerpoint-to-pdf", "text-to-pdf", "html-to-pdf", "rtf-to-pdf", "odt-to-pdf",
  "pdf-to-word", "pdf-to-excel", "pdf-to-ppt", "pdf-to-powerpoint", "pdf-to-text", "pdf-to-txt", "pdf-to-html", "pdf-to-rtf",
  "jpg-to-pdf", "png-to-pdf", "bmp-to-pdf", "tiff-to-pdf", "pdf-to-jpg", "pdf-to-png", "extract-images",
  "png-to-jpg", "jpg-to-png", "webp-to-jpg", "heic-to-jpg", "svg-to-png", "gif-to-mp4", "bmp-to-jpg", "tiff-to-jpg",
  "merge-pdf", "split-pdf", "compress-pdf", "remove-pages", "organize-pdf", "rotate-pdf", "add-page-numbers", "add-watermark", "protect-pdf", "unlock-pdf", "repair-pdf", "sign-pdf",
  "image-compressor", "image-resizer", "image-cropper", "image-rotator", "photo-upscaler", "grayscale-converter", "meme-generator", "background-remover"
]

type Stage = "idle" | "processing" | "done" | "error"

interface DownloadItem {
  blob: Blob
  filename: string
}

export function UploadZone({ toolName, slug }: { toolName: string; slug?: string }) {
  const [stage, setStage] = React.useState<Stage>("idle")
  const [progress, setProgress] = React.useState(0)
  const [files, setFiles] = React.useState<File[]>([])
  const [dragging, setDragging] = React.useState(false)
  const [downloads, setDownloads] = React.useState<DownloadItem[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const isMulti = slug ? MULTI_FILE_SLUGS.includes(slug) : false

  React.useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const validateFiles = (incoming: File[]): File[] => {
    for (const f of incoming) {
      if (f.size > MAX_SIZE_BYTES) {
        toast.error("File too large!", {
          description: `Maximum ${MAX_SIZE_MB}MB allowed for free users. Upgrade to Pro for unlimited file size.`,
          action: { label: "Upgrade", onClick: () => (window.location.href = "/pricing") },
        })
        return []
      }
    }
    return incoming
  }

  const handleFiles = (incoming: File[]) => {
    const valid = validateFiles(incoming)
    if (!valid.length) return
    setFiles(isMulti ? (prev) => [...prev, ...valid] : [valid[0]])
  }

  const startProcessing = async () => {
    if (!files.length) {
      toast.error("No file selected", { description: "Please upload a file first." })
      return
    }

    setStage("processing")
    setProgress(0)

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 78) { clearInterval(timerRef.current!); return 78 }
        return Math.min(78, p + Math.random() * 8 + 2)
      })
    }, 250)

    const t0 = Date.now()

    try {
      // 🚨 NAYA FIX: Direct processFile ko file bhejo! 
      // Ab koi file block nahi hogi, aur tool-processors apna kaam karega.
      const result: ProcessResult = await processFile(slug || "", files)

      const elapsed = Date.now() - t0
      if (elapsed < MIN_DELAY_MS) {
        await new Promise<void>((r) => setTimeout(r, MIN_DELAY_MS - elapsed))
      }

      clearInterval(timerRef.current!)
      setProgress(100)

      const items: DownloadItem[] =
        result.type === "single"
          ? [{ blob: result.blob, filename: result.filename }]
          : result.blobs.map((b) => ({ blob: b.blob, filename: b.filename }))

      await new Promise<void>((r) => setTimeout(r, 300))
      setDownloads(items)
      setStage("done")
      toast.success("Processing Complete!", { description: "Your file is ready to download." })
      
    } catch (err: any) {
      clearInterval(timerRef.current!)
      console.error(err)
      setStage("error")
      // 🚨 NAYA FIX: Backend ka error directly toast mein dikhega
      toast.error("Processing failed", {
        description: err.message || "Something went wrong. Please try again.",
      })
    }
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setStage("idle")
    setProgress(0)
    setFiles([])
    setDownloads([])
    if (inputRef.current) inputRef.current.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(Array.from(e.dataTransfer.files))
  }

  const handleMaxQualityClick = () => {
    toast.info("Pro feature", {
      description: "Please login and upgrade to Pro (₹350/mo) for maximum quality.",
      action: { label: "Upgrade", onClick: () => (window.location.href = "/pricing") },
    })
  }

  return (
    <div className="flex flex-col gap-5">
      
      {/* TOP AD PLACEMENT */}
      <div className="w-full h-[90px] bg-muted/20 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm font-medium rounded-xl mb-2">
        AdSense Top Banner (728x90)
      </div>

      {stage === "idle" && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200",
            dragging
              ? "border-primary bg-accent scale-[1.01]"
              : "border-border hover:border-primary/60 hover:bg-muted/40",
          )}
          role="button"
          tabIndex={0}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple={isMulti}
            onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center">
              <UploadCloud className="size-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-base">
                {isMulti ? "Drag & drop your files here" : "Drag & drop your file here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse —{" "}
                <span className="text-primary font-medium">Max {MAX_SIZE_MB}MB for Free users</span>
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2 pointer-events-none">
              Choose {isMulti ? "Files" : "File"}
            </Button>
          </div>
        </div>
      )}

      {stage === "idle" && files.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-muted/30 flex items-center justify-between">
            <p className="text-sm font-medium">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </p>
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Clear
            </button>
          </div>
          <ul className="divide-y divide-border">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <FileCheck className="size-4 text-primary shrink-0" />
                <span className="text-sm truncate flex-1">{f.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 bg-muted/10 flex justify-end">
            <Button onClick={startProcessing} className="gap-2">
              Process {toolName}
            </Button>
          </div>
        </div>
      )}

      {stage === "processing" && (
        <div className="border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Loader2 className="size-5 text-primary animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{files[0]?.name ?? "file"}</p>
              <p className="text-xs text-muted-foreground">
                {((files[0]?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Badge variant="secondary">Processing…</Badge>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Processing… (Please wait)</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <Button disabled className="w-full gap-2 opacity-70">
            <Loader2 className="size-4 animate-spin" />
            Processing…
          </Button>
        </div>
      )}

      {stage === "done" && (
        <div className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {downloads.length > 1 ? `${downloads.length} files ready` : "File ready!"}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 truncate">
                {downloads[0]?.filename}
              </p>
            </div>
          </div>

          {downloads.length === 1 ? (
            <Button className="w-full gap-2" onClick={() => triggerDownload(downloads[0].blob, downloads[0].filename)}>
              <Download className="size-4" /> Download File
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              {downloads.map((d, i) => (
                <Button key={i} variant="outline" size="sm" className="justify-start gap-2" onClick={() => triggerDownload(d.blob, d.filename)}>
                  <Download className="size-3.5 shrink-0" />
                  <span className="truncate">{d.filename}</span>
                </Button>
              ))}
            </div>
          )}

          <button className="self-start flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={reset}>
            <X className="size-3.5" /> Process another file
          </button>
        </div>
      )}

      {stage === "error" && (
        <div className="border border-destructive/40 bg-destructive/5 rounded-xl p-6 flex flex-col gap-3">
          <p className="text-sm font-medium text-destructive">Processing failed</p>
          <p className="text-xs text-muted-foreground">Please try again with a different file, or check that the file is not corrupted.</p>
          <Button variant="outline" size="sm" onClick={reset} className="self-start">Try again</Button>
        </div>
      )}

      {/* BOTTOM AD PLACEMENT */}
      <div className="w-full sm:w-[300px] h-[250px] mx-auto mt-2 bg-muted/20 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm font-medium rounded-xl">
        AdSense Rectangle (300x250)
      </div>

      <div className="border border-dashed border-border rounded-xl p-4 bg-muted/20 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="size-4 text-amber-500" />
            <Label htmlFor="max-quality" className="text-sm font-medium cursor-pointer">Maximum Quality</Label>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
              <Crown className="size-2.5" /> Pro Only
            </Badge>
          </div>
          <Switch id="max-quality" onClick={handleMaxQualityClick} />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 ml-6">Upgrade to Pro to unlock maximum quality processing with no file size limits.</p>
      </div>
    </div>
  )
}