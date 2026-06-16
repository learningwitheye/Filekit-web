"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase" // ✅ Supabase Import kiya

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useLimits() {
  const [isPro, setIsPro] = useState(false) 
  const [uploadCount, setUploadCount] = useState(0)
  const [bgRemovalCount, setBgRemovalCount] = useState(0)

  // Timer states
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const [aiLockoutTime, setAiLockoutTime] = useState<number | null>(null)

  useEffect(() => {
    // ✅ 1. Supabase se check karo ki user Pro hai ya nahi AUR uska time bacha hai ya nahi
    const checkProStatus = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_pro, pro_expires_at') // Expiry time bhi fetch kiya
          .eq('id', session.user.id)
          .single()
        
        if (data?.is_pro && data?.pro_expires_at) {
          const expiryDate = new Date(data.pro_expires_at)
          const now = new Date()

          // Agar time bacha hai tabhi Pro limits hatao, warna free limits lagao
          if (expiryDate > now) {
            setIsPro(true)
          } else {
            setIsPro(false)
          }
        } else {
          setIsPro(false)
        }
      }
    }
    
    checkProStatus()

    // 2. Local Storage ke timers check karo
    const checkExpirations = () => {
      const now = Date.now()
      let savedUploads = parseInt(localStorage.getItem("free_uploads") || "0", 10)
      let savedLockout = parseInt(localStorage.getItem("lockout_time") || "0", 10)
      let savedBgRemovals = parseInt(localStorage.getItem("free_bg_removals") || "0", 10)
      let savedAiLockout = parseInt(localStorage.getItem("ai_lockout_time") || "0", 10)

      if (savedLockout > 0 && now >= savedLockout) {
        savedUploads = 0; savedLockout = 0;
        localStorage.setItem("free_uploads", "0"); localStorage.removeItem("lockout_time");
      }

      if (savedAiLockout > 0 && now >= savedAiLockout) {
        savedBgRemovals = 0; savedAiLockout = 0;
        localStorage.setItem("free_bg_removals", "0"); localStorage.removeItem("ai_lockout_time");
      }

      setUploadCount(savedUploads)
      setLockoutTime(savedLockout > 0 ? savedLockout : null)
      setBgRemovalCount(savedBgRemovals)
      setAiLockoutTime(savedAiLockout > 0 ? savedAiLockout : null)
    }

    checkExpirations();
    const interval = setInterval(checkExpirations, 1000);
    return () => clearInterval(interval);
  }, [])

  // 1. File Size Limit (50MB)
  const checkFileSize = (file: File) => {
    if (isPro) return true; // ✅ Agar pro hai toh sab allow
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large!", {
        description: "Maximum 50MB allowed for free users. Upgrade to Pro for unlimited size.",
        action: { label: "Upgrade", onClick: () => (window.location.href = "/pricing") },
      })
      return false;
    }
    return true;
  }

  // 2. Normal Upload Limit (Max 5)
  const checkUploadLimit = () => {
    if (isPro) return true; // ✅ Agar pro hai toh koi cooldown nahi
    if (uploadCount >= 5 && lockoutTime) {
      toast.error("Cooldown Active", {
        description: "Please wait for the timer to finish or upgrade to Pro.",
        action: { label: "Upgrade", onClick: () => (window.location.href = "/pricing") },
      })
      return false;
    }
    return true;
  }

  // 3. Background Remover Limit (Max 1)
  const checkBgRemoverLimit = () => {
    if (isPro) return true; // ✅ Agar pro hai toh koi cooldown nahi
    if (bgRemovalCount >= 1 && aiLockoutTime) {
      toast.error("Cooldown Active", {
        description: "Please wait for the timer to finish or upgrade to Pro.",
        action: { label: "Upgrade", onClick: () => (window.location.href = "/pricing") },
      })
      return false;
    }
    return true;
  }

  // 4. File process hone ke baad count badhana
  const incrementUploadCount = (isBgRemover: boolean = false) => {
    if (isPro) return; // ✅ Agar pro hai toh count badhana hi nahi hai!
    
    const now = Date.now();

    if (isBgRemover) {
      const newBgCount = bgRemovalCount + 1;
      setBgRemovalCount(newBgCount);
      localStorage.setItem("free_bg_removals", newBgCount.toString());

      if (newBgCount >= 1) {
        const lockout = now + COOLDOWN_MS;
        setAiLockoutTime(lockout);
        localStorage.setItem("ai_lockout_time", lockout.toString());
      }
    } else {
      const newCount = uploadCount + 1;
      setUploadCount(newCount);
      localStorage.setItem("free_uploads", newCount.toString());

      if (newCount >= 5) {
        const lockout = now + COOLDOWN_MS;
        setLockoutTime(lockout);
        localStorage.setItem("lockout_time", lockout.toString());
      }
    }
  }

  return { isPro, checkFileSize, checkUploadLimit, checkBgRemoverLimit, incrementUploadCount, lockoutTime, aiLockoutTime }
}