export class ValidationError extends AppError {
  constructor(message: string, public errors?: any) {
    super(message, 422);
    this.name = "ValidationError";
  }
}
