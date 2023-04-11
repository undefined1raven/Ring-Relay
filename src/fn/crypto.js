/*This file contains all functions related to the E2E encryption
Note: considering the importance of these functions getting implemented the right way, I'll be using
the examples provided by MDN for the architecture I've chosen (based on the Crypto 101 book)
*/


function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}


function btoaTobuf(base64) {
    let binStr = window.atob(base64)//base64 to binary string
    let bytes = new Uint8Array(binStr.length);
    for (let ix = 0; ix < binStr.length; ix++) {
        bytes[ix] = binStr.charCodeAt(ix);
    }
    return bytes.buffer;
}

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}


export const getKeyPair = () => {
    const keyPairPromise = window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    )
    return keyPairPromise;
}

export const keyToPem = async (key) => {
    const exported = await window.crypto.subtle.exportKey('pkcs8', key);
    const exps = ab2str(exported);
    const easb64 = window.btoa(exps);
    return `-----BEGIN PRIVATE KEY-----\n${easb64}\n-----END PRIVATE KEY-----`;
}

export const getSigningKeyPair = async () => {
    const keyPairPromise = await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-521",
        },
        true,
        ["sign", "verify"]
    );
    return keyPairPromise;
}


export const pemToKey = ((pem, algo) => {
    try {
        // fetch the part of the PEM string between header and footer
        const pemHeader = "-----BEGIN PRIVATE KEY-----";
        const pemFooter = "-----END PRIVATE KEY-----";
        const pemContents = pem.substring(
            pemHeader.length,
            pem.length - pemFooter.length
        );
        // base64 decode the string to get the binary data
        const binaryDerString = window.atob(pemContents);
        // convert from a binary string to an ArrayBuffer
        const binaryDer = str2ab(binaryDerString);

        var importKeyArgs = 0;
        if (algo == undefined || algo == 'RSA') {
            importKeyArgs = { algo: { name: 'RSA-OAEP', hash: 'SHA-256' }, ops: ['decrypt'] };
        } else if (algo == 'ECDSA') {
            importKeyArgs = { algo: { name: 'ECDSA', namedCurve: 'P-521' }, ops: ['sign'] };
        }
        if (importKeyArgs != 0) {
            return window.crypto.subtle.importKey(
                "pkcs8",
                binaryDer,
                importKeyArgs.algo,
                true,
                importKeyArgs.ops
            );
        } else {
            return 'Valid algo arg not provided (RSA/ECDSA)'
        }
    } catch (e) { return e }
})

export const sign = async (privateKey, encryptedMessage) => {
    const signature = await window.crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-512" },
        },
        privateKey,
        new TextEncoder().encode(encryptedMessage)
    )

    return { base64: window.btoa(ab2str(signature)), buffer: signature };

}

export const JSONtoKey = ((jwk, algo) => {
    var importKeyArgs = 0;
    if (algo == undefined || algo == 'RSA') {
        importKeyArgs = { algo: { name: 'RSA-OAEP', hash: 'SHA-256' }, ops: ['encrypt'] };
    } else if (algo == 'ECDSA') {
        importKeyArgs = { algo: { name: 'ECDSA', namedCurve: 'P-521' }, ops: ['verify'] };
    }
    if (importKeyArgs != 0) {

        return window.crypto.subtle.importKey(
            "jwk",
            jwk,
            importKeyArgs.algo,
            true,
            importKeyArgs.ops
        );
    }
})

export const verify = async (publicSigningKey, encryptedMessage, signature) => {
    let sigCheck = await window.crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-512' }, publicSigningKey, btoaTobuf(signature), str2ab(encryptedMessage))
    return sigCheck;
}

export const encryptMessage = async (key, plaintext) => {
    let encoded = new TextEncoder().encode(plaintext)
    let ciphertext = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        key,
        encoded
    );

    return { buffer: ciphertext, base64: window.btoa(ab2str(ciphertext)) };
}


export const decryptMessage = async (key, ciphertext, cipherEncoding) => {
    try {

        let cipherActual;
        if (cipherEncoding == 'base64') {
            cipherActual = btoaTobuf(ciphertext);
        }
        if (cipherEncoding == 'buffer') {
            cipherActual = ciphertext;
        }
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            cipherActual
        );

        return new TextDecoder().decode(decrypted);

    } catch (e) { console.log(e) }
}

function getKeyMaterial(password) {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );
}


function getKey(keyMaterial, salt) {
    return window.crypto.subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: salt,
            "iterations": 100000,
            "hash": "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"]
    );
}



export const symmetricEncrypt = async (salt, iv, plain, password) => {
    let keyMaterial = await getKeyMaterial(password);
    let key = await getKey(keyMaterial, salt);
    let encoded = new TextEncoder().encode(plain);

    let ciphertext = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encoded
    );

    return { buffer: ciphertext, base64: window.btoa(ab2str(ciphertext)) };
}

export const symmetricDecrypt = async (password, salt, iv, ciphertext) => {

    let keyMaterial = await getKeyMaterial(password);
    let key = await getKey(keyMaterial, salt);

    try {
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        return 'error';
    }
}