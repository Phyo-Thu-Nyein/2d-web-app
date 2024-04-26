import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  
  get2dResult() {
    return this.http.get('https://api.thaistock2d.com/live');
  }
  
}
