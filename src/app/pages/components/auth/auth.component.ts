import { Component, inject } from '@angular/core';
import { JunoService } from '../../../services/juno.service';
import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-auth',
  imports: [LoginComponent, LogoutComponent],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private readonly junoService = inject(JunoService);

  readonly signedIn = this.junoService.signedIn;
}
