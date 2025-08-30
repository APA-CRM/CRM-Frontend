import {Component, OnInit} from '@angular/core';
import {
  OrganizationFilesAggregatorService
} from '../../../core/services/aggregators/organization-files-aggregator.service';
import {TreeTableModule} from 'primeng/treetable';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {FileUpdateRequest} from '../../../models/files/file-update-request';
import {FileWithChildrenModel} from '../../../models/files/file-with-children-model';
import {FileType} from '../../../core/enums/file-type';
import {FileCreateRequest} from '../../../models/files/file-create-request';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {SelectModule} from 'primeng/select';
import {DatePipe, NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {OrganizationHolderService} from '../../../core/services/organization-holder.service';

@Component({
  selector: 'app-files',
  imports: [
    TreeTableModule,
    Dialog,
    FormsModule,
    ButtonDirective,
    SelectModule,
    DatePipe,
    InputTextModule,
    NgIf,
    DropdownModule
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent implements OnInit {
  organizationId!: number;

  filesTree: FileWithChildrenModel | null = null;
  selectedFile: FileWithChildrenModel | null = null;
  displayDialog = false;
  isEdit = false;
  fileForm: Partial<FileCreateRequest & FileUpdateRequest> = {};

  fileTypeOptions = [
    {label: 'Directory', value: FileType.DIRECTORY},
    {label: 'File', value: FileType.FILE}
  ];

  constructor(
    private aggregator: OrganizationFilesAggregatorService,
    private organizationHolder: OrganizationHolderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.organizationId = this.organizationHolder.getOrganizationId();
  }

  ngOnInit() {
    if (this.organizationId) {
      this.loadRootFile();
    }
  }

  loadRootFile() {
    this.aggregator.getRootOrganizationFile(this.organizationId).subscribe({
      next: (file) => this.filesTree = file
    });
  }

  openCreateDialog(parentFileId: string) {
    this.isEdit = false;
    this.displayDialog = true;
    this.fileForm = {parentFileId, name: '', fileType: FileType.FILE};
  }

  openEditDialog(file: FileWithChildrenModel) {
    this.isEdit = true;
    this.displayDialog = true;
    this.fileForm = {name: file.name, parentFileId: file.id};
    this.selectedFile = file;
  }

  saveFile() {
    if (this.isEdit && this.selectedFile) {
      const updateReq: FileUpdateRequest = {
        name: this.fileForm.name!,
        parentFileId: this.fileForm.parentFileId!
      };
      this.aggregator.updateOrganizationFile(this.selectedFile.id, updateReq).subscribe({
        next: () => {
          this.displayDialog = false;
          this.loadRootFile();
          this.messageService.add({severity: 'success', summary: 'Updated', detail: 'File updated successfully'});
        }
      });
    } else {
      const createReq: FileCreateRequest = {
        name: this.fileForm.name!,
        fileType: this.fileForm.fileType!,
        parentFileId: this.fileForm.parentFileId!
      };
      this.aggregator.createOrganizationFile(this.organizationId, createReq).subscribe({
        next: () => {
          this.displayDialog = false;
          this.loadRootFile();
          this.messageService.add({severity: 'success', summary: 'Created', detail: 'File created successfully'});
        }
      });
    }
  }

  deleteFile(file: FileWithChildrenModel) {
    this.confirmationService.confirm({
      header: `Delete '${file.name}' file`,
      message: 'Are you sure you want to delete this file?',
      accept: () => {
        this.aggregator.deleteFile(this.organizationId, file.id).subscribe({
          next: () => {
            this.loadRootFile();
            this.messageService.add({severity: 'success', summary: 'Deleted', detail: 'File deleted successfully'});
          }
        });
      }
    });
  }

  toTreeNodes(file: FileWithChildrenModel): TreeNode {
    return {
      data: file,
      children: file.childrenFiles?.map(child => ({
        data: child,
        children: [],
        leaf: true
      })) || [],
      leaf: !file.childrenFiles || file.childrenFiles.length === 0
    };
  }
}
