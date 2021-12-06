import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadScript } from "lightning/platformResourceLoader";
import Id from "@salesforce/user/Id";
import encryptApex from "@salesforce/apex/CryptoPOC.encryptApex";
import decryptApex from "@salesforce/apex/CryptoPOC.decryptApex";
import CryptoJS from "@salesforce/resourceUrl/CryptoJS";
//import AES from "@salesforce/resourceUrl/AES";
//import SHA256 from "@salesforce/resourceUrl/SHA256";
//import sjcl from "@salesforce/resourceUrl/sjcl";
import EMPLOYEE_NUMBER_FIELD from "@salesforce/schema/User.EmployeeNumber";
import { getRecord } from "lightning/uiRecordApi";

export default class CryptoPOC extends LightningElement {
  inputApex = Id;
  inputJS = Id;
  outputApex;
  outputJS;
  selectedValueApex = "encryptApex";
  selectedValueJS = "encryptJS";
  employeeNumberApex;
  employeeNumberJS;
  scjl;

  @wire(getRecord, {
    recordId: Id,
    fields: [EMPLOYEE_NUMBER_FIELD]
  })
  wireuser(result) {
    if (result.data) {
      this.employeeNumberApex = result.data.fields.EmployeeNumber.value;
      this.employeeNumberJS = result.data.fields.EmployeeNumber.value;
    }
  }

  inputApexChange(event) {
    this.inputApex = event.target.value;
  }

  inputJSChange(event) {
    this.inputJS = event.target.value;
  }

  get optionsEncryptionApex() {
    return [
      { label: "Encrypt", value: "encryptApex" },
      { label: "Decrypt", value: "decryptApex" }
    ];
  }

  get optionsEncryptionJS() {
    return [
      { label: "Encrypt", value: "encryptJS" },
      { label: "Decrypt", value: "decryptJS" }
    ];
  }

  get labelApexButton() {
    if (this.selectedValueApex === "encryptApex") {
      return "Encrypt";
    }
    return "Decrypt";
  }

  get labelJSButton() {
    if (this.selectedValueJS === "encryptJS") {
      return "Encrypt";
    }
    return "Decrypt";
  }

  handleClickApexButton() {
    if (this.selectedValueApex === "encryptApex") {
      encryptApex({
        valueToEncrypt: this.inputApex,
        employeeNumber: this.employeeNumberApex
      }).then((result) => {
        this.outputApex = result;
      });
    } else {
      decryptApex({
        valueToDecrypt: this.inputApex,
        employeeNumber: this.employeeNumberApex
      }).then((result) => {
        this.outputApex = result;
      });
    }
  }

  handleClickJSButton() {
    if (this.selectedValueJS === "encryptJS") {
      console.log(
        "handleClickJSButton",
        this.encryptCryptJS(this.inputJS, this.employeeNumberJS)
      );
    } else {
      this.decryptCryptoJS();
    }
  }

  handleApexGroupChange(event) {
    this.selectedValueApex = event.detail.value;
  }

  handleJSGroupChange(event) {
    this.selectedValueJS = event.detail.value;
  }

  //Crypto JS Library
  cryptoJSInitialized = false;

  connectedCallback() {
    if (this.cryptoJSInitialized) {
      console.log('this.cryptoJSInitialized',this.cryptoJSInitialized);
      return;
    }
    console.log('this.cryptoJSInitialized',this.cryptoJSInitialized);
    this.cryptoJSInitialized = true;


    Promise.all([
      loadScript(this, sjcl + '/sjcl.js')
    ])
      .then(() => {
        this.sjcl = sjcl;
        console.log("Scripts Loaded Successfully");
      })
      .catch((error) => {
        console.log("Error Loading Scripts", error);
      });
  }

  encryptCryptJS(valueToEncrypt, employeeNumber) {
    console.log("encryptCryptJS", valueToEncrypt, employeeNumber);
    try{
      console.log(this.sjcl.encrypt("password", "data"));
    }catch(error){
      console.log(error);
    }
  }

  decryptCryptoJS(valueToDecrypt, employeeNumber) {
    console.log("encryptCryptJS", valueToDecrypt, employeeNumber);
  }
}
