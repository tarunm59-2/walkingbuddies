// Simple error logging service for debugging geolocation and other issues

interface ErrorLog {
  id: string;
  timestamp: Date;
  type: "geolocation" | "maps" | "api" | "permission";
  error: string;
  details?: any;
  userAgent: string;
  url: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 50; // Keep last 50 logs

  logGeolocationError(error: GeolocationPositionError, context?: string) {
    let errorMessage = "Unknown geolocation error";
    let errorDetails: any = {
      code: error.code,
      message: error.message,
      context
    };

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "User denied location permission";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out";
        break;
    }

    this.addLog({
      type: "geolocation",
      error: errorMessage,
      details: errorDetails
    });
  }

  logPermissionError(permission: string, status: PermissionState) {
    this.addLog({
      type: "permission",
      error: `Permission ${permission} was ${status}`,
      details: { permission, status }
    });
  }

  logMapsError(error: Error, context?: string) {
    this.addLog({
      type: "maps",
      error: error.message,
      details: { context, stack: error.stack }
    });
  }

  logApiError(endpoint: string, error: Error | string) {
    this.addLog({
      type: "api",
      error: typeof error === "string" ? error : error.message,
      details: { 
        endpoint, 
        stack: typeof error === "object" ? error.stack : undefined 
      }
    });
  }

  private addLog(logData: Omit<ErrorLog, "id" | "timestamp" | "userAgent" | "url">) {
    const log: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...logData
    };

    this.logs.unshift(log);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🚨 [${log.type.toUpperCase()}] ${log.error}`);
      console.log("Timestamp:", log.timestamp.toISOString());
      console.log("Details:", log.details);
      console.groupEnd();
    }

    // In production, you might want to send to an error tracking service
    // this.sendToErrorService(log);
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  getLogsByType(type: ErrorLog["type"]): ErrorLog[] {
    return this.logs.filter(log => log.type === type);
  }

  clearLogs() {
    this.logs = [];
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Get summary of error counts
  getErrorSummary() {
    const summary: Record<string, number> = {};
    
    this.logs.forEach(log => {
      const key = `${log.type}:${log.error}`;
      summary[key] = (summary[key] || 0) + 1;
    });

    return summary;
  }

  // Check if user has recurring permission issues
  hasRecurringPermissionIssues(): boolean {
    const permissionErrors = this.getLogsByType("permission");
    const geolocationErrors = this.getLogsByType("geolocation");
    
    return (
      permissionErrors.length > 2 || 
      geolocationErrors.filter(log => 
        log.details?.code === GeolocationPositionError.PERMISSION_DENIED
      ).length > 2
    );
  }

  // Get user-friendly error message with suggestions
  getErrorSuggestion(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access was blocked. Click the location icon in your browser's address bar and select 'Allow' to enable location tracking.";
      
      case error.POSITION_UNAVAILABLE:
        return "Unable to determine your location. Try moving to an area with better GPS signal or closer to a window.";
      
      case error.TIMEOUT:
        return "Location request took too long. Check your internet connection and try again.";
      
      default:
        return "There was an issue accessing your location. Try refreshing the page or checking your browser settings.";
    }
  }

  // Send error logs to external service (implement as needed)
  private async sendToErrorService(log: ErrorLog) {
    // In production, implement error tracking service integration
    // Examples: Sentry, LogRocket, DataDog, etc.
    
    try {
      // await fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log)
      // });
    } catch (err) {
      console.error("Failed to send error log:", err);
    }
  }
}

export const errorLogger = new ErrorLogger();

// Add global error handler for unhandled errors
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    errorLogger.logApiError("global", event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    errorLogger.logApiError("promise", event.reason?.toString() || "Unhandled promise rejection");
  });
}
