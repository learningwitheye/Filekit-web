export type ToolSlug = string

export type ProcessResult =
  | { type: "single"; blob: Blob; filename: string }
  | { type: "multi"; blobs: { blob: Blob; filename: string }[] }

// ============================================================================
// 1. 🚀 MASTER BACKEND ROUTER 
// ============================================================================
async function processViaOurServer(file: File, slug: string, baseName: string): Promise<ProcessResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("slug", slug);

  console.log(`Sending ${file.name} to Backend Engine...`);

  const response = await fetch("http://13.126.10.29:3000/convert", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = "Backend connection failed ya limit reached!";
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch (e) {
      console.error("Error parse nahi hua", e);
    }
    throw new Error(errorMsg);
  }

  const blob = await response.blob();

  // 🚨 NAYA: Saare new image/video extensions yahan add kar diye
  let ext = "pdf"; 
  if (slug === "pdf-to-word") ext = "docx";
  else if (slug === "pdf-to-excel") ext = "xlsx";
  else if (slug === "pdf-to-ppt" || slug === "pdf-to-powerpoint") ext = "pptx";
  else if (slug === "pdf-to-rtf") ext = "rtf";
  else if (slug === "pdf-to-text" || slug === "pdf-to-txt") ext = "txt";
  else if (slug === "pdf-to-html") ext = "html";
  else if (["png-to-jpg", "webp-to-jpg", "heic-to-jpg", "bmp-to-jpg", "tiff-to-jpg"].includes(slug)) ext = "jpg";
  else if (["jpg-to-png", "svg-to-png"].includes(slug)) ext = "png";
  else if (slug === "jpg-to-webp") ext = "webp";
  else if (slug === "png-to-svg") ext = "svg";
  else if (slug === "gif-to-mp4") ext = "mp4";
  else if (slug === "video-to-gif") ext = "gif";

  // 🚨 NAYA: File names for PDF Manipulations
  let outName = `${baseName}-converted.${ext}`;
  if (slug === 'compress-pdf') outName = `${baseName}-compressed.pdf`;
  if (slug === 'protect-pdf') outName = `${baseName}-protected.pdf`;
  if (slug === 'unlock-pdf') outName = `${baseName}-unlocked.pdf`;
  if (slug === 'repair-pdf') outName = `${baseName}-repaired.pdf`;

  return { type: "single", blob, filename: outName };
}

// ============================================================================
// 2. 🛠️ LOCAL NATIVE ENGINES 
// ============================================================================
export async function imageToPdf(file: File): Promise<Blob> {
  const { jsPDF } = await import("jspdf")
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const dataUrl = e.target?.result as string
        const img = new window.Image()
        img.onload = () => {
          const orientation = img.width > img.height ? "landscape" : "portrait"
          const doc = new jsPDF({ orientation, unit: "px", format: [img.width, img.height] })
          const fmt = file.type === "image/png" ? "PNG" : "JPEG"
          doc.addImage(dataUrl, fmt, 0, 0, img.width, img.height)
          resolve(doc.output("blob"))
        }
        img.onerror = reject; img.src = dataUrl
      } catch (err) { reject(err) }
    }
    reader.onerror = reject; reader.readAsDataURL(file)
  })
}

export async function compressImage(file: File): Promise<Blob> {
  const imageCompression = (await import("browser-image-compression")).default
  return await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true })
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib")
  const merged = await PDFDocument.create()
  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const doc = await PDFDocument.load(bytes)
    const pages = await merged.copyPages(doc, doc.getPageIndices())
    pages.forEach((p) => merged.addPage(p))
  }
  const bytes = await merged.save()
  return new Blob([bytes as any], { type: "application/pdf" })
}

export async function pdfToImages(file: File, isPng: boolean): Promise<Blob[]> {
  const pdfjsLib = await import("pdfjs-dist")
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
  }
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const blobs: Blob[] = []
  
  const mimeType = isPng ? "image/png" : "image/jpeg"

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 2 })
    const canvas = document.createElement("canvas")
    canvas.width = viewport.width; canvas.height = viewport.height
    const ctx = canvas.getContext("2d")!
    await page.render({ canvasContext: ctx as any, viewport }).promise
    const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("failed"))), mimeType, 0.92))
    blobs.push(blob)
  }
  return blobs
}

