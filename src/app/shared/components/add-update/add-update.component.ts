import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent  implements OnInit {

  @Input() product: Product

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl( null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl( null, [Validators.required, Validators.min(0)]),

  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if(this.product) this.form.setValue(this.product)
  }

  //-----> Tomar/Seleccionar una imagen <----
   async takeImage() {
     const dataUrl = (await this.utilsSvc.takePicture((' Imagen del producto'))).dataUrl
     this.form.controls.image.setValue(dataUrl)
   }


   submit() {

    if (this.form.valid){
      if(this.product) this.updateProduct();
      else this.createProduct()
    }

   }
// -----> Crear Producto <------------
 async createProduct(){


      let path = `user/${this.user.uid}/products`

      const loading = await this.utilsSvc.loading();
      await loading.present();


      //--->Subir la imagen y obtener la url <------

      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imgeUrl = await this.firebaseSvc.upLoadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imgeUrl);

      delete this.form.value.id;



      this.firebaseSvc.addDocument(path, this.form.value).then( async res => {

        this.utilsSvc.dismissModal({ success: true })

        this.utilsSvc.presentToast({
          message: 'Producto creado exitosamente',
          duration: 1500,
          position:'middle',
          color: 'success',
          icon: 'checkmark-circle-outline'
        })

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          position:'middle',
          color: 'primary',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })

  }

  // ------> Actializar Producto <-------------

  async updateProduct(){


      let path = `user/${this.user.uid}/products/${this.product.id}`

      const loading = await this.utilsSvc.loading();
      await loading.present();


      //---> Si cambio la imagen subir la nnueva y obtener la URL <------

      if(this.form.value.image !== this.product.image){
        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
        let imgeUrl = await this.firebaseSvc.upLoadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imgeUrl);
      }


      delete this.form.value.id;



      this.firebaseSvc.updateDocument(path, this.form.value).then( async res => {

        this.utilsSvc.dismissModal({ success: true })

        this.utilsSvc.presentToast({
          message: 'Producto actualizado exitosamente',
          duration: 1500,
          position:'middle',
          color: 'success',
          icon: 'checkmark-circle-outline'
        })

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          position:'middle',
          color: 'primary',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })

  }







}
