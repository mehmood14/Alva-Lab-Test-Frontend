import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  addTransactions(data: object) {
    return this.http.post(`${this.url}/transactions`, data);
  }

  getTransactions() {
    return this.http.get(`${this.url}/transactions`);
  }

  getAccountById(account_id: string) {
    return this.http.get(`${this.url}/accounts/${account_id}`);
  }
}
