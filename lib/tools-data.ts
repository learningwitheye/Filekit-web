export interface Tool {
  name: string
  slug: string
  description: string
  icon: string
  popular?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  tools: Tool[]
}

export const categories: Category[] = [
  {
    id: "doc-to-pdf",
    name: "Document to PDF",
    slug: "document-to-pdf",
    tools: [
      { name: "Word to PDF", slug: "word-to-pdf", description: "Convert Word documents to PDF", icon: "FileText" },
      { name: "Excel to PDF", slug: "excel-to-pdf", description: "Convert Excel spreadsheets to PDF", icon: "Table" },
      { name: "PowerPoint to PDF", slug: "powerpoint-to-pdf", description: "Convert PPT presentations to PDF", icon: "Presentation" },
      { name: "Text to PDF", slug: "text-to-pdf", description: "Convert plain text files to PDF", icon: "AlignLeft" },
      { name: "HTML to PDF", slug: "html-to-pdf", description: "Convert HTML pages to PDF", icon: "Code" },
      { name: "RTF to PDF", slug: "rtf-to-pdf", description: "Convert RTF documents to PDF", icon: "FileType" },
      { name: "ODT to PDF", slug: "odt-to-pdf", description: "Convert ODT files to PDF", icon: "File" },
    ],
  },
  {
    id: "pdf-to-doc",
    name: "PDF to Document",
    slug: "pdf-to-document",
    tools: [
      { name: "PDF to Word", slug: "pdf-to-word", description: "Convert PDF to editable Word files", icon: "FileText", popular: true },
      { name: "PDF to Excel", slug: "pdf-to-excel", description: "Convert PDF tables to Excel", icon: "Table" },
      { name: "PDF to PowerPoint", slug: "pdf-to-powerpoint", description: "Convert PDF to PPT slides", icon: "Presentation" },
      { name: "PDF to Text", slug: "pdf-to-text", description: "Extract text content from PDF", icon: "AlignLeft" },
      { name: "PDF to HTML", slug: "pdf-to-html", description: "Convert PDF to HTML format", icon: "Code" },
      { name: "PDF to RTF", slug: "pdf-to-rtf", description: "Convert PDF to RTF format", icon: "FileType" },
    ],
  },
  {
    id: "image-pdf",
    name: "Image & PDF Cross",
    slug: "image-pdf",
    tools: [
      { name: "JPG to PDF", slug: "jpg-to-pdf", description: "Convert JPG images to PDF", icon: "Image", popular: true },
      { name: "PNG to PDF", slug: "png-to-pdf", description: "Convert PNG images to PDF", icon: "Image" },
      { name: "BMP to PDF", slug: "bmp-to-pdf", description: "Convert BMP images to PDF", icon: "Image" },
      { name: "TIFF to PDF", slug: "tiff-to-pdf", description: "Convert TIFF images to PDF", icon: "Image" },
      { name: "PDF to JPG", slug: "pdf-to-jpg", description: "Convert PDF pages to JPG images", icon: "FileImage" },
      { name: "PDF to PNG", slug: "pdf-to-png", description: "Convert PDF pages to PNG images", icon: "FileImage" },
      { name: "Extract Images", slug: "extract-images", description: "Extract all images from a PDF", icon: "ImageDown" },
    ],
  },
  {
    id: "image-to-image",
    name: "Image to Image",
    slug: "image-to-image",
    tools: [
      { name: "PNG to JPG", slug: "png-to-jpg", description: "Convert PNG images to JPG", icon: "ArrowRightLeft" },
      { name: "JPG to PNG", slug: "jpg-to-png", description: "Convert JPG images to PNG", icon: "ArrowRightLeft" },
      { name: "WEBP to JPG", slug: "webp-to-jpg", description: "Convert WEBP images to JPG", icon: "ArrowRightLeft" },
      { name: "JPG to WEBP", slug: "jpg-to-webp", description: "Convert JPG images to WEBP", icon: "ArrowRightLeft" },
      { name: "HEIC to JPG", slug: "heic-to-jpg", description: "Convert iPhone HEIC photos to JPG", icon: "Smartphone" },
      { name: "SVG to PNG", slug: "svg-to-png", description: "Convert SVG vectors to PNG", icon: "Shapes" },
      { name: "PNG to SVG", slug: "png-to-svg", description: "Convert PNG images to SVG", icon: "Shapes" },
      { name: "GIF to MP4", slug: "gif-to-mp4", description: "Convert GIF animations to MP4", icon: "Video" },
      { name: "Video to GIF", slug: "video-to-gif", description: "Convert video clips to GIF", icon: "Film" },
      { name: "BMP to JPG", slug: "bmp-to-jpg", description: "Convert BMP images to JPG", icon: "ArrowRightLeft" },
      { name: "TIFF to JPG", slug: "tiff-to-jpg", description: "Convert TIFF images to JPG", icon: "ArrowRightLeft" },
    ],
  },
  {
    id: "pdf-management",
    name: "PDF Management",
    slug: "pdf-management",
    tools: [
      { name: "Merge PDF", slug: "merge-pdf", description: "Combine multiple PDFs into one", icon: "Combine", popular: true },
      { name: "Split PDF", slug: "split-pdf", description: "Split one PDF into multiple files", icon: "Scissors" },
      { name: "Compress PDF", slug: "compress-pdf", description: "Reduce PDF file size", icon: "PackageMinus", popular: true },
      { name: "Remove Pages", slug: "remove-pages", description: "Delete specific pages from PDF", icon: "Trash2" },
      { name: "Organize PDF", slug: "organize-pdf", description: "Reorder pages in your PDF", icon: "LayoutGrid" },
      { name: "Rotate PDF", slug: "rotate-pdf", description: "Rotate pages in your PDF", icon: "RotateCw" },
      { name: "Add Page Numbers", slug: "add-page-numbers", description: "Add page numbers to PDF", icon: "Hash" },
      { name: "Add Watermark", slug: "add-watermark", description: "Add watermark text to PDF", icon: "Stamp" },
      { name: "Protect PDF", slug: "protect-pdf", description: "Password protect your PDF", icon: "Lock" },
      { name: "Unlock PDF", slug: "unlock-pdf", description: "Remove PDF password protection", icon: "Unlock" },
      { name: "Repair PDF", slug: "repair-pdf", description: "Fix corrupted PDF files", icon: "Wrench" },
      { name: "Sign PDF", slug: "sign-pdf", description: "Digitally sign your PDF", icon: "PenLine" },
    ],
  },
  {
    id: "image-manipulation",
    name: "Image Manipulation",
    slug: "image-manipulation",
    tools: [
      { name: "Image Compressor", slug: "image-compressor", description: "Compress images without quality loss", icon: "PackageMinus", popular: true },
      { name: "Image Resizer", slug: "image-resizer", description: "Resize images to any dimension", icon: "Maximize2" },
      { name: "Image Cropper", slug: "image-cropper", description: "Crop images to your desired size", icon: "Crop" },
      { name: "Image Rotator", slug: "image-rotator", description: "Rotate or flip images", icon: "RotateCw" },
      { name: "Photo Upscaler", slug: "photo-upscaler", description: "AI-powered image upscaling", icon: "Sparkles" },
      { name: "Grayscale Converter", slug: "grayscale-converter", description: "Convert images to grayscale", icon: "Circle" },
      { name: "Meme Generator", slug: "meme-generator", description: "Create memes from your images", icon: "Laugh" },
      { name: "Background Remover", slug: "background-remover", description: "Remove image backgrounds with AI", icon: "Wand2", popular: true },
    ],
  },
]

export const popularTools = categories
  .flatMap((c) => c.tools.map((t) => ({ ...t, category: c.name, categorySlug: c.slug })))
  .filter((t) => t.popular)
  .slice(0, 6)

export function getToolBySlug(slug: string): (Tool & { category: string; categorySlug: string }) | undefined {
  for (const cat of categories) {
    const tool = cat.tools.find((t) => t.slug === slug)
    if (tool) return { ...tool, category: cat.name, categorySlug: cat.slug }
  }
  return undefined
}
