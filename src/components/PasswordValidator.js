import { useEffect, useState } from 'react';
import Label from './Label';
import HorizontalLine from '../components/HorizontalLine.js'


function PasswordValidator(props) {
    const [hasNumber, setHasNumber] = useState(false);
    const [hasUppercaseLetter, setHasUppercaseLetter] = useState(false);
    const [hasLength, setHasLength] = useState(false);
    const [hasSymbol, setHasSymbol] = useState(false);

    useEffect(() => {
        if (props.password.length > 0) {
            setHasLength(props.password.length > 7)
            setHasNumber(props.password.match(/[0-9]/));
            setHasUppercaseLetter(props.password.match(/[A-Z]/));
            setHasSymbol(!props.password.match(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/));//&&final check
        } else {
            setHasNumber(false)
            setHasUppercaseLetter(false)
            setHasLength(false)
            setHasSymbol(false)
        }
    }, [props.password])

    return (
        <div>
            <Label style={{ top: props.top, left: '5.277777778%' }} fontSize="1.7vh" className="passwordValidatorLabel" color={hasNumber ? '#00FFD1' : '#616161'} child={<HorizontalLine style={{ position: 'absolute', top: '105%' }} width="100%" color={hasNumber ? '#00FFD1' : '#616161'}></HorizontalLine>} text="Number"></Label>
            <Label style={{ top: props.top, left: '29.166666667%' }} fontSize="1.7vh" className="passwordValidatorLabel" color={hasSymbol ? '#00FFD1' : '#616161'} child={<HorizontalLine style={{ top: '105%' }} width="100%" color={hasSymbol ? '#00FFD1' : '#616161'}></HorizontalLine>} text="Symbol"></Label>
            <Label style={{ top: props.top, left: '53.055555556%' }} fontSize="1.7vh" className="passwordValidatorLabel" color={hasUppercaseLetter ? '#00FFD1' : '#616161'} child={<HorizontalLine style={{ top: '105%' }} width="100%" color={hasUppercaseLetter ? '#00FFD1' : '#616161'}></HorizontalLine>} text="Uppercase"></Label>
            <Label style={{ top: props.top, left: '76.944444444%' }} fontSize="1.7vh" className="passwordValidatorLabel" color={hasLength ? '#00FFD1' : '#616161'} child={<HorizontalLine style={{ top: '105%' }} width="100%" color={hasLength ? '#00FFD1' : '#616161'}></HorizontalLine>} text="7 chars"></Label>
        </div>
    )
}

export default PasswordValidator;