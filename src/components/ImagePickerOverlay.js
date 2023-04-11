import Label from '../components/Label.js'


function ImagePickerOverlay(props) {
    return (
        <div style={{ display: `${props.show ? 'flex' : 'none'}` }} className="locPickerOverlayContainer">
            <div className='ImageOpStatus'>
                <Label id="imageOpTypeLabel" style={{ left: '8%', top: '20%' }} color="#FFF" fontSize="1.9vh" text={`[Compressing] | [${props.compressionProgress}%]`}></Label>
                <div id='ImageCompressIndiContainer'>
                    <div id="imageCompressionIndiActual" style={{ left: `-${100 - parseInt(props.compressionProgress)}%` }}></div>
                </div>
            </div>
            {props.selectedImageBase64.ini ? <img style={{ position: 'absolute', top: '0%' }} width="100%" src={props.selectedImageBase64.data}></img> : ''}
        </div>
    )
}

export default ImagePickerOverlay;