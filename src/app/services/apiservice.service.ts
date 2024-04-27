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

  get2dHistory() {
    return this.http.get('https://api.thaistock2d.com/2d_result');
  }

  get3dResult() {
    return this.http.get('https://api.2dboss.com/api/v2/v1/2dstock/threed-result');
  }
  
}
