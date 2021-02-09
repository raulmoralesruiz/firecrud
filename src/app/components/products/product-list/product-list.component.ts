import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: ProductModel[] = [];
  loading = false;

  // usuario activo
  userName = sessionStorage.getItem("uname");

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;

    this.productService.getProducts().subscribe( res => {
      this.products = res;
      this.loading = false;
    });
  }

  deleteProduct( product: ProductModel, i: number ) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el producto "${product.name}"`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then( res => {
      if (res.value) {
        this.products.splice(i, 1);
        this.productService.deleteOneProduct( product.id ).subscribe();
      }
    })

  }

  logout(){
    // Salir del sistema
    this.productService.logout();

    // Redirigir hacia login
    this.router.navigate(['login']);
  }

}
