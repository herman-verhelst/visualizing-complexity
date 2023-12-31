import {Component, ElementRef, HostListener} from '@angular/core';
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
  selectedDirection: SortDirection = SortDirection.DESCENDING;

  protected readonly SortDirection = SortDirection;
  protected readonly SortOption = SortOption;

  constructor(private appService: AppService, private element: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: any) {
    if (!this.element.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    this.dropdownVisible = false;
  }

  changeSelectedOption(option: SortOption) {
    this.selectedOption = option;
    this.appService.updateSort({
      direction: this.selectedDirection,
      option: this.selectedOption,
    })
  }

  changeSelectedDirection(direction: SortDirection) {
    this.selectedDirection = direction;
    this.appService.updateSort({
      direction: this.selectedDirection,
      option: this.selectedOption,
    })
  }
}
