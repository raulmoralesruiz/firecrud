import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: ProductModel = new ProductModel();

  // usuario activo
  userName = sessionStorage.getItem("uname");

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== 'new') {
      this.productService.getOneProduct(id)
        .subscribe( (res:ProductModel) => {
          this.product = res;
          this.product.id = id;
        });
    }
  }

  /* Método que guarda un producto en la base de datos firebase */
  guardar(form: NgForm) {
    // Si el producto no es válido, se muestra un error y se termina la ejecución.
    if (form.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'No es posible guardar los cambios',
        allowOutsideClick: false,
        icon: 'error'
      });

      return;
    }

    // Se muestra aviso de carga
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false,
      icon: 'info'
    });
    Swal.showLoading();

    // Se define una petición
    let request: Observable<any>;

    // Se comprueba si el producto contiene ID
    if (this.product.id) {
      // si tiene ID, se actualiza
      request = this.productService.updateProduct(this.product);
    } else {
      // si NO tiene ID, se añade
      request = this.productService.addProduct(this.product);
    }

    // Se muestra aviso de actualización
    request.subscribe( res => {
      Swal.fire({
        title: this.product.name,
        text: 'Datos almacenados correctamente',
        icon: 'success'
      });
    });

  }

  /* Método que suma una unidad al producto deseado */
  sumarCantidad() {
    this.product.amount = this.product.amount + 1;
  }

  /* Método que resta una unidad al producto deseado */
  restarCantidad() {
    if (this.product.amount > 1) {
      this.product.amount = this.product.amount - 1;
    }
  }
}
