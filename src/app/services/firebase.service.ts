import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection } from '@angular/fire/firestore'

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth'
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore)
  utilSvc = inject(UtilsService)

 //-----> Autentificacion <--------

 getAuth() {
  return getAuth();
 }

 //----> Acceder <-----
 singIn(user: User) {
    console.log(user);
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)

 }

 // ---> crear Usuario <-----
 singUp(user: User) {
  console.log(user);
  return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
}

  //---> Actualizar Usuario <---

  updateUser(displayName: string ){
    return updateProfile(getAuth().currentUser, { displayName })
  }


  //-----> Enviar un email para restablecer la contraseña<----
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email)
  }


  //---> Cerrar Sesión <----

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user')
    this.utilSvc.routerLink('/auth')

  }

  //----> Base de Datos <------

  // ----> setear un documaneto <-------
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  //---> Obtener un documento <---

 async  getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //----> Agregar un documento <------
  addDocument (path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }
}
