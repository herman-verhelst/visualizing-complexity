import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {AppService} from "./app.service";
import {MountainComponent} from "./components/mountain/mountain.component";
import {Edition} from "./models/edition";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MountainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  editions: Edition[] = [];
  margins: { min: number, max: number } = {min: 0, max: 100};

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.appService.fetchData();

    this.appService.data$.subscribe((data) => {
      this.editions = data;
    });

    this.appService.getMinAndMaxMarginTime().subscribe(margins => {
      this.margins = margins
    })
  }
}
