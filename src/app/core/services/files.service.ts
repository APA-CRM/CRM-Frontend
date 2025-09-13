import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FileCreateRequest} from '../../models/files/file-create-request';
import {Observable} from 'rxjs';
import {FileModel} from '../../models/files/file-model';
import {environment} from '../../../environments/environment';
import {FileUpdateRequest} from '../../models/files/file-update-request';
import {FileWithChildrenModel} from '../../models/files/file-with-children-model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private readonly BASE_URI: string = "/api/files";

  constructor(
    private http: HttpClient
  ) {
  }

  public getFile(fileId: string): Observable<FileWithChildrenModel> {
    return this.http.get<FileWithChildrenModel>(environment.apiUrl + this.BASE_URI + `/${fileId}`);
  }

  public createFile(request: FileCreateRequest): Observable<FileModel> {
    let formData = new FormData();
    formData.append('name', request.name);
    formData.append('parentFileId', request.parentFileId);
    formData.append("fileType", request.fileType);
    if (request.content) {
      formData.append('content', request.content);
    }

    return this.http.post<FileModel>(environment.apiUrl + this.BASE_URI, formData);
  }

  public updateFile(fileId: string, request: FileUpdateRequest): Observable<FileWithChildrenModel> {
    let formData = new FormData();
    formData.append('name', request.name);
    formData.append('parentFileId', request.parentFileId);
    if (request.content) {
      formData.append('content', request.content);
    }

    return this.http.patch<FileWithChildrenModel>(environment.apiUrl + this.BASE_URI + `/${fileId}`, formData);
  }

  public deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(environment.apiUrl + this.BASE_URI + `/${fileId}`);
  }

}
