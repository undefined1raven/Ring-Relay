

function ColorPreview(props) {
    return (
        <svg width="10vh" height="5.5vh" style={{position: 'absolute', ...props.style}} viewBox="0 0 67 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 0.866026C17.4282 0.330127 18.5718 0.330127 19.5 0.866025L32.0885 8.13397C33.0167 8.66987 33.5885 9.66025 33.5885 10.7321V25.2679C33.5885 26.3397 33.0167 27.3301 32.0885 27.866L19.5 35.134C18.5718 35.6699 17.4282 35.6699 16.5 35.134L3.91154 27.866C2.98334 27.3301 2.41154 26.3397 2.41154 25.2679V10.7321C2.41154 9.66025 2.98334 8.66987 3.91154 8.13397L16.5 0.866026Z" fill={props.color} />
            <rect x="30" y="9" width="37" height="18" rx="3" fill={props.color} />
        </svg>

    )
}

export default ColorPreview;