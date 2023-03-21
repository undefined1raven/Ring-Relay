
import Barcode from 'react-barcode';
import Label from '../components/Label.js'

function Signature(props) {

    const statusLabelsController = () => {
        if (props.valid) {
            if (props.verified) {
                return 'Verified'
            } else {
                return 'SIG Failed'
            }
        } else {
            return 'Invalid SIG'
        }
    }


    const colorHash = { 'Verified': '#00FF85', 'SIG Failed': '#FF002E', 'Invalid SIG': '#FF002E' }

    return (
        <div style={{ top: props.top, backgroundColor: `${colorHash[statusLabelsController()]}10` }} className='signature'>
            <Label color="#FFF" fontSize="1.9vh" text={props.sigLabel} className="sigIDLabel"></Label>
            <Label color={colorHash[statusLabelsController()]} bkg={`${colorHash[statusLabelsController()]}30`} fontSize="1.8vh" text={statusLabelsController()} className="sigStatusLabel"></Label>
            <Label color={colorHash[statusLabelsController()]} bkg={`${colorHash[statusLabelsController()]}30`} fontSize="1.8vh" text={props.valid ? props.sig : 'UNKNOWN'} className="sigActualLabel"></Label>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize={0} width={1} height="30%" marginTop="18%" text="" lineColor={`${colorHash[statusLabelsController()]}DD`} background='#29005C00' value={props.valid ? props.sig : '-UNKNOWN-'}></Barcode>
            </div>
        </div>)
}

export default Signature;