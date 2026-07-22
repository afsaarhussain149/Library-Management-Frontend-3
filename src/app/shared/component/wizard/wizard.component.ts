import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'ls-wizard',
  standalone: false,
  template: `
    <div class="max-w-5xl mx-auto mt-8 px-4">
      <!-- Header -->
      <!-- <h2 class="text-center text-xl font-semibold mb-6">Fougi Seat Booking</h2> -->
  <simple-notifications [options]="notificationOptions"></simple-notifications>

      <!-- Step Progress Bar -->
      <div class="flex justify-center items-center mb-10 relative">
        <ng-container *ngFor="let step of stepTitles; let i = index">
          <div class="flex items-center">
            <!-- Circle -->
            <div
              class="flex justify-center items-center w-10 h-10 rounded-full border-2 text-sm font-medium z-10"
              [ngClass]="{
                'bg-green-700 text-white border-green-700': i <= currentStepIndex,
                'bg-gray-300 text-gray-700 border-gray-300': i > currentStepIndex
              }"
            >
              {{ i + 1 }}
            </div>
            <!-- Connector -->
            <div
              *ngIf="i < stepTitles.length - 1"
              class="w-24 h-0.5"
              [ngClass]="{
                'bg-green-700': i < currentStepIndex,
                'bg-gray-300': i >= currentStepIndex
              }"
            ></div>
          </div>
        </ng-container>
      </div>

      <!-- Step Title -->
      <h3 class="text-center text-gray-800 text-lg font-medium uppercase mb-6">
        {{ stepTitles[currentStepIndex] }}
      </h3>

      <!-- Step Content -->
      <div class="bg-gray-50 p-6 rounded-xl shadow-sm">
        <ng-content></ng-content>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          *ngIf="showPreviousButton()"
          (click)="previous()"
          [disabled]="currentStepIndex === 0"
        >
          ← Back
        </button>

        <button
          class="px-6 py-2 bg-[#ffeb3b] border border-gray-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition"
          *ngIf="showNextButton()"
          (click)="handleNextClick()"
        >
          Save & Next →
        </button>

        <button
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          (click)="submit()"
          *ngIf="isLastEnabledStep()"
        >
          Submit
        </button>
      </div>
    </div>
  `,
})
export class WizardComponent implements AfterContentInit {
  @ContentChildren(WizardStepComponent) steps!: QueryList<WizardStepComponent>;
  @Output() stepChange = new EventEmitter<number>();
  @Input() initialStepIndex = 0;
  @Input() isVisblePreviousButtonIndex = 0;
  @Input() isPreviewbtn = true;
@Input() disableNext = false; // 🔹 new input fla
  currentStepIndex = 0;
  
  stepTitles: string[] = [];
notificationOptions: Options = {
    position: ['top', 'right'],   // 👈 always top-right of screen
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
  };
  constructor(protected notificationsService: NotificationsService,
) {}

  ngAfterContentInit() {
    this.stepTitles = this.steps.map((s) => s.title);
    this.currentStepIndex = this.initialStepIndex;
    this.showStep(this.currentStepIndex);
  }
handleNextClick() {
  console.log(this.disableNext);
  
  if (this.disableNext) {
this.notificationsService.warn('Warning','Please select a plan before save & next!');
    return;
  }
  this.next(); // only proceed when plan is selected
}

  async next() {
     
    if (await this.steps.toArray()[this.currentStepIndex].whenExitStep()) {
      let nextIndex = this.currentStepIndex + 1;
      while (nextIndex < this.steps.length && this.steps.toArray()[nextIndex].isDisabled) {
        nextIndex++;
      }
      if (nextIndex < this.steps.length) {
        this.currentStepIndex = nextIndex;
        this.showStep(this.currentStepIndex);
        this.stepChange.emit(this.currentStepIndex);
      }
    }
  }

  async previous() {
    while (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      if (!this.steps.toArray()[this.currentStepIndex].isDisabled) {
        this.showStep(this.currentStepIndex);
        this.stepChange.emit(this.currentStepIndex);
        return;
      }
    }
  }

  async submit() {
    if (await this.steps.toArray()[this.currentStepIndex].whenExitStep()) {
      this.stepChange.emit(this.currentStepIndex);
      alert('Form Submitted!');
    }
  }

  showStep(index: number) {
    this.steps.toArray().forEach(async (step, i) => {
      step.isVisible = i === index;
      if (step.isVisible) await step.whenEnterStep();
    });
  }

  showPreviousButton(): boolean {
    return this.currentStepIndex !== this.isVisblePreviousButtonIndex;
  }

  showNextButton(): boolean {
    return this.currentStepIndex < this.steps.length - 1 && !this.isLastEnabledStep();
  }

  isLastEnabledStep(): boolean {
    let lastEnabled = this.steps.length - 1;
    while (lastEnabled >= 0 && this.steps.toArray()[lastEnabled].isDisabled) lastEnabled--;
    return this.currentStepIndex === lastEnabled;
  }
}
