import {Component} from '@angular/core';
import {DividerModule} from 'primeng/divider';
import {InputTextModule} from 'primeng/inputtext';
import {CreateRoleComponent} from "../create-role/create-role.component";
import {RolesTableComponent} from "../roles-table/roles-table.component";
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-roles',
  imports: [
    DividerModule,
    CreateRoleComponent,
    InputTextModule,
    RolesTableComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

  roleName!: string | null;

  refreshFlag: boolean = false;

  onRoleCreated() {
    this.refreshFlag = !this.refreshFlag;
  }
}
