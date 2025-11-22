export interface ValidationIssue {
  message: string
  field?: string
}

export default class ValidationError extends Error {
  public readonly issues: ValidationIssue[]

  constructor(issues: ValidationIssue[]) {
    super("Validation failed")
    this.name = "ValidationError"
    this.issues = issues
  }
}
