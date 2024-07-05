import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateComponent } from 'src/app/shared/components/add-update/add-update.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  user() {
    return this.utilsSvc.getFromLocalStorage('user')
  }
  ionViewWillEnter() {
    this.getProdcuts();
  }

  // ----> Obtener productos <-----

  getProdcuts(){
    let path = `user/${this.user().uid}/products`;

    this.loading = true

    let sub =  this.firebaseSvc.getColletcionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res

        this.loading = false;
        sub.unsubscribe();

      }
    })

  }

  //---> Agregar o actualoizar un producto <----

  async addUpdateProduct(product?: Product) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })

    if(success) this.getProdcuts();
  }
// ==================> Confirmar Eliminacion del producto <======================
  async confirmAlertProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este Producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',

        }, {
          text: 'si, eliminar',
          handler: () => {
           this.deleteProduct(product)
          }
        }
      ]
    });


  }
  //------> Eliminar Producto <----------
  async deleteProduct(product: Product){


    let path = `user/${this.user().uid}/products/${product.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deteleFile(imagePath)

    this.firebaseSvc.deleteDocument(path).then( async res => {

      this.products = this.products.filter(p => p.id !== product.id)

      this.utilsSvc.presentToast({
        message: 'Producto Eliminado exitosamente',
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
