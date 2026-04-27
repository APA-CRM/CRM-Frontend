import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {FileOrganizationModel} from '../../../models/files/file-organization-model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationFilesService {

  private readonly BASE_URI: string = "/api/organizations";

  constructor(
    private http: HttpClient
  ) {
  }

  public getOrganizationFile(organizationId: number, fileId: string): Observable<FileOrganizationModel> {
    return this.http.get<FileOrganizationModel>(environment.apiUrl + this.BASE_URI + `/${organizationId}/files/${fileId}`);
  }

  public getRootOrganizationFile(organizationId: number): Observable<FileOrganizationModel> {
    return this.http.get<FileOrganizationModel>(environment.apiUrl + this.BASE_URI + `/${organizationId}/files/root`);
  }

  public createOrganizationFile(organizationId: number, fileId: string): Observable<FileOrganizationModel> {
    return this.http.post<FileOrganizationModel>(environment.apiUrl + this.BASE_URI + `/${organizationId}/files/${fileId}`, null);
  }

  public deleteOrganizationFile(organizationId: number, fileId: string): Observable<void> {
    return this.http.delete<void>(environment.apiUrl + this.BASE_URI + `/${organizationId}/files/${fileId}`);
  }

}
