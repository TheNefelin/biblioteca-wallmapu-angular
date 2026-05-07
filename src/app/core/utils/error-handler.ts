export function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  
  if (typeof err === 'object' && err !== null) {
    const errorObj = err as Record<string, unknown>;
    
    // Estructura ApiResponse con error HTTP
    if (errorObj['error'] && typeof errorObj['error'] === 'object') {
      const apiError = errorObj['error'] as Record<string, unknown>;
      return (apiError['detail'] || apiError['message'] || 'Unexpected error') as string;
    }
    
    // Error directo del API
    if (errorObj['message']) return errorObj['message'] as string;
  }
  
  return 'Unexpected error';
}
