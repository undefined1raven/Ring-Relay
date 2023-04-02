
import Barcode from 'react-barcode';
import Label from '../components/Label.js'
import BackDeco from '../components/BackDeco.js'

function Signature(props) {

    const statusLabelsController = () => {
        if (props.valid) {
            if (props.verified == 'self') {
                return 'Self'
            }
            if (props.verified == true) {
                return 'Verified'
            } else {
                return 'SIG Failed'
            }
        } else {
            return 'Invalid SIG'
        }
    }


    const colorHash = { 'Verified': '#00FF85', 'SIG Failed': '#FF002E', 'Invalid SIG': '#FF002E', 'Self': '#9644FF' }

    const sigLabelController = () => {
        if(props.valid){
            if(props.sig2){
                return props.sig2;
            }else{
                return props.sig;
            }
        }else{
            return '-UNKN';
        }
    }

    return (
        <div style={{ top: props.top, backgroundColor: `${colorHash[statusLabelsController()]}10` }} className='signature'>
            <Label color="#FFF" fontSize="1.9vh" text={props.sigLabel} className="sigIDLabel"></Label>
            <Label color={colorHash[statusLabelsController()]} bkg={`${colorHash[statusLabelsController()]}30`} fontSize="1.8vh" text={props.doubleSig ? props.sig : statusLabelsController()} style={{left: '2%'}} className="sigStatusLabel"></Label>
            <Label color={colorHash[statusLabelsController()]} bkg={`${colorHash[statusLabelsController()]}30`} fontSize="1.8vh" text={sigLabelController()} style={{left: `${props.doubleSig ? "30%" : "28%"}`}} className="sigActualLabel"></Label>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize={0} width={1} height={props.height ? props.height : "30%"} marginBottom={props.doubleSig ? "30%" : "0%"} marginTop={props.doubleSig ? "0%" : "18%"} text="" lineColor={`${colorHash[statusLabelsController()]}DD`} background='#29005C00' value={props.valid ? props.sig : '-UNKNOWN-'}></Barcode>
            </div>
            {props.doubleSig ? 
            <>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize={0} width={1} height={props.height ? props.height : "30%"} marginBottom={props.doubleSig ? "30%" : "0%"} marginTop={props.doubleSig ? "70%" : "18%"} text="" lineColor={`${colorHash[statusLabelsController()]}DD`} background='#29005C00' value={props.valid ? props.sig2 : '-UNKNOWN-'}></Barcode>
            </div>
            <BackDeco style={{ position: 'absolute', top: '41%', left: '59%', height: "25%", transform: 'rotate(-90deg)' }} color="#9644FF"></BackDeco>
            <BackDeco style={{ position: 'absolute', top: '57%', left: '8%', height: "25%", transform: 'rotate(180deg)' }} color="#9644FF"></BackDeco>
            </> : ''}
        </div>)
}

export default Signature;