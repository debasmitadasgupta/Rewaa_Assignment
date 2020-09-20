import { Component } from '@angular/core';
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inventory Management';
  constructor(public router: Router) { 
  }


  logout():void{
    window.localStorage.removeItem('token');
    this.router.navigate(['login'])
  }
}
