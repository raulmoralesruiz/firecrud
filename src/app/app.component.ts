import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firecrud';

  public chats: Observable<any[]>;

  constructor(firestore: AngularFirestore) {
    this.chats = firestore.collection('chats').valueChanges();
  }


}
