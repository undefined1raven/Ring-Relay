
function SignatureVerificationSuccessDeco(props) {
    return (
        <svg className={props.className} width="100%" height="100%" viewBox="0 0 50 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="17" fill={props.color ? props.color : '#00FFD1'} fillOpacity="0.2" />
            {/* <rect x="37.9038" y="8.5" width="6.5" height="6.5" transform="rotate(-45 37.9038 8.5)" stroke={props.color ? props.color : '#00FFD1'} strokeWidth="0.5" /> */}
        </svg>
    )
}

export default SignatureVerificationSuccessDeco;