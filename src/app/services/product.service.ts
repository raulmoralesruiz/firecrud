import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

import { delay, map } from 'rxjs/operators';

import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // ruta de la base de datos en firebase
  private url = 'https://firecrud-ng-default-rtdb.firebaseio.com';

  // Usuario logeado con Google
  public usuario: any = {};

  constructor(private http: HttpClient, public auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe(user => {
      if (!user) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    })
  }

  /* Método que añade un producto a la base de datos firebase */
  addProduct(product: ProductModel) {
    return this.http.post(`${this.url}/products.json`, product).pipe(
      map((res: any) => {
        product.id = res.name;
        return product;
      })
    );
  }

  /* Método que actualiza un producto de la base de datos firebase */
  updateProduct(product: ProductModel) {
    // Se crea un producto temporal ...
    const productTemp = {
      // ...con todas las propiedades del producto original
      ...product,
    };

    // Se elimina el id del producto temporal
    delete productTemp.id;

    // Se actualiza el producto con id original, indicando los datos del producto temporal
    return this.http
      .put(`${this.url}/products/${product.id}.json`, productTemp)
      .pipe();
  }

  /* Método que obtiene un producto de la base de datos firebase, indicando el id */
  getOneProduct(id: string) {
    return this.http.get(`${this.url}/products/${id}.json`);
  }

  /* Método que elimina un producto de la base de datos firebase, indicando el id */
  deleteOneProduct(id: string) {
    return this.http.delete(`${this.url}/products/${id}.json`);
  }

  /* Método que obtiene todos los productos de la base de datos firebase */
  getProducts() {
    return this.http
      .get(`${this.url}/products.json`)
      .pipe(map(this.createArray), delay(0));
  }

  private createArray(productObject: object) {
    const products: ProductModel[] = [];

    // Validar objeto, para comprobar si la base de datos está vacía (sin objetos)
    if (productObject === null) {
      return [];
    }

    // Recorrer los objetos obtenidos y crear array
    Object.keys(productObject).forEach((key) => {
      const product: ProductModel = productObject[key];
      product.id = key;

      products.push(product);
    });

    return products;
  }

  // Firebase Authentication - Login
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

    this.auth.authState.subscribe(user => {
      // console.log('Estado del usuario: ', user);

      if (!user) {
        return;
      }

        // guardar uid del usuario
        let uid = user.uid;
        let uname = user.displayName;

        // Guardar id del usuario en sessionStorage
        sessionStorage.setItem("uid", uid);
        sessionStorage.setItem("uname", uname);
    
        if (uid) {
          // Redirigir hacia lista de productos
        this.router.navigate(['products']);  
        }
    })

  }

  // Firebase Authentication - Logout
  logout() {
    // Restablecer (vaciar) usuario
    this.usuario = {};

    sessionStorage.removeItem("uid");
    sessionStorage.removeItem("uname");

    this.auth.signOut();
  }
}