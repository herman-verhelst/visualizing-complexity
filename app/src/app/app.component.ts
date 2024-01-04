import {Component, HostListener, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {AppService} from "./app.service";
import {MountainComponent} from "./components/mountain/mountain.component";
import {Edition} from "./models/edition";
import {SortComponent} from "./components/sort/sort.component";
import {Sort} from "./models/sort";
import {SortPipe} from "./pipes/sort.pipe";
import {SearchComponent} from "./components/search/search.component";
import {SelectedEdition} from "./models/selected-edition";
import {SelectedEditionComponent} from "./components/selected-edition/selected-edition.component";
import {HelpComponent} from "./components/help/help.component";
import {LoadingAnimationComponent} from "./components/loading-animation/loading-animation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MountainComponent, SortComponent, SortPipe, SearchComponent, SelectedEditionComponent, HelpComponent, LoadingAnimationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  editions: Edition[] = [];
  margins: { min: number, max: number } = {min: 0, max: 100};
  sort?: Sort;
  selectedEditions: SelectedEdition[] = [];
  changeCount: number = 0;
  helpOpen: boolean = false;

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.appService.fetchData();

    this.appService.data$.subscribe((editions) => {
      this.editions = editions
      this.margins = this.appService.getMinAndMaxMarginTime();
    });

    this.appService.sort$.subscribe((sort) => {
      this.changeCount++;
      this.sort = sort
    });
    this.appService.selectedEditions$.subscribe(editions => {
      this.changeCount++;
      this.selectedEditions = editions;
      this.margins = this.appService.getMinAndMaxMarginTime();
    })
  }


  @HostListener('document:keydown.h', ['$event'])
  onKeydownHandler() {
    this.openModal();
  }

  closeModal() {
    this.helpOpen = false;
  }

  openModal() {
    this.helpOpen = true;
  }
}
