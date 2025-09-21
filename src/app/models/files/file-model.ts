import {FileType} from '../../core/enums/file-type';
import {FileExtension} from '../../core/enums/file-extension';

export interface FileModel {
  id: string,
  name: string,
  fullName: string,
  fileType: FileType,
  fileExtension: FileExtension,
  createdAt: Date,
  updatedAt: Date,
}
