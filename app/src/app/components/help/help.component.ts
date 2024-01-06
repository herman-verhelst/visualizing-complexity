import {Component, EventEmitter, HostListener, Input, OnChanges, Output} from '@angular/core';
import {MountainComponent} from "../mountain/mountain.component";
import {Edition} from "../../models/edition";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    MountainComponent,
    NgClass
  ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  @Input({required: true}) visible: boolean = false;
  @Input({required: true}) lastEdition?: Edition;

  @Output() closeModalEvent = new EventEmitter();

  margins: { min: number, max: number } = {min: 0, max: .2};
  closing: boolean = false;

  closeModal() {
    this.closing = true;
    setTimeout(() => {
      this.closeModalEvent.emit();
    }, 200)
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    this.closeModal();
  }
}
