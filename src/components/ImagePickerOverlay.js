import Label from '../components/Label.js'
import ImageEncryptionDeco from '../components/ImageEncryptionDeco.js';

function ImagePickerOverlay(props) {

    const opStatusLabelController = () => {
        if (!props.selectedImage.done) {
            if (!props.selectedImage.isEncrypting) {
                return `[Compressing] | [${props.selectedImage.compressionProgress}%]`;
            } else {
                return `[Encrypting Chunks] | [${props.selectedImage.chunkCount}]`;
            }
        } else {
            return 'Done';
        }
    }

    return (
        <div style={{ display: `${props.show ? 'flex' : 'none'}` }} className="locPickerOverlayContainer">
            {!props.selectedImage.done ? <div style={{ zIndex: 10000 }} className='ImageOpStatus'>
                <Label id="imageOpTypeLabel" style={{ left: '8%', top: '20%' }} color="#FFF" fontSize="1.9vh" text={opStatusLabelController()}></Label>
                {!props.selectedImage.isEncrypting && !props.selectedImage.done ? <div id='ImageCompressIndiContainer'>
                    <div id="imageCompressionIndiActual" style={{ left: `-${100 - parseInt(props.selectedImage.compressionProgress)}%` }}></div>
                </div> : ''}
                {!props.selectedImage.done && props.selectedImage.isEncrypting ? <ImageEncryptionDeco style={{ left: '8.2%', top: '-4%' }}></ImageEncryptionDeco> : ''}
            </div> : ''}
            {props.selectedImageBase64.ini ? <img style={{ position: 'absolute', top: '0%' }} width="100%" src={props.selectedImageBase64.data}></img> : ''}
        </div >
    )
}

export default ImagePickerOverlay;