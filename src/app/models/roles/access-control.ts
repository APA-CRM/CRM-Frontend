import {Action} from '../../core/enums/action';
import {Resource} from '../../core/enums/resource';

export interface AccessControl {
  resource: Resource
  actions: Action[]
}
