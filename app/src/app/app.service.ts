import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Edition} from "./models/edition";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _dataSubject = new BehaviorSubject<Edition[]>([]);
  data$ = this._dataSubject.asObservable();

  get data(): Edition[] {
    return this._dataSubject.value;
  }

  setData(newData: Edition[]): void {
    this._dataSubject.next(newData);
  }

  constructor(private httpClient: HttpClient) {
  }

  fetchData(): void {
    this.httpClient
      .get<Edition[]>('assets/formatted-data.json')
      .subscribe(
        data => this.setData(data)
      );
  }
}
