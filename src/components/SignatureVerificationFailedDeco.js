
function SignatureVerificationFailedDeco(props) {
    return (
        <svg className={props.className} width="100%" height="100%" viewBox="0 0 50 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="17" fill="#FF002E" fill-opacity="0.2" />
            <rect x="39.25" y="5.25" width="6.5" height="6.5" stroke="#FF002E" stroke-width="0.5" />
            <rect x="39" y="5.35355" width="0.5" height="9.39992" transform="rotate(-45 39 5.35355)" fill="#FF002E" />
            <rect x="45.647" y="5" width="0.5" height="9.39992" transform="rotate(45 45.647 5)" fill="#FF002E" />
        </svg>
    )
}

export default SignatureVerificationFailedDeco;