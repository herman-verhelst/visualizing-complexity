import {Pipe, PipeTransform} from '@angular/core';
import {Edition} from "../models/edition";
import {Sort} from "../models/sort";
import SortOption from "../models/sort-option";
import {SortDirection} from "../models/sort-direction";

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(editions: Edition[], sort?: Sort): Edition[] {
    if (!sort) return editions;

    // Year
    if (sort.option === SortOption.YEAR && sort.direction === SortDirection.DESCENDING) return editions.sort((e1, e2) => e2.year - e1.year)
    else if (sort.option === SortOption.YEAR) return editions.sort((e1, e2) => e1.year - e2.year)

    // Margin
    else if (sort.option === SortOption.MARGIN && sort.direction === SortDirection.DESCENDING) return editions.sort((e1, e2) => e2.marginNumber - e1.marginNumber)
    else if (sort.option === SortOption.MARGIN) return editions.sort((e1, e2) => e1.marginNumber - e2.marginNumber)

    // Stages won
    else if (sort.option === SortOption.STAGES_WON && sort.direction === SortDirection.DESCENDING) return editions.sort((e1, e2) => (e2.stageWins / e2.totalStages) - (e1.stageWins / e1.totalStages))
    else if (sort.option === SortOption.STAGES_WON) return editions.sort((e1, e2) => (e1.stageWins / e1.totalStages) - (e2.stageWins / e2.totalStages))

    // Stages led
    else if (sort.option === SortOption.LEADERS_JERSEY && sort.direction === SortDirection.DESCENDING) return editions.sort((e1, e2) => (e2.stagesLed / e2.totalStages) - (e1.stagesLed / e1.totalStages))
    else if (sort.option === SortOption.LEADERS_JERSEY) return editions.sort((e1, e2) => (e1.stagesLed / e1.totalStages) - (e2.stagesLed / e2.totalStages))


    return editions
  }
}
