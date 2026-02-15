import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laptop } from '../models/laptop';

@Injectable({
  providedIn: 'root'
})
export class LaptopService {

  private apiUrl = 'https://localhost:7059/api/Lapptop'; // tu endpoint .NET

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
  updateLaptop(id: number, laptop: Laptop): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, laptop);
  }

  // DELETE
  deleteLaptop(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


