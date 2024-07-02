import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required, Validators.minLength(4)]),
    price: new FormControl('',[Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('',[Validators.required, Validators.min(0)]),

  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  //-----> Tomar/Seleccionar una imagen <----
   async takeImage() {
     const dataUrl = (await this.utilsSvc.takePicture((' Imagen del producto'))).dataUrl
     this.form.controls.image.setValue(dataUrl)
   }

 async submit(){
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.singUp(this.form.value as User).then( async res => {

       await this.firebaseSvc.updateUser(this.form.value.name)

       let uid = res.user.uid;

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





}
