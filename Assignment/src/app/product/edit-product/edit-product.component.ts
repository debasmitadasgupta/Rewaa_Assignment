import { Component, OnInit , Inject} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {Product} from "../../model/product.model";
import {ApiService} from "../../service/api.service";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product: Product;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    let productId = window.localStorage.getItem("editProductId");
    if(!productId) {
      alert("Invalid action.")
      this.router.navigate(['list-product']);
      return;
    }
    this.editForm = this.formBuilder.group({
      product_id: [''],
      product_name: ['', Validators.required],
      product_price: ['', Validators.required],
      product_quantity: ['', Validators.required]
    });
    this.apiService.getProductById(+productId)
      .subscribe( data => {
        this.editForm.setValue(data.result[0]);
      });
  }

  onSubmit() {
    this.apiService.updateProduct(this.editForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if(data.status === 200) {
            alert('Product updated successfully.');
            this.router.navigate(['list-product']);
          }else {
            alert(data.message);
          }
        },
        error => {
          alert(error);
        });
  }

}
