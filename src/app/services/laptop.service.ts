import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laptop } from '../models/laptop';

@Injectable({
  providedIn: 'root'
})
export class LaptopService {

  private apiUrl = 'https://localhost:7059/api/Lapptop';

  constructor(private http: HttpClient) {}

  // GET todos
  getLaptops(): Observable<Laptop[]> {
    return this.http.get<Laptop[]>(this.apiUrl);
  }

  // GET por id
  getLaptop(id: number): Observable<Laptop> {
    return this.http.get<Laptop>(`${this.apiUrl}/${id}`);
  }

  // POST
  createLaptop(laptop: Omit<Laptop, 'id'>): Observable<Laptop> {
    return this.http.post<Laptop>(this.apiUrl, laptop);
  }


  // PUT
  updateLaptop(id: number, laptop: Laptop) {
    return this.http.put(`${this.apiUrl}/${id}`, laptop, { responseType: 'text' });
  }

  // DELETE
  deleteLaptop(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

}


