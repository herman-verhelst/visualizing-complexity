import {Component} from '@angular/core';
import {NgClass} from "@angular/common";
import {SortDirection} from "../../models/sort-direction";
import SortOption from "../../models/sort-option";
import {AppService} from "../../app.service";

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss'
})
export class SortComponent {
  dropdownVisible: boolean = false;
  selectedOption: SortOption = SortOption.YEAR;
  selectedDirection: SortDirection = SortDirection.ASCENDING;

  protected readonly SortDirection = SortDirection;
  protected readonly SortOption = SortOption;

  constructor(private appService: AppService) {
  }

  changeSelectedOption(option: SortOption) {
    this.dropdownVisible = false;
    this.selectedOption = option;
    this.appService.updateSort({
      direction: this.selectedDirection,
      option: this.selectedOption,
    })
  }

  changeSelectedDirection(direction: SortDirection) {
    this.dropdownVisible = false;
    this.selectedDirection = direction;
    this.appService.updateSort({
      direction: this.selectedDirection,
      option: this.selectedOption,
    })
  }
}
