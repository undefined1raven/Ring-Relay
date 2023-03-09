import QRCode from 'qrcode'
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import Label from './Label';


const Test = (props) => {
    const [data, setData] = useState('No result');

    return (
        <>
            <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                style={{ width: '100%' }}
            />
            <Label text={data} id="results" color="#FFF"></Label>
        </>
    );
};

function Settings(props) {

    let splittedPK = `-----BEGIN PRIVATE KEY-----
    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
    -----END PRIVATE KEY-----`;

    let splittedPKArr = splittedPK.split('|');

    QRCode.toCanvas(document.getElementById('pkShare'), splittedPKArr[0], { color: { dark: '#B479FF', light: '#090003' } }, (res) => { console.log(res) })
    QRCode.toCanvas(document.getElementById('pkShare1'), splittedPKArr[0], { color: { dark: '#B479FF', light: '#090003' } }, (res) => { console.log(res) })
    QRCode.toCanvas(document.getElementById('pkShare2'), splittedPKArr[0], { color: { dark: '#B479FF', light: '#090003' } }, (res) => { console.log(res) })

    return (
        <div>
            {/* <canvas id="pkShare"></canvas> */}
            {/* {/* <canvas style={{top: '0%'}} id="pkShare1"></canvas> */}
            <canvas style={{ top: '10%' }} id="pkShare2"></canvas>
            <Test></Test>
        </div>
    )
}

export default Settings;