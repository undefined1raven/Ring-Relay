

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function btoaTobuf(base64) {
    let binStr = atob(base64)//base64 to binary string
    let bytes = new Uint8Array(binStr.length);
    for (let ix = 0; ix < binStr.length; ix++) {
        bytes[ix] = binStr.charCodeAt(ix);
    }
    return bytes.buffer;
}

const decryptMessage = async (key, ciphertext, cipherEncoding, returnBuffer) => {
    try {
        let cipherActual;
        if (cipherEncoding == 'base64') {
            cipherActual = btoaTobuf(ciphertext);
        }
        if (cipherEncoding == 'buffer') {
            cipherActual = ciphertext;
        }
        let decrypted = await crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            cipherActual
        );
        if (returnBuffer) {
            return decrypted;
        } else {
            return new TextDecoder().decode(decrypted);
        }

    } catch (e) { console.log(e) }
}

const verify = async (publicSigningKey, encryptedMessage, signature) => {
    let sigCheck = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-512' }, publicSigningKey, btoaTobuf(signature), str2ab(encryptedMessage))
    return sigCheck;
}

var jobContext = {};

self.onmessage = (e) => {
    if (e.data.eid == 'onDecryptStart') {
        if (e.data.rawMsg != undefined) {
            jobContext = e.data;
            self.postMessage(jobContext)
            try {
                let decryptionPromiseArray = [];
                if (jobContext.rawMsg.type == 'rx') {
                    verify(jobContext.pubSigningKey, jobContext.rawMsg.remoteContent, jobContext.rawMsg.signature).then(async (sigStatus) => {
                        jobContext.encryptedRemoteImagaDataChunks.split('<X>').forEach(encryptedChunk => {
                            if (encryptedChunk.length > 0) {
                                decryptionPromiseArray.push(decryptMessage(jobContext.privateKey, encryptedChunk, 'base64'));
                            }
                        });
                        Promise.all(decryptionPromiseArray).then(decryptedImageChunks => {
                            self.postMessage({ status: 'Success', msg: { ...jobContext.rawMsg, content: decryptedImageChunks.join(''), contentType: 'image', signed: (sigStatus) ? 'self' : 'no_self' } })
                        })
                    })
                }
                if (jobContext.rawMsg.type == 'tx') {
                    verify(jobContext.ownPUBSK, jobContext.rawMsg.remoteContent, jobContext.rawMsg.signature).then(async (ownSigStatus) => {
                        jobContext.encryptedOwnImagaDataChunks.split('<X>').forEach(encryptedChunk => {
                            if (encryptedChunk.length > 0) {
                                decryptionPromiseArray.push(decryptMessage(jobContext.privateKey, encryptedChunk, 'base64'));
                            }
                        })
                        Promise.all(decryptionPromiseArray).then(decryptedImageChunks => {
                            self.postMessage({ status: 'Success', msg: { ...jobContext.rawMsg, content: decryptedImageChunks.join(''), contentType: 'image', signed: (ownSigStatus) ? 'self' : 'no_self' } })
                        })
                    });
                }
            } catch (e) {
                self.postMessage({ error: e, status: 'Failed' });
            }
        }
    }
}
