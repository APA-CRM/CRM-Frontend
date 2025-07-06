import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {CreateOrganizationComponent} from './components/create-organization/create-organization.component';
import {ChooseOrganizationComponent} from './components/choose-organization/choose-organization.component';
import {UsersTableComponent} from './components/home-page/users-table/users-table.component';
import {HomeComponent} from './components/home-page/home/home.component';
import {RolesComponent} from './components/home-page/roles/roles.component';
import {InvitationComponent} from './components/invitation/invitation.component';
import {UserProfileComponent} from './components/home-page/user-profile/user-profile.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'organization/create', component: CreateOrganizationComponent},
  {path: 'organization/choose', component: ChooseOrganizationComponent},
  {path: 'invitation/:invitationId', component: InvitationComponent},
  {
    path: '', component: HomeComponent, children: [
      {path: 'users', component: UsersTableComponent},
      {path: 'roles', component: RolesComponent},
      {path: 'user/me', component: UserProfileComponent},
      {path: 'user/:userId', component: UserProfileComponent}
    ]
  }
];
