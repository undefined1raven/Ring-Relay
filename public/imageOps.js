

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
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

const sign = async (privateKey, encryptedMessage) => {
    const signature = await crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-512" },
        },
        privateKey,
        new TextEncoder().encode(encryptedMessage)
    )

    return { base64: btoa(ab2str(signature)), buffer: signature };

}

const encryptMessage = async (key, plaintext) => {
    let encoded = new TextEncoder().encode(plaintext)
    let ciphertext = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        key,
        encoded
    );

    return { buffer: ciphertext, base64: btoa(ab2str(ciphertext)) };
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
            self.postMessage({ ...jobContext, eid: 'onDecryptionStarted' })
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
                            self.postMessage({ eid: 'onDecrypted', status: 'Success', msg: { ...jobContext.rawMsg, content: decryptedImageChunks.join(''), contentType: 'image', signed: (ownSigStatus) ? 'self' : 'no_self' } })
                        })
                    });
                }
            } catch (e) {
                self.postMessage({ eid: 'onDecrypted', error: e, status: 'Failed' });
            }
        }
    }
    if (e.data.eid == 'onEncryptStart') {
        jobContext = e.data;
        self.postMessage({ ...jobContext, eid: 'onEncryptionStarted' })
        try {
            if (e.data.base64encodedBuf != undefined) {
                let ownChunks = []
                let remoteChunks = []
                for (let ix = 0; ix <= jobContext.chunkCount; ix++) {
                    if (ix == 0) {
                        ownChunks.push(encryptMessage(jobContext.key, jobContext.base64encodedBuf.substring(0, 446)));
                        remoteChunks.push(encryptMessage(jobContext.remotePubkey, jobContext.base64encodedBuf.substring(0, 446)));
                    }
                    if (ix > 1 && ix < jobContext.chunkCount) {
                        ownChunks.push(encryptMessage(jobContext.key, jobContext.base64encodedBuf.substring((ix - 1) * 446, ix * 446)));
                        remoteChunks.push(encryptMessage(jobContext.remotePubkey, jobContext.base64encodedBuf.substring((ix - 1) * 446, ix * 446)));
                    }
                    if (ix == jobContext.chunkCount) {
                        let len = jobContext.base64encodedBuf.length;
                        let modRes = len % 446;
                        ownChunks.push(encryptMessage(jobContext.key, jobContext.base64encodedBuf.substring(len - modRes, len)));
                        remoteChunks.push(encryptMessage(jobContext.remotePubkey, jobContext.base64encodedBuf.substring(len - modRes, len)));
                    }
                }

                Promise.all(ownChunks).then(encryptedOwnChunks => {
                    Promise.all(remoteChunks).then(encryptedRemoteChunks => {
                        let base64EncodedOwnChunks = '';
                        let base64EncodedRemoteChunks = '';
                        for (let ix = 0; ix < encryptedOwnChunks.length; ix++) {
                            base64EncodedOwnChunks += encryptedOwnChunks[ix].base64;
                            base64EncodedOwnChunks += '<X>';
                            base64EncodedRemoteChunks += encryptedRemoteChunks[ix].base64;
                            base64EncodedRemoteChunks += '<X>';
                        }
                        sign(jobContext.signingPrivateKey, base64EncodedRemoteChunks).then(cipherSig => {
                            self.postMessage({ eid: 'onEncrypted', status: 'Success', payload: { localContent: jobContext.base64encodedBuf, ini: true, signature: cipherSig.base64, ownContent: base64EncodedOwnChunks, remoteContent: base64EncodedRemoteChunks } })
                        });
                    });
                })
            }
        } catch (e) {
            self.postMessage({ eid: 'onEncrypted', status: 'Failed', error: e })
        }
    }
}


