import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { TranslateDirective } from 'app/shared/language';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import HasAnyAuthorityDirective from '../shared/auth/has-any-authority.directive';

@Component({
  selector: 'jhi-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [HasAnyAuthorityDirective, FontAwesomeModule, TranslateDirective, TranslateModule, RouterLink, RouterLinkActive],
})
export default class Home {
  public readonly account = inject(AccountService).account;

  private readonly router = inject(Router);

  login(): void {
    this.router.navigate(['/login']);
  }
}
