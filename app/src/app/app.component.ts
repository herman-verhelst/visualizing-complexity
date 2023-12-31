import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {AppService} from "./app.service";
import {MountainComponent} from "./components/mountain/mountain.component";
import {Edition} from "./models/edition";
import {SortComponent} from "./components/sort/sort.component";
import {Sort} from "./models/sort";
import {SortPipe} from "./pipes/sort.pipe";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MountainComponent, SortComponent, SortPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  editions: Edition[] = [];
  margins: { min: number, max: number } = {min: 0, max: 100};
  sort?: Sort;

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.appService.fetchData();

    this.appService.data$.subscribe((data) => {
      this.editions = data;
    });

    this.appService.getMinAndMaxMarginTime().subscribe(margins => {
      this.margins = margins
    });

    this.appService.sort$.subscribe((sort) => {
      console.log(this.sort)
      this.sort = sort;
    });
  }
}
