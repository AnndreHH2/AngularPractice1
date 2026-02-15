import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaptopService } from '../../services/laptop.service';
import { Laptop } from '../../models/laptop';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-laptop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laptop.html',
  styleUrl: './laptop.css'
})
export class LaptopComponent implements OnInit {

  laptops: Laptop[] = [];

  nuevo: Omit<Laptop, 'id'> = {
    marca: '',
    color: '',
    procesador: '',
    memoria: 0
  };


  constructor(private laptopService: LaptopService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarLaptops();
  }

  cargarLaptops(): void {
    this.laptopService.getLaptops().subscribe(data => {
      this.laptops = data;
      this.cdr.detectChanges();
      console.log(data);
    });
  }

  crearLaptop(): void {
    if (!this.nuevo.marca.trim() ||
      !this.nuevo.color.trim() ||
      !this.nuevo.procesador.trim() ||
      Number(this.nuevo.memoria) <= 0) {
    alert('Completa todos los campos y Memoria debe ser mayor a 0');
    return;
  }

    const payload = { ...this.nuevo, memoria: Number(this.nuevo.memoria) };

    this.laptopService.createLaptop(payload).subscribe({
      next: (created) => {
        // 👇 lo agregas en UI al instante
        this.laptops = [...this.laptops, created];

        this.nuevo = { marca: '', color: '', procesador: '', memoria: 0 };

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error creando laptop:', err)
    });
  }



}

