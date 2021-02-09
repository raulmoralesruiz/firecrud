import { Component, OnInit } from '@angular/core';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  mensaje: string = "";
  elemento: any;

  constructor(public chatService: ChatService) {
    this.chatService.cargarMensajes().subscribe(() => {

      // mover el foco del chat hacia el final, con delay
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);

    });
  }

  ngOnInit(): void {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviarMensaje() {
    // console.log(this.mensaje);

    // Si el mensaje está vacío, se detiene la ejecución
    if (this.mensaje.length === 0) {
      return;
    }

    // Si el mensaje tiene contenido...
    this.chatService.agregarMensaje(this.mensaje)
      .then( () => this.mensaje = "" )
      .catch( (err) => console.log('ERROR. No se puedo enviar el mensaje', err) );
  }

}
