import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  label?: string
  className?: string
}

export function CodeBlock({ code, label, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("group relative flex flex-col rounded-md border bg-black/50 overflow-hidden", className)}>
      {label && (
        <div className="flex items-center px-4 py-2 border-b bg-muted/30 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="flex items-center justify-between p-4 pr-14">
        <code className="text-sm font-mono text-primary/90 break-all">
          {code}
        </code>
        <button
          onClick={handleCopy}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Copy to clipboard"
          aria-label="Copy to clipboard"
          data-testid={`button-copy-${label?.toLowerCase().replace(/\s+/g, '-') || 'code'}`}
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
