"use client"

import * as React from "react"
import { UploadCloud, FileCheck, X, Crown, Download, CheckCircle2, Loader2, Timer, Palette, Image as ImageIcon, Sparkles, Lock, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { processFile, type ProcessResult, triggerDownload } from "@/lib/tool-processors"
import { useLimits } from "@/hooks/use-limits" 

const MAX_SIZE_MB = 50
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const MIN_DELAY_MS = 3000

const MULTI_FILE_SLUGS = ["merge-pdf", "organize-pdf"]

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

  const { isPro, checkFileSize, checkUploadLimit, checkBgRemoverLimit, incrementUploadCount, lockoutTime, aiLockoutTime } = useLimits()

  const isMulti = slug ? MULTI_FILE_SLUGS.includes(slug) : false
  const isBgRemover = slug === "background-remover"

  const isProtectTool = slug === "protect-pdf"
  const isUnlockTool = slug === "unlock-pdf"
  
  // 🔥 SMART CHECKER STATES
  const [needsPassword, setNeedsPassword] = React.useState(false)
  const [isChecking, setIsChecking] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [disclaimerAccepted, setDisclaimerAccepted] = React.useState(false)

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [bgColor, setBgColor] = React.useState<string>("transparent")
  const [isDownloading, setIsDownloading] = React.useState(false)

  const activeLockout = isBgRemover ? aiLockoutTime : lockoutTime
  // 🚀 FIX: Agar isPro true hai, toh isLockedOut turant false ho jayega
  const isLockedOut = activeLockout !== null && !isPro; 
  const [timeLeft, setTimeLeft] = React.useState<number>(0)

  React.useEffect(() => {
    // 🚀 FIX: Pro user ke liye background timer calculate karna band kar do
    if (!activeLockout || isPro) return; 
    const updateTimer = () => {
      const remaining = activeLockout - Date.now()
      setTimeLeft(remaining > 0 ? remaining : 0)
    }
    updateTimer(); 
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [activeLockout, isPro]) // isPro dependency add ki

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  React.useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const validateFiles = (incoming: File[]): File[] => {
    if (isBgRemover) {
      if (!checkBgRemoverLimit()) return [];
    } else {
      if (!checkUploadLimit()) return [];
    }
    for (const f of incoming) {
      if (!checkFileSize(f)) return []; 
    }
    return incoming
  }

  // 🚀 NAYA SMART ENGINE: File select hote hi background mein check karega
  const handleFiles = async (incoming: File[]) => {
    const valid = validateFiles(incoming)
    if (!valid.length) return
    
    const firstFile = valid[0];
    setFiles(isMulti ? (prev) => [...prev, ...valid] : [firstFile])

    if (isProtectTool || isUnlockTool) {
      setNeedsPassword(true);
    } else if (firstFile.type === "application/pdf" || firstFile.name.toLowerCase().endsWith(".pdf")) {
      setIsChecking(true);
      try {
        const { PDFDocument } = await import("pdf-lib");
        const bytes = await firstFile.arrayBuffer();
        await PDFDocument.load(bytes);
        setNeedsPassword(false); // Normal file
      } catch (e: any) {
        // Agar load hone mein error aayi, matlab locked hai
        setNeedsPassword(true);
        toast.info("Locked File Detected", { description: "Please enter the password to process this file." });
      } finally {
        setIsChecking(false);
      }
    } else {
      setNeedsPassword(false);
    }
  }

  const startProcessing = async () => {
    if (!files.length) {
      toast.error("No file selected", { description: "Please upload a file first." })
      return
    }

    if (needsPassword && !password) return toast.error("Password required", { description: "Please enter the password to proceed." })

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
      const result: ProcessResult = await processFile(slug || "", files, password.trim())

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

      if (isBgRemover && items.length > 0) {
        setPreviewUrl(URL.createObjectURL(items[0].blob))
      }

      await new Promise<void>((r) => setTimeout(r, 300))
      
      incrementUploadCount(isBgRemover);
      
      setDownloads(items)
      setStage("done")
      toast.success("Processing Complete!", { description: "Your file is ready!" })
      
    } catch (err: any) {
      clearInterval(timerRef.current!)
      console.error(err)
      setStage("error")
      toast.error("Processing failed", {
        description: err.message || "Something went wrong. Please try again.",
      })
    }
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setStage("idle")
    setProgress(0)
    setFiles([])
    setDownloads([])
    setPreviewUrl(null)
    setBgColor("transparent")
    setPassword("")
    setNeedsPassword(false)
    setIsChecking(false)
    setDisclaimerAccepted(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(Array.from(e.dataTransfer.files))
  }

  const handleMaxQualityClick = () => {
    if (isPro) return;
    toast.info("Pro feature", {
      description: "Upgrade to Pro (₹25/week) for maximum quality and unlimited background removal.",
      action: { label: "Upgrade", onClick: () => (window.location.href = "/pricing") },
    })
  }

  const handleCustomBgDownload = () => {
    if (!previewUrl) return;
    setIsDownloading(true);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = previewUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let targetWidth = img.width;
      let targetHeight = img.height;

      if (!isPro) {
        const MAX_FREE_DIM = 600;
        if (targetWidth > MAX_FREE_DIM || targetHeight > MAX_FREE_DIM) {
          const ratio = Math.min(MAX_FREE_DIM / targetWidth, MAX_FREE_DIM / targetHeight);
          targetWidth = Math.floor(targetWidth * ratio);
          targetHeight = Math.floor(targetHeight * ratio);
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          const formatText = isPro ? "HD" : "Standard";
          triggerDownload(blob, `FileKit-${formatText}-${downloads[0].filename}`);
          setIsDownloading(false);
          toast.success(`Downloaded in ${formatText} Quality!`);
        }
      }, "image/png", 1.0);
    };
  };

  const PRESET_COLORS = ["transparent", "#FFFFFF", "#000000", "#EF4444", "#3B82F6", "#10B981", "#EAB308", "#6366F1"];

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full h-[90px] bg-muted/20 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm font-medium rounded-xl mb-2">
        AdSense Top Banner (728x90)
      </div>

      {isLockedOut && stage === "idle" && (
        <div className="border-2 border-dashed border-amber-500/40 bg-amber-500/5 rounded-xl p-12 text-center flex flex-col items-center gap-4">
          <div className="size-16 bg-amber-500/10 rounded-full flex items-center justify-center">
            <Timer className="size-8 text-amber-500 animate-pulse" />
          </div>
          <div>
            <p className="font-bold text-lg">Free Limit Reached</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your free limits reset in <span className="font-mono font-bold text-foreground text-base bg-muted px-2 py-1 rounded-md border border-border ml-1">{formatTime(timeLeft)}</span>
            </p>
          </div>
          <Button className="mt-4 gap-2 w-full sm:w-auto" onClick={() => window.location.href = "/pricing"}>
            <Crown className="size-4" /> Upgrade to Pro for Unlimited
          </Button>
        </div>
      )}

      {!isLockedOut && stage === "idle" && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200",
            dragging ? "border-primary bg-accent scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-muted/40",
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
                or click to browse — <span className="text-primary font-medium">Max {MAX_SIZE_MB}MB for Free users</span>
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2 pointer-events-none">
              Choose {isMulti ? "Files" : "File"}
            </Button>
          </div>
        </div>
      )}

      {stage === "idle" && files.length > 0 && !isLockedOut && (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <div className="px-4 py-3 bg-muted/30 flex items-center justify-between">
            <p className="text-sm font-medium">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Clear</button>
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

          {needsPassword && (
            <div className="p-4 border-t border-border bg-muted/10 space-y-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Lock className="size-3.5 text-primary" /> 
                  {isProtectTool ? "Set a Password to Protect File" : "Enter Password to Unlock File"}
                  <span className="text-destructive">*</span>
                </Label>
                <input 
                  type="password" 
                  placeholder={isProtectTool ? "Create a strong password..." : "Enter file password..."} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              <div className="flex items-start gap-2.5 bg-destructive/5 border border-destructive/20 rounded-lg p-3 max-w-xl">
                <input 
                  type="checkbox"
                  id="disclaimer" 
                  checked={disclaimerAccepted} 
                  onChange={(e: any) => setDisclaimerAccepted(e.target.checked)} 
                  className="mt-1 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="disclaimer" className="text-sm font-medium text-destructive cursor-pointer flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5" /> Security & Legal Disclaimer
                  </label>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    I confirm that I have the legal right to unlock/modify this file. The website owner is not responsible for any unauthorized use or misuse of password-protected documents.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 py-3 bg-muted/10 flex justify-end border-t border-border">
            <Button 
              onClick={startProcessing} 
              className="gap-2"
              disabled={isChecking || (needsPassword && !disclaimerAccepted)}
            >
              {isChecking ? <><Loader2 className="size-4 animate-spin" /> Checking File...</> : `Process ${toolName}`}
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
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {stage === "done" && isBgRemover && previewUrl && (
        <div className="border border-border bg-card rounded-xl overflow-hidden flex flex-col">
          <div 
            className="w-full h-[350px] sm:h-[450px] relative flex items-center justify-center overflow-hidden"
            style={{ 
              backgroundColor: bgColor === "transparent" ? "transparent" : bgColor,
              backgroundImage: bgColor === "transparent" ? "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px" : "none"
            }}
          >
            <img 
              src={previewUrl} 
              alt="Removed Background" 
              className="max-h-full max-w-full object-contain drop-shadow-xl" 
            />
            {!isPro && (
              <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                Standard Quality Preview
              </div>
            )}
          </div>

          <div className="p-5 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="size-4 text-primary" />
                <span className="text-sm font-semibold">Change Background</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBgColor(c)}
                    className={cn(
                      "size-8 rounded-full border-2 transition-transform",
                      bgColor === c ? "border-primary scale-110 shadow-sm" : "border-border hover:scale-105",
                      c === "transparent" && "bg-muted relative overflow-hidden"
                    )}
                    style={{ backgroundColor: c !== "transparent" ? c : "transparent" }}
                    title={c === "transparent" ? "Transparent" : c}
                  >
                    {c === "transparent" && (
                       <div className="absolute inset-0" style={{ backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 8px 8px" }} />
                    )}
                  </button>
                ))}
                <div className="relative size-8 rounded-full overflow-hidden border-2 border-border ml-1 hover:scale-105 transition-transform cursor-pointer">
                  <input 
                    type="color" 
                    value={bgColor === "transparent" ? "#ffffff" : bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="absolute inset-[-10px] size-12 cursor-pointer opacity-0"
                    title="Custom Color"
                  />
                  <div className="size-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
              <Button 
                size="lg" 
                onClick={handleCustomBgDownload} 
                disabled={isDownloading}
                className={cn("w-full sm:w-auto gap-2", isPro ? "bg-primary" : "")}
              >
                {isDownloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                {isPro ? "Download HD" : "Download Standard"}
              </Button>
              {!isPro && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Crown className="size-3 text-amber-500" /> Unlock HD Download with Pro
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t border-border px-5 py-3 flex justify-between items-center bg-muted/5">
             <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={reset}>
               <X className="size-3" /> Process another file
             </button>
             <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Sparkles className="size-3"/> AI Engine v2.0</span>
          </div>
        </div>
      )}

      {stage === "done" && !isBgRemover && (
        <div className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">File ready!</p>
              <p className="text-xs text-green-600 dark:text-green-400 truncate">{downloads[0]?.filename}</p>
            </div>
          </div>
          <Button className="w-full gap-2" onClick={() => triggerDownload(downloads[0].blob, downloads[0].filename)}>
            <Download className="size-4" /> Download File
          </Button>
          <button className="self-start flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={reset}>
            <X className="size-3.5" /> Process another file
          </button>
        </div>
      )}

      {stage === "error" && (
        <div className="border border-destructive/40 bg-destructive/5 rounded-xl p-6 flex flex-col gap-3">
          <p className="text-sm font-medium text-destructive">Processing failed</p>
          <Button variant="outline" size="sm" onClick={reset} className="self-start">Try again</Button>
        </div>
      )}

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
          <Switch id="max-quality" checked={isPro} onClick={handleMaxQualityClick} />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 ml-6">Upgrade to Pro to unlock maximum quality processing with no file size limits.</p>
      </div>
    </div>
  )
}