import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { FpBuilderCreateComponent } from '../fp-builder/fp-builder-create/fp-builder-create.component';
import { FpBuilderEditComponent} from "../fp-builder/fp-builder-edit/fp-builder-edit.component";
import { FloorplansService } from '../fp-builder/floorplan.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Floorplan } from '../fp-builder/floorplan.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-floorplans',
  templateUrl: './floorplans.component.html',
  styleUrls: ['./floorplans.component.css']
})
export class FloorplansComponent implements OnInit {

  floorplanList: Floorplan[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private floorplansSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public dialog: MatDialog,
    public floorplansService: FloorplansService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.floorplansService.getFloorplans();
    this.userId = this.authService.getUserId();
    this.floorplansSub = this.floorplansService
      .getFloorplanUpdateListener()
      .subscribe(
        (floorplanData: {
          floorplans: Floorplan[];
        }) => {
          this.isLoading = false;
          this.floorplanList = floorplanData.floorplans;
        }
      );
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
  }

  openCreateFloorplan(): void {
    const dialogRef = this.dialog.open(FpBuilderCreateComponent, {
      width: "80vw"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  openEditFloorplan(id: string) {
    this.floorplansService.setFloorplanToEdit(id);
    const dialogRef = this.dialog.open(FpBuilderEditComponent, {
      width: "80vw"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  deleteFloorplan(id: string) {
    // Currently prompts user for name. **TODO
    console.log("Deleting Floorplan with ID: " + id);
    this.floorplansService.deleteFloorplans(id)
      .subscribe(() => {
        console.log("Deleted!");
      });
  }
}
