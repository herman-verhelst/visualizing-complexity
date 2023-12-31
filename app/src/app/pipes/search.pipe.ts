import {Pipe, PipeTransform} from '@angular/core';
import {SelectedEdition} from "../models/selected-edition";

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(selectedEditions: SelectedEdition[], searchKeyword: string): SelectedEdition[] {
    selectedEditions.sort((e1, e2) => e2.year - e1.year)

    return selectedEditions.filter(e =>
      e.year.toString().toLowerCase().includes(searchKeyword.toLowerCase())
      || e.winnerLastName.toLowerCase().includes(searchKeyword.toLowerCase())
      || e.winnerFirstName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

}
