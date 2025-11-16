import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { initSatellite, onAuthStateChange, User } from '@junobuild/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JunoService {
  user: WritableSignal<User | undefined | null> = signal(undefined);

  readonly signedIn: Signal<boolean> = computed(
    () => this.user() !== null && this.user() !== undefined,
  );

  constructor() {
    onAuthStateChange((user) => this.user.set(user));
  }

  async init() {
    await initSatellite({
      satelliteId: environment.satelliteId,
      container: environment.container,
    });
  }
}
