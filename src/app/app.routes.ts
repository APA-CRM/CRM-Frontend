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
import {OrganizationProfileComponent} from './components/home-page/organization-profile/organization-profile.component';
import {FilesComponent} from './components/home-page/files/files.component';
import {
  CreateRestorePasswordRequestComponent
} from './components/restore-password/create-restore-password-request/create-restore-password-request.component';
import {VerifyCodeComponent} from './components/restore-password/verify-code/verify-code.component';
import {RestorePasswordComponent} from './components/restore-password/restore-password/restore-password.component';
import {authenticationGuard} from './core/guards/authentication.guard';
import {TasksTableComponent} from './components/home-page/tasks/tasks-table/tasks-table.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'forgot-password', component: CreateRestorePasswordRequestComponent},
  {path: 'verify-code/:requestId', component: VerifyCodeComponent},
  {path: 'restore-password', component: RestorePasswordComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'organization/create', component: CreateOrganizationComponent},
  {path: 'organization/choose', component: ChooseOrganizationComponent},
  {path: 'invitation/:invitationId', component: InvitationComponent},
  {
    path: '', component: HomeComponent, canActivate: [authenticationGuard], children: [
      {path: 'users', component: UsersTableComponent},
      {path: 'roles', component: RolesComponent},
      {path: 'user/me', component: UserProfileComponent},
      {path: 'user/:userId', component: UserProfileComponent},
      {path: 'organization/:organizationId', component: OrganizationProfileComponent},
      {path: 'files/root', component: FilesComponent},
      {path: 'files/:fileId', component: FilesComponent},
      {path: 'tasks', component: TasksTableComponent}
    ]
  }
];
