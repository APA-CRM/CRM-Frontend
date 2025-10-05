import {Injectable} from '@angular/core';
import {OrganizationFilesService} from '../organization-files.service';
import {FilesService} from '../files.service';
import {Observable, switchMap, tap} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {FileUpdateRequest} from '../../../models/files/file-update-request';
import {FileWithChildrenModel} from '../../../models/files/file-with-children-model';
import {FileModel} from '../../../models/files/file-model';
import {FileCreateRequest} from '../../../models/files/file-create-request';

@Injectable({
  providedIn: 'root'
})
export class OrganizationFilesAggregatorService {

  constructor(
    private organizationFilesService: OrganizationFilesService,
    private filesService: FilesService
  ) {
  }

  public downloadOrganizationFile(fileId: string): Observable<Blob> {
    return this.filesService.downloadFile(fileId);
  }

  public getOrganizationFile(fileId: string): Observable<FileWithChildrenModel> {
    return this.filesService.getFile(fileId);
  }

  public getRootOrganizationFile(organizationId: number): Observable<FileWithChildrenModel> {
    return this.organizationFilesService.getRootOrganizationFile(organizationId)
      .pipe(
        switchMap((file) =>
          this.filesService.getFile(file.fileId)
        )
      );
  }

  public createOrganizationFile(organizationId: number, request: FileCreateRequest): Observable<FileModel> {
    return this.filesService.createFile(request).pipe(
      tap((file) =>
        this.organizationFilesService.createOrganizationFile(organizationId, file.id)
          .subscribe()
      )
    );
  }

  public updateOrganizationFile(fileId: string, request: FileUpdateRequest): Observable<FileWithChildrenModel> {
    return this.filesService.updateFile(fileId, request);
  }

  public deleteFile(organizationId: number, fileId: string, forceDelete = false): Observable<void> {
    return this.organizationFilesService.deleteOrganizationFile(organizationId, fileId)
      .pipe(
        switchMap((data) =>
          this.filesService.deleteFile(fileId, forceDelete)
        )
      );
  }

}