// ============================================================================
// 3. 🔀 THE MASTER ROUTER ENGINE
// ============================================================================
export async function processFile(slug: ToolSlug, files: File[]): Promise<ProcessResult> {
  console.log("🚀 BHAU KA TRACKER! Asli slug yeh aa raha hai:", slug);

  const file = files[0]; const base = file.name.replace(/\.[^.]+$/, ""); const inputExt = file.name.split(".").pop()?.toLowerCase() || ""

  if (["jpg-to-pdf", "png-to-pdf", "bmp-to-pdf"].includes(slug)) {
    const blob = await imageToPdf(file); return { type: "single", blob, filename: `${base}.pdf` }
  }
  if (["image-compressor", "image-resizer"].includes(slug)) {
    const blob = await compressImage(file); return { type: "single", blob, filename: `${base}-compressed.${inputExt}` }
  }
  if (slug === "merge-pdf") {
    const blob = await mergePdfs(files); return { type: "single", blob, filename: "merged-document.pdf" }
  }
  if (["pdf-to-jpg", "pdf-to-png", "extract-images"].includes(slug)) {
    const isPng = slug === "pdf-to-png";
    const ext = isPng ? "png" : "jpg";
    const blobs = await pdfToImages(file, isPng);
    
    if (blobs.length === 1) return { type: "single", blob: blobs[0], filename: `${base}-page1.${ext}` }
    return { type: "multi", blobs: blobs.map((b, i) => ({ blob: b, filename: `${base}-page${i + 1}.${ext}` })) }
  }

  // 🚨 SMART BROWSER PDF MANIPULATION ENGINE 🚨
  if (["split-pdf", "rotate-pdf", "remove-pages", "organize-pdf", "add-page-numbers", "add-watermark", "sign-pdf"].includes(slug)) {
    const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    
    if (slug === "rotate-pdf") {
      pdfDoc.getPages().forEach(page => page.setRotation(degrees(page.getRotation().angle + 90)));
      const savedBytes = await pdfDoc.save();
      return { type: "single", blob: new Blob([savedBytes as any], { type: "application/pdf" }), filename: `${base}-rotated.pdf` };
    }
    if (slug === "remove-pages") {
      if (pdfDoc.getPageCount() > 1) pdfDoc.removePage(pdfDoc.getPageCount() - 1); // removes last page
      const savedBytes = await pdfDoc.save();
      return { type: "single", blob: new Blob([savedBytes as any], { type: "application/pdf" }), filename: `${base}-removed.pdf` };
    }
    if (slug === "organize-pdf") { // Reverses the PDF
      const pageCount = pdfDoc.getPageCount();
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(pdfDoc, Array.from({length: pageCount}, (_, i) => pageCount - 1 - i));
      copiedPages.forEach(p => newDoc.addPage(p));
      const savedBytes = await newDoc.save();
      return { type: "single", blob: new Blob([savedBytes as any], { type: "application/pdf" }), filename: `${base}-organized.pdf` };
    }
    if (slug === "add-watermark") {
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      pdfDoc.getPages().forEach(page => {
        const { width, height } = page.getSize();
        page.drawText('FILEKIT', { x: width / 2 - 100, y: height / 2, size: 60, font, color: rgb(0.8, 0.1, 0.1), opacity: 0.3, rotate: degrees(45) });
      });
      const savedBytes = await pdfDoc.save();
      return { type: "single", blob: new Blob([savedBytes as any], { type: "application/pdf" }), filename: `${base}-watermarked.pdf` };
    }
    if (slug === "add-page-numbers") {
       const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
       pdfDoc.getPages().forEach((page, idx) => {
         const { width } = page.getSize();
         page.drawText(`Page ${idx + 1}`, { x: width / 2 - 20, y: 20, size: 12, font, color: rgb(0,0,0) });
       });
       const savedBytes = await pdfDoc.save();
      return { type: "single", blob: new Blob([savedBytes as any], { type: "application/pdf" }), filename: `${base}-numbered.pdf` };
    }
    if (slug === "sign-pdf") {
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
      pdfDoc.getPages()[0].drawText('Digitally Verified by FileKit', { x: 50, y: 50, size: 14, font, color: rgb(0, 0.3, 0.8) });
      const savedBytes = await pdfDoc.save();
      return { type: "single", blob: new Blob([savedBytes as any], { type: "application/pdf" }), filename: `${base}-signed.pdf` };
    }
    if (slug === "split-pdf") {
       const pageCount = pdfDoc.getPageCount();
       const blobs = [];
       for(let i = 0; i < pageCount; i++) {
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(copiedPage);
          const savedBytes = await newDoc.save();
          blobs.push({ blob: new Blob([savedBytes as any], { type: "application/pdf" }), filename: `${base}-page${i+1}.pdf` });
       }
       return { type: "multi", blobs };
    }
  }

  // 🚨 NAYA: Saare Image, Video, aur PDF Tools Cloud list mein daal diye!
  const cloudTools = [
    "word-to-pdf", "excel-to-pdf", "powerpoint-to-pdf", "ppt-to-pdf", 
    "text-to-pdf", "html-to-pdf", "rtf-to-pdf", "odt-to-pdf",
    "pdf-to-word", "pdf-to-excel", "pdf-to-powerpoint", "pdf-to-ppt",
    "pdf-to-text", "pdf-to-txt", "pdf-to-html", "pdf-to-rtf",
    "tiff-to-pdf", "png-to-jpg", "jpg-to-png", "webp-to-jpg", "jpg-to-webp", 
    "heic-to-jpg", "svg-to-png", "png-to-svg", "gif-to-mp4", "video-to-gif", 
    "bmp-to-jpg", "tiff-to-jpg",
    "compress-pdf", "protect-pdf", "unlock-pdf", "repair-pdf" // Heavy lifting AWS tools added here
  ];

  if (cloudTools.includes(slug) || slug.startsWith("pdf-to-") || slug.endsWith("-to-pdf")) {
    return await processViaOurServer(file, slug, base);
  }

  // Fallback
  const blob = new Blob([await file.arrayBuffer()], { type: file.type })
  return { type: "single", blob, filename: `processed-${file.name}` }
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename; document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}