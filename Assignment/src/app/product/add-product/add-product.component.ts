import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }

  addForm: FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      product_id: [],
      product_name: ['', Validators.required],
      product_price: ['', Validators.required],
      product_quantity: ['', Validators.required]
    });

  }

  onSubmit() {
    this.apiService.createProduct(this.addForm.value)
      .subscribe( data => {
        this.router.navigate(['list-product']);
      });
  }

}
