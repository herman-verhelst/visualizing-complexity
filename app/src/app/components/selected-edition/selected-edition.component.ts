import {Component, Input} from '@angular/core';
import {SelectedEdition} from "../../models/selected-edition";
import {AppService} from "../../app.service";

@Component({
  selector: 'app-selected-edition',
  standalone: true,
  imports: [],
  templateUrl: './selected-edition.component.html',
  styleUrl: './selected-edition.component.scss'
})
export class SelectedEditionComponent {

  @Input({required: true}) selectedEdition?: SelectedEdition;

  constructor(private appService: AppService) {
  }

  removeEdition() {
    if (this.selectedEdition) this.appService.updateSelectedEdition(this.selectedEdition);
  }
}
