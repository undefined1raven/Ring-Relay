

function MsgTypeImgDeco(props) {
    return (
        <svg onClick={props.onClick} width="5.167vw" height="5.167vw" style={{ position: 'absolute', left: props.left, ...props.style }} viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.73371" cy="4.73371" r="3.5" transform="rotate(-61.9904 7.73371 4.73371)" fill="white" />
            <path d="M9.37737 1.64367C8.97158 1.42782 8.52725 1.29401 8.06975 1.24988C7.61225 1.20575 7.15053 1.25216 6.71097 1.38647C6.2714 1.52078 5.86259 1.74035 5.50789 2.03265C5.15318 2.32495 4.85952 2.68425 4.64367 3.09004C4.42782 3.49583 4.29401 3.94016 4.24988 4.39767C4.20575 4.85517 4.25216 5.31689 4.38647 5.75645C4.52078 6.19602 4.74035 6.60482 5.03265 6.95953C5.32495 7.31424 5.68425 7.6079 6.09004 7.82375L7.73371 4.73371L9.37737 1.64367Z" fill="#120029" />
            <rect y="11" width="3" height="3" fill="#FF0000" />
            <rect x="6" y="11" width="3" height="3" fill="#33FF00" />
            <rect x="12" y="11" width="3" height="3" fill="#2400FF" />
        </svg>
    )
}

export default MsgTypeImgDeco;