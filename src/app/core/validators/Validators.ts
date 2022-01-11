import { Validators } from "@angular/forms";

export const RequiredEMaximoLenght7Validacao = [
    Validators.required,
    Validators.maxLength(7)
]

export const RequiredEEmailValidacao = [
    Validators.required,
    Validators.email
]