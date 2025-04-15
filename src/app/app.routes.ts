import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { ChooseOrganizationComponent } from './components/choose-organization/choose-organization.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: 'organization/create', component: CreateOrganizationComponent},
    {path: 'organization/choose', component: ChooseOrganizationComponent}
];
