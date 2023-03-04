
function genericLoadingDeco(props) {
    if (props.show || props.show == undefined) {
        return (
            <svg id={props.id} width="100%" height="164" viewBox="0 0 360 164" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={props.pathCN} d="M127 0L178.962 30V90L127 120L75.0385 90V30L127 0Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M127 20L178.962 50V110L127 140L75.0385 110V50L127 20Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M127 44L178.962 74V134L127 164L75.0385 134V74L127 44Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M234 0L285.962 30V90L234 120L182.038 90V30L234 0Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M234 20L285.962 50V110L234 140L182.038 110V50L234 20Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M234 44L285.962 74V134L234 164L182.038 134V74L234 44Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M341 0L392.962 30V90L341 120L289.038 90V30L341 0Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M341 20L392.962 50V110L341 140L289.038 110V50L341 20Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M341 44L392.962 74V134L341 164L289.038 134V74L341 44Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M20 0L71.9615 30V90L20 120L-31.9615 90V30L20 0Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M20 20L71.9615 50V110L20 140L-31.9615 110V50L20 20Z" fill={props.color} fillOpacity="0.2" />
                <path className={props.pathCN} d="M20 44L71.9615 74V134L20 164L-31.9615 134V74L20 44Z" fill={props.color} fillOpacity="0.2" />
            </svg>

        )
    }
}

export default genericLoadingDeco;