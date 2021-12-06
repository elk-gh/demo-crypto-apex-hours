({
  encrypt: function (component) {
    try {
      var valueToEncrypt = component.get("v.input");
      var key = component.get("v.key");
      var algorithm = component.get("v.algorithm");
      var paddedKey = this.padKey(algorithm, key);
      var iv = CryptoJS.lib.WordArray.random(16);
      var aes_options = {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: iv
      };
      var encrypted = CryptoJS.AES.encrypt(
        valueToEncrypt,
        CryptoJS.enc.Base64.parse(paddedKey),
        aes_options);
      var encryptedBuffer = this.base64ToArrayBuffer(encrypted.toString());
      var ivBuffer = this.base64ToArrayBuffer((encrypted.iv.toString(CryptoJS.enc.Base64)));
      var finalBuffer = this.appendBuffer(ivBuffer, encryptedBuffer);
      component.set("v.output", this.arrayBufferToBase64(finalBuffer));
    } catch (error) {
      console.log(error);
    }
  },
  decrypt: function (component) {
    try {
      var valueToDecrypt = component.get("v.input");
      var key = component.get("v.key");
      var algorithm = component.get("v.algorithm");
      var paddedKey = this.padKey(algorithm, key);
      var arrayBuffer = this.base64ToArrayBuffer(valueToDecrypt);
      var iv = CryptoJS.enc.Base64.parse(this.arrayBufferToBase64(arrayBuffer.slice(0, 16)));
      var encryptedStr = this.arrayBufferToBase64(arrayBuffer.slice(16, arrayBuffer.byteLength));
      var aes_options = {
        iv: iv,
        mode: CryptoJS.mode.CBC
      };
      var decrypted = CryptoJS.AES.decrypt(
        encryptedStr,
        CryptoJS.enc.Base64.parse(paddedKey),
        aes_options
      );
      component.set("v.output", decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.log(error);
    }
  },
  padKey: function (algorithm, key) {
    var paddedKey;

    switch (algorithm) {
      case "AES128":
        paddedKey = key.padStart(16, "0");
        break;
      case "AES192":
        paddedKey = key.padStart(24, "0");
        break;
      default:
        paddedKey = key.padStart(32, "0");
    }

    return paddedKey;
  },
  base64ToArrayBuffer: function (base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  },
  appendBuffer: function (buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  },
  arrayBufferToBase64: function (arrayBuffer) {
    return btoa(
      new Uint8Array(arrayBuffer)
        .reduce(function (data, byte) {
          return data + String.fromCharCode(byte)
        },
          '')
    );
  },
});
