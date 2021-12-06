public with sharing class CryptoPOC {

    @AuraEnabled
    public static String generateKey(String algorithm){
        Integer keySize = getKeySize(algorithm);
        Blob privateKey = Crypto.generateAesKey(keySize);
        return EncodingUtil.Base64Encode(privateKey);
    }

    @AuraEnabled
    public static String encryptApex(String valueToEncrypt, String key, String algorithm){
        Blob keyBlob = EncodingUtil.base64Decode(key);
        Blob data = Blob.valueOf(valueToEncrypt);
        Blob encryptedUserId = Crypto.encryptWithManagedIV(algorithm, keyBlob, data);
        return EncodingUtil.base64encode(encryptedUserId);
    }

    @AuraEnabled
    public static String decryptApex(String valueToDecrypt, String key, String algorithm){
        Blob keyBlob = EncodingUtil.base64Decode(key);
        Blob decrypted = Crypto.decryptWithManagedIV(algorithm, keyBlob, EncodingUtil.base64Decode(valueToDecrypt));
        return decrypted.toString();
    }

    private static Integer getKeySize(String algorithm){
        Integer keySize;
        switch on algorithm {
            when 'AES128' {		
                keySize = 128;
            }	
            when 'AES192' {		
                keySize = 192;
            }
            when 'AES256' {		
                keySize = 256;
            }
        }

        return keySize;
    }
}
