import { Component, OnInit } from '@angular/core';

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

  constructor(private productService: ProductService) { }

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

}
