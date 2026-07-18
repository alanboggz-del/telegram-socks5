import { useEffect, useState } from "react"
import { useGetProxyStatus, getGetProxyStatusQueryKey } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { formatUptime } from "@/lib/utils"
import { Activity, Clock, Server, ShieldCheck, Terminal, AlertCircle } from "lucide-react"

export default function Home() {
  const { data: proxyStatus, isLoading, isError } = useGetProxyStatus({
    query: { refetchInterval: 5000, queryKey: getGetProxyStatusQueryKey() }
  })
  
  const [uptime, setUptime] = useState<string>("0s")
  
  useEffect(() => {
    if (!proxyStatus?.startedAt || !proxyStatus.running) {
      setUptime("0s")
      return
    }
    
    // Update uptime every second
    const interval = setInterval(() => {
      setUptime(formatUptime(proxyStatus.startedAt))
    }, 1000)
    
    setUptime(formatUptime(proxyStatus.startedAt))
    
    return () => clearInterval(interval)
  }, [proxyStatus?.startedAt, proxyStatus?.running])

  if (isLoading && !proxyStatus) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <Terminal className="h-8 w-8" />
          <p data-testid="text-loading">Establishing connection...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-mono">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Connection Error</CardTitle>
            </div>
            <CardDescription>
              Failed to reach the proxy status endpoint. The backend server might be offline.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const isRunning = proxyStatus?.running
  const host = proxyStatus?.host || "localhost"
  const port = proxyStatus?.port || 1080
  const connectionString = `socks5://${host}:${port}`

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans selection:bg-primary/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-start justify-between border-b pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">SOCKS5 Proxy</h1>
            </div>
            <p className="text-muted-foreground font-mono text-sm" data-testid="text-subtitle">
              Secure tunneling & routing service
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                Status
              </span>
              <div 
                className={`h-3 w-3 rounded-full ${isRunning ? "bg-primary pulse-dot" : "bg-destructive"}`}
                data-testid="status-indicator"
              />
            </div>
            <Badge 
              variant={isRunning ? "success" : "destructive"} 
              className="font-mono px-3 py-1 text-xs"
              data-testid="status-badge"
            >
              {isRunning ? "ONLINE" : "OFFLINE"}
            </Badge>
          </div>
        </header>

        {/* Main Status Panel */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardContent className="p-0 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-0">
              
              {/* Primary Connection Info */}
              <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/50 pb-6 md:pb-0 pr-0 md:pr-6">
                <div className="text-sm font-mono text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Server className="h-4 w-4" />
                  Target Node
                </div>
                <div 
                  className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter"
                  data-testid="text-host-port"
                >
                  {host}<span className="text-primary/70">:{port}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/50 pb-6 lg:pb-0 px-0 lg:px-6">
                <div className="text-sm font-mono text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-wider">
                  <Clock className="h-4 w-4" />
                  Uptime
                </div>
                <div 
                  className={`font-mono text-2xl font-semibold ${isRunning ? "text-primary" : "text-muted-foreground"}`}
                  data-testid="text-uptime"
                >
                  {isRunning ? uptime : "—"}
                </div>
              </div>

              <div className="flex flex-col justify-center pl-0 lg:pl-6">
                <div className="text-sm font-mono text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-wider">
                  <Activity className="h-4 w-4" />
                  Connections
                </div>
                <div 
                  className="font-mono text-2xl font-semibold text-foreground"
                  data-testid="text-connections"
                >
                  {isRunning ? proxyStatus.connections : "0"}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Connection String */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Connection URI
          </h2>
          <CodeBlock 
            code={connectionString} 
            label="Standard URI" 
            className="border-primary/20 shadow-[0_0_15px_rgba(0,255,0,0.05)]"
          />
        </div>

        {/* Configuration Guide */}
        <div className="space-y-4 pt-4 border-t fade-in-stagger">
          <h2 className="text-lg font-semibold mb-6">Client Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                cURL
              </h3>
              <CodeBlock 
                code={`curl -x ${connectionString} http://ifconfig.me`} 
              />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                SSH ProxyCommand
              </h3>
              <CodeBlock 
                code={`ssh -o ProxyCommand="nc -x ${host}:${port} %h %p" user@server`} 
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                Google Chrome
              </h3>
              <CodeBlock 
                code={`chrome --proxy-server="socks5://${host}:${port}"`} 
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                Firefox (about:config)
              </h3>
              <div className="rounded-md border bg-black/50 p-4 font-mono text-sm text-primary/80 space-y-2">
                <div><span className="text-muted-foreground">network.proxy.type</span> = 1</div>
                <div><span className="text-muted-foreground">network.proxy.socks</span> = {host}</div>
                <div><span className="text-muted-foreground">network.proxy.socks_port</span> = {port}</div>
                <div><span className="text-muted-foreground">network.proxy.socks_remote_dns</span> = true</div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="pt-12 pb-4 text-center border-t border-border/50">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            SOCKS5 Status Dashboard • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  )
}
