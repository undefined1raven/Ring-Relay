import VerticalLine from '../components/VerticalLine.js'


function InputField(props){
    return(
        <div id={props.id} className="inputFieldContainer">
            <VerticalLine color="#6100DC" top="0%" left="0%" height="100%"></VerticalLine>
            <input className='inputField' name={props.name} placeholder={props.placeholder} spellCheck={false} type={props.type}></input>
        </div>
    )
}

export default InputField;