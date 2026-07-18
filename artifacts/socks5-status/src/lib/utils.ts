import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUptime(startedAt: string | null): string {
  if (!startedAt) return "N/A"
  
  const start = new Date(startedAt)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
  
  if (diffInSeconds < 0) return "Just started"
  
  const days = Math.floor(diffInSeconds / 86400)
  const hours = Math.floor((diffInSeconds % 86400) / 3600)
  const minutes = Math.floor((diffInSeconds % 3600) / 60)
  const seconds = diffInSeconds % 60
  
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)
  
  return parts.join(" ")
}
