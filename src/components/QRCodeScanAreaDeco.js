

function QRCodeScanAreaDeco(props) {
    return <svg id={props.id} width="40vh" height="25vh" style={props.style} viewBox="0 0 200 183" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 182.216C2.51471 182.216 0.5 180.201 0.5 177.716V134.537H0V48.179H0.5V5.00001C0.5 2.51473 2.51472 0.5 5 0.5H52.5V0H147.5V0.5H195C197.485 0.5 199.5 2.51472 199.5 5V48.179H200V134.537H199.5V177.716C199.5 180.201 197.485 182.216 195 182.216H147.5V182.716H52.5V182.216H5Z" stroke="#001AFF" stroke-dasharray="150 150" />
    </svg>
}

export default QRCodeScanAreaDeco;