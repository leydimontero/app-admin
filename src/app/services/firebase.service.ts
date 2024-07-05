import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore'

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth'
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from '@firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore)
  storage = inject( AngularFireStorage)
  utilSvc = inject(UtilsService)

 //======================== AUTENTICACIÓN ===================



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

  //==========================> BASE DE DATOS  <=============================

// ------> Obtener documentos de la coleccion <-----------------
 getColletcionData(path: string, collectionQuery?: any) {
  const ref = collection(getFirestore(), path);
  return collectionData(query(ref, collectionQuery), { idField: 'id'})
 }


  // ----> setear un documaneto <-------
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

   // ----> Actualizar un documaneto <-------
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data)
  }

  //-----> Eliminar documento <----------
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path))
  }

  //---> Obtener un documento <---

 async  getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //----> Agregar un documento <------
  addDocument (path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }


  // ====================== ALMACENAMIENTO ===============
  //----> Subir Imagen <------

  async upLoadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }


  //------> Obtener ruta de la imagen con su URL <---------
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath
  }

  //-----> Eliminar Archivo <----------
  deteleFile(path: string) {
    return deleteObject(ref(getStorage(), path))
  }
}
