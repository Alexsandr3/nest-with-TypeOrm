export class ApiErrorResultDto {
  public errorsMessages: FieldError[];
}

export class FieldError {
  public message: string;
  public field: string;
}
