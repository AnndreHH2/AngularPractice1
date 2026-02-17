import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


// componente para gestionar los productos, con funcionalidades de CRUD y autenticación
@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.html',
  styleUrls: ['./producto.css']
})
export class ProductoComponent implements OnInit {

  editando: boolean = false;
  productoEditando: Producto | null = null;

  // array para almacenar los productos obtenidos del servicio
  productos: Producto[] = [];

  // objeto para almacenar los datos de un nuevo producto a crear
  nuevo: Omit<Producto, 'id'> = {
    nombreProducto: '',
    descripcionProducto: '',
    categoriaProducto: '',
    precioProducto: 0,
    cantidadProductos: 0
  };

  // inyecta el servicio, el ChangeDetectorRef, el AuthService y el Router
  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  // metodo para cargar los productos desde el servicio y actualizar la vista
  cargarProducto(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.cdr.detectChanges();
      console.log(data);
    });
  }

  // metodo para crear un nuevo producto, con validaciones y manejo de errores
  crearProducto(): void {
    const precio = Number(this.nuevo.precioProducto);
    const stock = Number(this.nuevo.cantidadProductos);

    if (!this.nuevo.nombreProducto.trim() ||
        !this.nuevo.descripcionProducto.trim() ||
        !this.nuevo.categoriaProducto.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Nombre, descripción y categoría son obligatorios',
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Precio inválido',
        text: 'El precio debe ser mayor a 0',
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Stock inválido',
        text: 'El stock no puede ser menor a 0',
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    // construye el payload con los datos validados
    const payload: Omit<Producto, 'id'> = {
      ...this.nuevo,
      precioProducto: precio,
      cantidadProductos: stock
    };

    // llama al servicio para crear el producto y maneja la respuesta
    this.productoService.createProducto(payload).subscribe({
      next: (created) => {
        this.productos = [...this.productos, created];

        this.nuevo = {
          nombreProducto: '',
          descripcionProducto: '',
          categoriaProducto: '',
          precioProducto: 0,
          cantidadProductos: 0
        };

        this.cdr.detectChanges();

        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El producto fue creado correctamente',
          timer: 2500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        if (err.status === 400 && err.error?.errors) {
          const validationErrors = Object.values(err.error.errors)
            .flat()
            .map(e => `• ${e}`)
            .join('<br>');

          Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: validationErrors
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado'
          });
        }
      }
    });
  }

  // metodo para eliminar un producto, mostrando una confirmación antes de proceder
  eliminarProducto(id: number): void {
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
        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            this.productos = this.productos.filter(p => p.id !== id);

            queueMicrotask(() => this.cdr.detectChanges());

            this.cargarProducto();

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El producto fue eliminado correctamente',
              timer: 3500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            Swal.fire('error', err?.error?.message ?? 'No se pudo eliminar el producto', 'error');
          }
        });
      }
    });
  }

  // metodo para iniciar la edición de un producto, estableciendo el estado y el producto en edición
  editarProducto(producto: Producto) {
    this.editando = true;
    this.productoEditando = { ...producto };
  }

  // metodo para actualizar un producto, enviando los datos editados al servicio y manejando la respuesta
  actualizarProducto(): void {
    if (!this.productoEditando) return;

    const actualizado: Producto = { ...this.productoEditando };

    this.productoService.updateProducto(actualizado.id, actualizado).subscribe({
      next: () => {
        this.productos = this.productos.map(p =>
          p.id === actualizado.id ? actualizado : p
        );

        this.editando = false;
        this.productoEditando = null;

        this.cdr.detectChanges();

        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El producto fue actualizado correctamente',
          timer: 3500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        if (err.status === 400 && err.error?.errors) {
          const validationErrors = Object.values(err.error.errors)
            .flat()
            .map(e => `• ${e}`)
            .join('<br>');

          Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: validationErrors
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado'
          });
        }
      }
    });
  }

  // metodo para cancelar la edición, reseteando el estado y el producto en edición
  cancelarEdicion(): void {
    this.editando = false;
    this.productoEditando = null;
  }

  // metodo para cerrar sesión, mostrando una confirmación antes de proceder
  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión actual se cerrará',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.auth.logout();
        this.router.navigateByUrl('/login');
      }
    });
  }

  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }


  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.productos.slice(inicio, inicio + this.elementosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productos.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

}