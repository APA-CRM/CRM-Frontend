import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CreateRoleComponent } from "../create-role/create-role.component";
import { RolesTableComponent } from "../../roles-table/roles-table.component";

@Component({
  selector: 'app-roles',
  imports: [
    DividerModule,
    CreateRoleComponent,
    RolesTableComponent
],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

}
