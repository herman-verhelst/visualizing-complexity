import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";
import {Edition} from "./models/edition";
import {Sort} from "./models/sort";
import {SortDirection} from "./models/sort-direction";
import SortOption from "./models/sort-option";
import {SelectedEdition} from "./models/selected-edition";
import {Winner} from "./models/winner";
import Gradient from "./models/gradient";


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _dataSubject = new BehaviorSubject<Edition[]>([]);
  data$ = this._dataSubject.asObservable();

  private _selectedEditions = new BehaviorSubject<SelectedEdition[]>([]);
  selectedEditions$ = this._selectedEditions.asObservable();

  private _sort = new BehaviorSubject<Sort>({
    direction: SortDirection.DESCENDING,
    option: SortOption.YEAR
  })
  sort$ = this._sort.asObservable();

  get data(): Edition[] {
    return this._dataSubject.value;
  }

  setData(newData: Edition[]): void {
    this._dataSubject.next(newData);
    this._selectedEditions.next(
      newData.map(edition => {
        return {
          selected: false,
          edition: edition.edition,
          year: edition.year,
          winnerFirstName: edition.winner.firstName,
          winnerLastName: edition.winner.lastName,
        } as SelectedEdition
      })
    )
  }

  getMinAndMaxMarginTime(): { min: number; max: number } {
    let minMargin = 100,
      maxMargin: number = 0;

    this._dataSubject.value
      .filter(edition => {
        const filteredSelectedEditions: SelectedEdition[] = this._selectedEditions.value.filter(e => e.selected);
        if (filteredSelectedEditions.length === 0) return true;
        return filteredSelectedEditions.find(fe => fe.edition === edition.edition)
      })
      .forEach(edition => {
        if (edition.marginNumber > maxMargin) maxMargin = edition.marginNumber;
        if (edition.marginNumber < minMargin) minMargin = edition.marginNumber;
      })

    return {min: minMargin, max: maxMargin};

  }

  get sort(): Sort {
    return this._sort.value;
  }

  setSort(sort: Sort): void {
    this._sort.next(sort)
  }

  setSelectedEditions(selectedEditions: SelectedEdition[]): void {
    this._selectedEditions.next(selectedEditions)
  }

  constructor(private httpClient: HttpClient) {
  }

  fetchData(): void {
    this.httpClient
      .get<Edition[]>('assets/formatted-data.json')
      .pipe(
        map((data: Edition[]): Edition[] => {
          const editions: Edition[] = [],
            gradients: Gradient[] = Object.values(Gradient);
          let current: number = 0;

          console.log(gradients)

          data.forEach(edition => {
            const nameArray = edition.winner.name.split(' ');
            edition.winner.firstName = nameArray[0]
            edition.winner.lastName = nameArray.slice(1).join(' ');

            const foundEdition = editions.find(e => edition.winner.name === e.winner.name)
            if (foundEdition) {
              foundEdition.multipleWins = true;
              edition.multipleWins = true;

              console.log(foundEdition.backgroundGradient)
              if (foundEdition.backgroundGradient) {
                edition.backgroundGradient = foundEdition.backgroundGradient;
              } else {
                console.log('here')
                foundEdition.backgroundGradient = gradients[current];
                edition.backgroundGradient = gradients[current];
                current++;
              }
            } else editions.push(edition)
          })

          console.log(data)
          return data
        })
      )
      .subscribe(
        data => this.setData(data)
      );
  }

  updateSort(sort: Sort): void {
    this.setSort(sort);
  }

  updateSelectedEdition(edition: SelectedEdition): void {
    const selectedEditions = this._selectedEditions.value
    const foundEdition = selectedEditions.find(e => e.edition === edition.edition);

    if (!foundEdition) return;
    foundEdition.selected = !foundEdition.selected;
    this.setSelectedEditions(selectedEditions);
  }
}
