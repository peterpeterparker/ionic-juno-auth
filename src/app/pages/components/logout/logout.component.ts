import { Component } from '@angular/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { IonButton } from '@ionic/angular/standalone';
import { signOut } from '@junobuild/core';

@Component({
  selector: 'app-logout',
  imports: [IonButton],
  templateUrl: './logout.component.html',
})
export class LogoutComponent {
  async logout() {
    await signOut();

    await SocialLogin.logout({ provider: 'google' });
  }
}
