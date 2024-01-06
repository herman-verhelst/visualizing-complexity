import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {SelectedEdition} from "../../models/selected-edition";
import {AppService} from "../../app.service";
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SearchPipe} from "../../pipes/search.pipe";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    SearchPipe
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Input({required: true}) selectedEditions: SelectedEdition[] = [];
  searchVisible: boolean = false;
  searchClosing: boolean = false;
  searchFocus: boolean = false;

  searchKeyword: string = '';

  constructor(private appService: AppService, private element: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: any) {
    if (!this.element.nativeElement.contains(event.target)) {
      this.searchClosing = true;
      setTimeout(() => {
        this.searchVisible = false;
        this.searchClosing = false;
      }, 200)
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    if (!this.searchFocus) {
      this.searchKeyword = ''
      this.searchClosing = true;
      setTimeout(() => {
        this.searchVisible = false;
        this.searchClosing = false;
      }, 200)
    }
  }

  changeSelected(edition: SelectedEdition) {
    this.appService.updateSelectedEdition(edition);
  }

  onSearchFocus() {
    this.searchVisible = true;
    this.searchFocus = !this.searchFocus;
  }

  onSearchFocusOut() {
    this.searchFocus = !this.searchFocus;
  }
}
