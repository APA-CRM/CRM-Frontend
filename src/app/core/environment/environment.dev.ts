import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentDev {
  public apiUrl = 'http://localhost:8080';
}
