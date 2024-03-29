function BackDeco(props) {
    return (
        <svg width="40%" height="80%" style={{...props.style}} viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="7.39175" width="1" height="10.446" transform="rotate(-45 0 7.39175)" fill={props.color} />
            <rect x="7.38635" width="1" height="10" transform="rotate(45 7.38635 0)" fill={props.color} />
        </svg>
    )

}

export default BackDeco;