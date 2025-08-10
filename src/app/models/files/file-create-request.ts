import {FileType} from '../../core/enums/file-type';

export interface FileCreateRequest {
  name: string;
  fileType: FileType;
  parentFileId: string;
}
