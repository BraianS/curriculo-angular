import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCep(cep: string) {
    if (cep == null) {
      alert("CEP Vazio");
    }
    return this.http.get("https://viacep.com.br/ws/" + cep + "/json/");

  }
}
