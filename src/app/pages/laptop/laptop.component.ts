import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaptopService } from '../../services/laptop.service';
import { Laptop } from '../../models/laptop';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-laptop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laptop.html',
  styleUrl: './laptop.css'
})
export class LaptopComponent implements OnInit {

  editando: boolean = false;
  laptopEditando: Laptop | null = null;


  laptops: Laptop[] = [];

  nuevo: Omit<Laptop, 'id'> = {
    marca: '',
    color: '',
    procesador: '',
    memoria: 0
  };


  constructor(private laptopService: LaptopService, private cdr: ChangeDetectorRef, private zone: NgZone) {}

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
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Completa todos los campos y Memoria debe ser mayor a 0',
      timer: 3500,
      showConfirmButton: false
      });
    return;
  }

    const payload = { ...this.nuevo, memoria: Number(this.nuevo.memoria) };

    this.laptopService.createLaptop(payload).subscribe({
      next: (created) => {
        this.laptops = [...this.laptops, created];

        this.nuevo = { marca: '', color: '', procesador: '', memoria: 0 };

        this.cdr.detectChanges();

        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'La laptop fue creada correctamente',
          timer: 3500,
          showConfirmButton: false
        });
      },
      error: (err) => console.error('Error creando laptop:', err)
    });
  }

  eliminarLaptop(id: number): void {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {

      if (result.isConfirmed) {

        this.laptopService.deleteLaptop(id).subscribe({
          next: () => {
            this.laptops = this.laptops.filter(l => l.id !== id);

            queueMicrotask(() => this.cdr.detectChanges());

            this.cargarLaptops();

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La laptop fue eliminada correctamente',
              timer: 3500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo eliminar la laptop', 'error');
          }
        });

      }

    });
  }


  editarLaptop(laptop: Laptop) {
    this.editando = true;
    this.laptopEditando = { ...laptop };
  }

  actualizarLaptop(): void {
    if (!this.laptopEditando) return;

    const actualizado: Laptop = { ...this.laptopEditando };

    this.laptopService.updateLaptop(actualizado.id, actualizado).subscribe({
      next: () => {
        this.laptops = this.laptops.map(l =>
          l.id === actualizado.id ? actualizado : l
        );

        this.editando = false;
        this.laptopEditando = null;

        this.cdr.detectChanges();

        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'La laptop fue actualizada correctamente',
          timer: 3500,
          showConfirmButton: false
        });
      },
      error: (err) => console.error('Error actualizando:', err)
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.laptopEditando = null;
  }
}

