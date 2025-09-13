import {Component, OnInit} from '@angular/core';
import {
  OrganizationFilesAggregatorService
} from '../../../core/services/aggregators/organization-files-aggregator.service';
import {TreeTableModule} from 'primeng/treetable';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {FileUpdateRequest} from '../../../models/files/file-update-request';
import {FileWithChildrenModel} from '../../../models/files/file-with-children-model';
import {FileType} from '../../../core/enums/file-type';
import {FileCreateRequest} from '../../../models/files/file-create-request';
import {ConfirmationService, MessageService} from 'primeng/api';
import {SelectModule} from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {OrganizationHolderService} from '../../../core/services/organization-holder.service';
import {NgClass} from '@angular/common';
import {FileSelectEvent, FileUploadModule} from 'primeng/fileupload';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {FileModel} from '../../../models/files/file-model';
import {ActivatedRoute, Router} from '@angular/router';
import {PopoverModule} from 'primeng/popover';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'app-files',
  imports: [
    TreeTableModule,
    Dialog,
    FormsModule,
    SelectModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    NgClass,
    FileUploadModule,
    PopoverModule,
    SkeletonModule
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent implements OnInit {
  organizationId!: number;

  file: FileWithChildrenModel | null = null;
  selectedFile: FileModel | null = null;

  displayDialog = false;
  isEdit = false;
  isLoading = false;

  fileForm: Partial<FileCreateRequest & FileUpdateRequest> = {};

  fileTypeOptions = [
    {label: 'Directory', value: FileType.DIRECTORY},
    {label: 'File', value: FileType.FILE}
  ];

  constructor(
    private aggregator: OrganizationFilesAggregatorService,
    private organizationHolder: OrganizationHolderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.organizationId = this.organizationHolder.getOrganizationId();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let fileId = params['fileId'];

      if (fileId) {
        this.loadFile(fileId);
      } else {
        this.loadRootFile();
      }
    })

  }

  loadFile(fileId: string): void {
    this.isLoading = true;

    this.aggregator.getOrganizationFile(fileId).subscribe({
      next: (file) => {
        this.file = file;
        this.isLoading = false;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  loadRootFile() {
    this.isLoading = true;

    this.aggregator.getRootOrganizationFile(this.organizationId).subscribe({
      next: (file) => {
        this.file = file;
        this.isLoading = false;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    });
  }

  openCreateDialog(parentFileId: string) {
    this.isEdit = false;
    this.displayDialog = true;
    this.fileForm = {parentFileId: parentFileId, name: '', fileType: FileType.FILE};
  }

  openDirectory(file: FileModel): void {
    if (file.fileType == FileType.FILE) {
      return;
    }

    this.router.navigate(['files', file.id]);
  }

  openEditDialog(file: FileModel) {
    this.isEdit = true;
    this.displayDialog = true;
    this.fileForm = {name: file.name, parentFileId: this.file!.id, fileType: file.fileType};
    this.selectedFile = file;
  }

  saveFile() {
    if (this.isEdit && this.selectedFile) {
      const updateReq: FileUpdateRequest = {
        name: this.fileForm.name!,
        parentFileId: this.fileForm.parentFileId!,
        content: this.fileForm.content!,
      };
      this.aggregator.updateOrganizationFile(this.selectedFile.id, updateReq).subscribe({
        next: (file) => {
          this.displayDialog = false;
          let indexOfFile = this.getIndexOfFile(file.id);
          this.file!.childrenFiles[indexOfFile] = file;

          this.messageService.add({severity: 'success', summary: 'Updated', detail: 'File updated successfully'});
        },
        error: (err) => {
          const error: ErrorMessageModel = err.error;

          this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        }
      });
    } else {
      const createReq: FileCreateRequest = {
        name: this.fileForm.name!,
        fileType: this.fileForm.fileType!,
        parentFileId: this.fileForm.parentFileId!,
        content: this.fileForm.content!
      };
      this.aggregator.createOrganizationFile(this.organizationId, createReq).subscribe({
        next: (file) => {
          this.displayDialog = false;
          this.file?.childrenFiles.push(file);
          this.messageService.add({severity: 'success', summary: 'Created', detail: 'File created successfully'});
        },
        error: (err) => {
          const error: ErrorMessageModel = err.error;

          this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        }
      });
    }
  }

  deleteFile(file: FileModel) {
    this.confirmationService.confirm({
      header: `Delete '${file.name}' file`,
      message: 'Are you sure you want to delete this file?',
      accept: () => {
        this.aggregator.deleteFile(this.organizationId, file.id).subscribe({
          next: () => {
            let indexOfFile = this.getIndexOfFile(file.id);
            this.file?.childrenFiles.splice(indexOfFile, 1);

            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: `${file.name} has been deleted successfully`
            });
          },
          error: (err) => {
            const error: ErrorMessageModel = err.error;

            this.messageService.add({closable: true, summary: error.message, severity: 'error'});
          }
        });
      }
    });
  }

  onFileSelected($event: FileSelectEvent): void {
    const files = $event.files;

    if (files && files.length > 0) {
      let file = files[0];

      this.fileForm.name = file.name;
      this.fileForm.content = file;
    }
  }

  getIconForFile(fileType: FileType): string {
    return "pi " + (fileType == FileType.FILE ? "pi-file" : "pi-folder-open");
  }

  private getIndexOfFile(fileId: string): number {
    return <number>this.file?.childrenFiles
      .findIndex(file => file.id === fileId);
  }
}
