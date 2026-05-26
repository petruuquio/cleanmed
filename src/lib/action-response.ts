export type ActionResponse<T = undefined> = 
  | { success: true; data?: T; message?: string }
  | { success: false; error: { code: string; message: string; details?: any } };

export function actionSuccess<T>(data?: T, message?: string): ActionResponse<T> {
  return { success: true, data, message };
}

export function actionError(message: string, code: string = "INTERNAL_ERROR", details?: any): ActionResponse<any> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}
