import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: "",
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || "Unexpected rendering error",
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application boundary caught error:", error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      let displayDetail = this.state.message
      try {
        const parsed = JSON.parse(this.state.message) as { error?: string; operationType?: string }
        if (parsed?.error) {
          displayDetail = `${parsed.operationType ? `${parsed.operationType.toUpperCase()}: ` : ""}${parsed.error}`
        }
      } catch {
        // Plain error message
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
          <div className="editorial-panel max-w-lg border p-8">
            <div className="flex items-center gap-2.5 text-path-accent">
              <AlertTriangle className="size-5" aria-hidden="true" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">
                Workspace Recovery
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl text-foreground">
              Something interrupted this view.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {displayDetail}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: "" })
                window.location.href = "/"
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-[4px] bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-[#FA4028] hover:text-white cursor-pointer"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Return to SMK TechVora
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
