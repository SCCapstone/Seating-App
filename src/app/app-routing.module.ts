import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";
import { MainComponent } from "./main/main.component";
import { DashboardComponent } from "./main/dashboard/dashboard.component";
import { ReservationsComponent } from "./main/reservations/reservations.component";
import { ManagerComponent } from "./main/manager/manager.component";
import { AccountComponent } from "./main/account/account.component";

const routes: Routes = [
  { path: "posts", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  {
    path: "edit/:postId",
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  { path: "", loadChildren: "./auth/auth.module#AuthModule" },
  {
    path: "main",
    component: MainComponent,
    children: [
      {
        path: "",
        redirectTo: "main/dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "reservations",
        component: ReservationsComponent
      },
      {
        path: "manager",
        component: ManagerComponent
      },
      {
        path: "account",
        component: AccountComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
