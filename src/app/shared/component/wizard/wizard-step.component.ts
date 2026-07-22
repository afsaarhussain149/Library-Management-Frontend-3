import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ls-wizard-step',
  standalone: false,
  template: `
    <div *ngIf="isVisible">
      <ng-content></ng-content>
    </div>
  `,
})
export class WizardStepComponent implements OnInit {
  @Input() title = '';
  @Input() isVisible = false;
  @Input() whenExit?: ((args: any) => boolean) | ((args: any) => Observable<boolean>);
  @Input() whenEnter?: ((args: any) => boolean) | ((args: any) => Observable<boolean>);
  @Output() stepLoaded = new EventEmitter<void>();
  @Input() isDisabled = false;

  ngOnInit() {}

  async whenExitStep(): Promise<boolean> {
    if (this.whenExit) {
      const result: any = this.whenExit({});
      return result instanceof Observable ? await result.toPromise() : result;
    }
    return true;
  }

  async whenEnterStep(): Promise<boolean> {
    if (this.whenEnter) {
      const result: any = this.whenEnter({});
      return result instanceof Observable ? await result.toPromise() : result;
    }
    return true;
  }
}
