
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { StudentHeaderComponent } from "./student-header/student-header.component";
import { NgModule } from "@angular/core";
import { WizardComponent } from "./wizard/wizard.component";
import { WizardStepComponent } from "./wizard/wizard-step.component";
import { SimpleNotificationsModule } from "angular2-notifications";
import { AdminHeaderComponent } from "./admin-header/admin-header.component";


export const COMPONENTS = [
  WizardComponent,
  WizardStepComponent,
  HeaderComponent,
  FooterComponent,
  StudentHeaderComponent,
  AdminHeaderComponent
];

@NgModule({
  imports: [
    CommonModule,
    SimpleNotificationsModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class ComponentsModule { }
