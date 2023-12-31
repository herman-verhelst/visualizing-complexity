import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, filter, map, Observable} from "rxjs";
import {Edition} from "./models/edition";
import {Sort} from "./models/sort";
import {SortDirection} from "./models/sort-direction";
import SortOption from "./models/sort-option";


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _dataSubject = new BehaviorSubject<Edition[]>([]);
  data$ = this._dataSubject.asObservable();

  private _sort = new BehaviorSubject<Sort>({
    direction: SortDirection.ASCENDING,
    option: SortOption.YEAR
  })
  sort$ = this._sort.asObservable();

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

  get sort(): Sort {
    return this._sort.value;
  }

  setSort(sort: Sort): void {
    console.log('sort')
    this._sort.next(sort)
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

  updateSort(sort: Sort): void {
    this.setSort(sort);
  }
}
