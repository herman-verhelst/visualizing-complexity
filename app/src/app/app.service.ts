import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, filter, map, Observable} from "rxjs";
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

  getMinAndMaxMarginTime(): Observable<{ min: number; max: number }> {
    return this.data$.pipe(
      filter(data => data.length > 0),
      map(editions => {
        const marginTimes = editions.map(edition => edition.marginNumber);
        const minMarginTime = Math.min(...marginTimes);
        const maxMarginTime = Math.max(...marginTimes);

        return { min: minMarginTime, max: maxMarginTime };
      })
    );
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
