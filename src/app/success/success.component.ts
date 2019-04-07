import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
// import { Subscription } from "rxjs";

@Component({
  templateUrl: "./success.component.html",
  selector: "app-success"
  //styleUrls: ["./success.component.css"]
})
export class SuccessComponent {
  // data: { message: string };
  // private errorSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
  // constructor(private errorService: ErrorService) {}

  // ngOnInit() {
  //   this.errorSub = this.errorService.getErrorListener().subscribe(message => {
  //     this.data = { message: message };
  //   });
  // }

  // onHandleError() {
  //   this.errorService.handleError();
  // }

  // ngOnDestroy() {
  //   this.errorSub.unsubscribe();
  // }
}
