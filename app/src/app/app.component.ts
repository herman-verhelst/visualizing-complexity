import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MountainComponent, SortComponent, SortPipe, SearchComponent, SelectedEditionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  editions: Edition[] = [];
  margins: { min: number, max: number } = {min: 0, max: 100};
  sort?: Sort;
  selectedEditions: SelectedEdition[] = [];
  changeCount: number = 0;

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.appService.fetchData();

    this.appService.data$.subscribe((editions) => {
      this.editions = editions
      this.margins = this.appService.getMinAndMaxMarginTime();
    });
    //this.appService.getMinAndMaxMarginTime().subscribe(margins => this.margins = margins);
    this.appService.sort$.subscribe((sort) => this.sort = sort);
    this.appService.selectedEditions$.subscribe(editions => {
      this.changeCount++;
      this.selectedEditions = editions;
      //this.editions = [...this.editions];
      this.margins = this.appService.getMinAndMaxMarginTime();
    })
  }
}
