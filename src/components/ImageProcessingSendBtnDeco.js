import { useEffect, useState } from "react";



function ImageProcessingSendBtnDeco(props) {

    const [random, setRandom] = useState(Math.random());

    useEffect(() => {
        let int = setInterval(() => {
            setRandom(Math.random());
        }, 150);
        return () => { clearInterval(int) }
    }, [])


    const getColor = () => {
        let ran = Math.random()
        if (ran < .5) {
            return '#4C2FFF';
        } else {
            return '#4800A3';
        }
    }


    return <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path style={{transition: 'all linear 0.1s'}} d="M18.4604 0.0263725C22.5655 0.252 26.4602 1.91576 29.4612 4.72586C32.4623 7.53595 34.3782 11.313 34.8729 15.3944L32.5421 15.6769C32.1138 12.143 30.455 8.87272 27.8565 6.43963C25.2581 4.00654 21.8859 2.56598 18.3315 2.37063L18.4604 0.0263725Z" fill={getColor()} />
        <path style={{transition: 'all linear 0.1s'}} d="M34.998 17.7658C34.9317 22.1275 33.2388 26.3073 30.2511 29.4858C27.2634 32.6643 23.1963 34.6123 18.8469 34.9481L18.6643 32.5826C22.424 32.2923 25.9397 30.6084 28.5224 27.8608C31.1051 25.1133 32.5684 21.5002 32.6257 17.7297L34.998 17.7658Z" fill={getColor()} />
        <path style={{transition: 'all linear 0.1s'}} d="M16.1231 34.9457C11.7858 34.6034 7.73161 32.6577 4.75117 29.4882C1.77074 26.3187 0.0778263 22.1526 0.00261505 17.8025L2.47298 17.7598C2.53757 21.4957 3.99147 25.0736 6.55111 27.7957C9.11075 30.5177 12.5926 32.1887 16.3175 32.4827L16.1231 34.9457Z" fill={getColor()} />
        <path style={{transition: 'all linear 0.1s'}} d="M0.144303 15.2573C0.660714 11.2609 2.54045 7.56525 5.46607 4.79431C8.39169 2.02337 12.1839 0.346956 16.2024 0.0481729L16.3856 2.5121C12.9345 2.7687 9.67765 4.20843 7.16508 6.58816C4.65251 8.96789 3.03816 12.1418 2.59466 15.5739L0.144303 15.2573Z" fill={getColor()} />
    </svg>
}

export default ImageProcessingSendBtnDeco;