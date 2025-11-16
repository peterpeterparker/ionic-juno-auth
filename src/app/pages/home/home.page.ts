import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { isGoogleUser } from '@junobuild/core';
import { JunoService } from '../../services/juno.service';
import { AuthComponent } from '../components/auth/auth.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AuthComponent,
    IonText,
  ],
})
export class HomePage {
  readonly isGoogleUser = isGoogleUser;

  private readonly junoService = inject(JunoService);

  readonly user = this.junoService.user;
}
