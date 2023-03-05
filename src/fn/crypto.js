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


export const getKeyPair = (len) => {
    const keyPairPromise = window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: len == undefined ? 4096 : len,
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


export const encryptMessage = async (key) => {
    let encoded = new TextEncoder().encode('MCRN Command has no idea how long that would actually take, so stand down')
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

    return decrypted;
}

