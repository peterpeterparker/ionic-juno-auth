import { Component, inject, OnInit } from '@angular/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { GoogleLoginResponseOnline } from '@capgo/capacitor-social-login/dist/esm/definitions';
import { IonButton, LoadingController } from '@ionic/angular/standalone';
import { authenticate, initContext } from '@junobuild/auth';
import { environment } from '../../../../environments/environment';
import { JunoService } from '../../../services/juno.service';
import { AuthClientStore } from '../../../stores/auth-client.store';

@Component({
  selector: 'app-login',
  imports: [IonButton],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly junoService = inject(JunoService);
  private readonly loadingCtrl = inject(LoadingController);

  constructor() {}

  async ngOnInit() {
    await SocialLogin.initialize({
      google: {
        webClientId: "995487803348-obk39ugehki4vnhtm8hthhvei010vn5v.apps.googleusercontent.com",
        iOSClientId:
          '995487803348-6sbcl4v1ioj08k3pt8k3p5di5fvb60dj.apps.googleusercontent.com',
        mode: 'online',
      },
    });

    console.log('Init done');
  }

  async login() {
    const {nonce} = await initContext();

    console.log('Nonce', nonce);

    const { result } = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['openid', 'profile', 'email'],
        nonce
      },
    });

    const { idToken } = result as GoogleLoginResponseOnline;

    if (idToken === null) {
      // TODO: error
      return;
    }

    await this.handleRegister({ idToken });
  }

  private async handleRegister({ idToken }: { idToken: string }) {
    const loading = await this.loadingCtrl.create({
      message: 'Hold tight...',
    });

    await loading.present();

    try {
      console.log('1. Authenticate', idToken);

      const {
        identity: { delegationChain, sessionKey },
      } = await authenticate({
        credentials: {
          jwt: idToken,
        },
        auth: {
          satellite: {
            satelliteId: environment.satelliteId,
            container: environment.container,
          },
        },
      });

      console.log('2. AuthClient mumbo jumbo');

      // Set up the delegation and session key for the AuthClient
      await AuthClientStore.getInstance().setAuthClientStorage({
        delegationChain,
        sessionKey,
      });

      console.log('3. Init');

      await this.junoService.init();
    } catch (err: unknown) {
      console.log("Error:", err);
    } finally {
      await loading.dismiss();
    }
  }

  async logout() {
    await SocialLogin.logout({provider: 'google'});
  }
}
