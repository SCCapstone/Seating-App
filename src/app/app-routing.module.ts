import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { MainComponent } from "./main/main.component";

const routes: Routes = [
  { path: "", loadChildren: "./auth/auth.module#AuthModule" },
  {
    path: "main",
    component: MainComponent,
    loadChildren: "./main/main.module#MainModule"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
