import { credential, ServiceAccount } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

import serviceAccount from "../../../firebaseadmin.json";

initializeApp({
  credential: credential.cert(<ServiceAccount>serviceAccount),
  storageBucket: "homesearch-3bd22.appspot.com",
});

// const storage = getStorage().bucket();
// storage
//   .upload("../../../_MG_4527.jpg", { destination: "newDest/image.jpg" })
//   .then((uploadRes) => console.log("uploadRes"));

// storage
//   .file("newDest/image.jpg")
//   .download({ destination: "./here.jpg" })
//   .then((v) => console.log("downloaded"));
export default getStorage().bucket();
