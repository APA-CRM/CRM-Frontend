import {FileModel} from './file-model';

export interface FileWithChildrenModel extends FileModel {

  childrenFiles: FileModel[]

}
