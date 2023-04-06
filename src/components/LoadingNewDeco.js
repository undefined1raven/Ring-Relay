
import { useEffect, useState } from 'react';


function LoadingNewDeco(props) {

    const [random, setRandom] = useState(Math.random());

    useEffect(() => {
        setInterval(() => {
            setRandom(Math.random());
        }, 500);
    }, [])


    const getColor = () => {
        let ran = Math.random();
        if (ran < .3) {
            return '#400090'
        } else if (ran >= .3 && ran < .7) {
            return '#7000FF'
        }
        else if (ran >= .7) {
            return '#9039FF'
        }
    }

    if (props.show) {
        return (
            <svg id={props.id} width={props.width} height={props.height} style={{ position: 'absolute',  top: props.top,  ...props.style }} viewBox="0 0 258 231" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M82.0795 60.4599L104.601 29.9839C104.931 29.5374 105.454 29.274 106.009 29.274H151.991C152.546 29.274 153.069 29.5374 153.399 29.9839L175.921 60.4599C176.377 61.078 176.377 61.9219 175.921 62.54L153.399 93.016C153.069 93.4625 152.546 93.7259 151.991 93.7259H106.009C105.454 93.7259 104.931 93.4625 104.601 93.016L82.0795 62.54C81.6227 61.9219 81.6227 61.078 82.0795 60.4599Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M82.0795 48.4591L104.601 17.9831C104.931 17.5367 105.454 17.2732 106.009 17.2732H151.991C152.546 17.2732 153.069 17.5367 153.399 17.9831L175.921 48.4591C176.377 49.0772 176.377 49.9211 175.921 50.5392L153.399 81.0152C153.069 81.4617 152.546 81.7251 151.991 81.7251H106.009C105.454 81.7251 104.931 81.4617 104.601 81.0152L82.0795 50.5392C81.6227 49.9211 81.6227 49.0772 82.0795 48.4591Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M82.0795 36.4599L104.601 5.98396C104.931 5.53748 105.454 5.27404 106.009 5.27404H151.991C152.546 5.27404 153.069 5.53748 153.399 5.98397L175.921 36.4599C176.377 37.0781 176.377 37.9219 175.921 38.5401L153.399 69.016C153.069 69.4625 152.546 69.7259 151.991 69.7259H106.009C105.454 69.7259 104.931 69.4625 104.601 69.016L82.0795 38.5401C81.6227 37.9219 81.6227 37.0781 82.0795 36.4599Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M82.0795 126.46L104.601 95.9839C104.931 95.5374 105.454 95.274 106.009 95.274H151.991C152.546 95.274 153.069 95.5374 153.399 95.9839L175.921 126.46C176.377 127.078 176.377 127.922 175.921 128.54L153.399 159.016C153.069 159.462 152.546 159.726 151.991 159.726H106.009C105.454 159.726 104.931 159.462 104.601 159.016L82.0795 128.54C81.6227 127.922 81.6227 127.078 82.0795 126.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M82.0795 114.459L104.601 83.9831C104.931 83.5366 105.454 83.2732 106.009 83.2732H151.991C152.546 83.2732 153.069 83.5366 153.399 83.9831L175.921 114.459C176.377 115.077 176.377 115.921 175.921 116.539L153.399 147.015C153.069 147.462 152.546 147.725 151.991 147.725H106.009C105.454 147.725 104.931 147.462 104.601 147.015L82.0795 116.539C81.6227 115.921 81.6227 115.077 82.0795 114.459Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M82.0795 102.46L104.601 71.984C104.931 71.5375 105.454 71.274 106.009 71.274H151.991C152.546 71.274 153.069 71.5375 153.399 71.984L175.921 102.46C176.377 103.078 176.377 103.922 175.921 104.54L153.399 135.016C153.069 135.463 152.546 135.726 151.991 135.726H106.009C105.454 135.726 104.931 135.463 104.601 135.016L82.0795 104.54C81.6227 103.922 81.6227 103.078 82.0795 102.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M82.0795 192.46L104.601 161.984C104.931 161.537 105.454 161.274 106.009 161.274H151.991C152.546 161.274 153.069 161.537 153.399 161.984L175.921 192.46C176.377 193.078 176.377 193.922 175.921 194.54L153.399 225.016C153.069 225.462 152.546 225.726 151.991 225.726H106.009C105.454 225.726 104.931 225.462 104.601 225.016L82.0795 194.54C81.6227 193.922 81.6227 193.078 82.0795 192.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M82.0795 180.459L104.601 149.983C104.931 149.537 105.454 149.273 106.009 149.273H151.991C152.546 149.273 153.069 149.537 153.399 149.983L175.921 180.459C176.377 181.077 176.377 181.921 175.921 182.539L153.399 213.015C153.069 213.462 152.546 213.725 151.991 213.725H106.009C105.454 213.725 104.931 213.462 104.601 213.015L82.0795 182.539C81.6227 181.921 81.6227 181.077 82.0795 180.459Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M82.0795 168.46L104.601 137.984C104.931 137.537 105.454 137.274 106.009 137.274H151.991C152.546 137.274 153.069 137.537 153.399 137.984L175.921 168.46C176.377 169.078 176.377 169.922 175.921 170.54L153.399 201.016C153.069 201.463 152.546 201.726 151.991 201.726H106.009C105.454 201.726 104.931 201.463 104.601 201.016L82.0795 170.54C81.6227 169.922 81.6227 169.078 82.0795 168.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M163.079 105.46L185.601 74.9839C185.931 74.5374 186.454 74.274 187.009 74.274H232.991C233.546 74.274 234.069 74.5374 234.399 74.9839L256.921 105.46C257.377 106.078 257.377 106.922 256.921 107.54L234.399 138.016C234.069 138.462 233.546 138.726 232.991 138.726H187.009C186.454 138.726 185.931 138.462 185.601 138.016L163.079 107.54C162.623 106.922 162.623 106.078 163.079 105.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M163.079 93.4591L185.601 62.9831C185.931 62.5367 186.454 62.2732 187.009 62.2732H232.991C233.546 62.2732 234.069 62.5367 234.399 62.9831L256.921 93.4591C257.377 94.0772 257.377 94.9211 256.921 95.5392L234.399 126.015C234.069 126.462 233.546 126.725 232.991 126.725H187.009C186.454 126.725 185.931 126.462 185.601 126.015L163.079 95.5392C162.623 94.9211 162.623 94.0772 163.079 93.4591Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M163.079 81.4599L185.601 50.984C185.931 50.5375 186.454 50.274 187.009 50.274H232.991C233.546 50.274 234.069 50.5375 234.399 50.984L256.921 81.4599C257.377 82.0781 257.377 82.9219 256.921 83.5401L234.399 114.016C234.069 114.463 233.546 114.726 232.991 114.726H187.009C186.454 114.726 185.931 114.463 185.601 114.016L163.079 83.5401C162.623 82.9219 162.623 82.0781 163.079 81.4599Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M163.079 171.46L185.601 140.984C185.931 140.537 186.454 140.274 187.009 140.274H232.991C233.546 140.274 234.069 140.537 234.399 140.984L256.921 171.46C257.377 172.078 257.377 172.922 256.921 173.54L234.399 204.016C234.069 204.462 233.546 204.726 232.991 204.726H187.009C186.454 204.726 185.931 204.462 185.601 204.016L163.079 173.54C162.623 172.922 162.623 172.078 163.079 171.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M163.079 159.459L185.601 128.983C185.931 128.537 186.454 128.273 187.009 128.273H232.991C233.546 128.273 234.069 128.537 234.399 128.983L256.921 159.459C257.377 160.077 257.377 160.921 256.921 161.539L234.399 192.015C234.069 192.462 233.546 192.725 232.991 192.725H187.009C186.454 192.725 185.931 192.462 185.601 192.015L163.079 161.539C162.623 160.921 162.623 160.077 163.079 159.459Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M163.079 147.46L185.601 116.984C185.931 116.537 186.454 116.274 187.009 116.274H232.991C233.546 116.274 234.069 116.537 234.399 116.984L256.921 147.46C257.377 148.078 257.377 148.922 256.921 149.54L234.399 180.016C234.069 180.463 233.546 180.726 232.991 180.726H187.009C186.454 180.726 185.931 180.463 185.601 180.016L163.079 149.54C162.623 148.922 162.623 148.078 163.079 147.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M1.07948 105.46L23.6015 74.9839C23.9314 74.5374 24.4537 74.274 25.0089 74.274H70.9911C71.5463 74.274 72.0686 74.5374 72.3985 74.9839L94.9205 105.46C95.3773 106.078 95.3773 106.922 94.9205 107.54L72.3985 138.016C72.0686 138.462 71.5463 138.726 70.9911 138.726H25.0089C24.4537 138.726 23.9314 138.462 23.6015 138.016L1.07948 107.54C0.62267 106.922 0.622669 106.078 1.07948 105.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M1.07948 93.4591L23.6015 62.9831C23.9314 62.5367 24.4537 62.2732 25.0089 62.2732H70.9911C71.5463 62.2732 72.0686 62.5367 72.3985 62.9831L94.9205 93.4591C95.3773 94.0772 95.3773 94.9211 94.9205 95.5392L72.3985 126.015C72.0686 126.462 71.5463 126.725 70.9911 126.725H25.0089C24.4537 126.725 23.9314 126.462 23.6015 126.015L1.07948 95.5392C0.62267 94.9211 0.622669 94.0772 1.07948 93.4591Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M1.07948 81.4599L23.6015 50.984C23.9314 50.5375 24.4537 50.274 25.0089 50.274H70.9911C71.5463 50.274 72.0686 50.5375 72.3985 50.984L94.9205 81.4599C95.3773 82.0781 95.3773 82.9219 94.9205 83.5401L72.3985 114.016C72.0686 114.463 71.5463 114.726 70.9911 114.726H25.0089C24.4537 114.726 23.9314 114.463 23.6015 114.016L1.07948 83.5401C0.62267 82.9219 0.622669 82.0781 1.07948 81.4599Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M1.07948 171.46L23.6015 140.984C23.9314 140.537 24.4537 140.274 25.0089 140.274H70.9911C71.5463 140.274 72.0686 140.537 72.3985 140.984L94.9205 171.46C95.3773 172.078 95.3773 172.922 94.9205 173.54L72.3985 204.016C72.0686 204.462 71.5463 204.726 70.9911 204.726H25.0089C24.4537 204.726 23.9314 204.462 23.6015 204.016L1.07948 173.54C0.62267 172.922 0.622669 172.078 1.07948 171.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M1.07948 159.459L23.6015 128.983C23.9314 128.537 24.4537 128.273 25.0089 128.273H70.9911C71.5463 128.273 72.0686 128.537 72.3985 128.983L94.9205 159.459C95.3773 160.077 95.3773 160.921 94.9205 161.539L72.3985 192.015C72.0686 192.462 71.5463 192.725 70.9911 192.725H25.0089C24.4537 192.725 23.9314 192.462 23.6015 192.015L1.07948 161.539C0.62267 160.921 0.622669 160.077 1.07948 159.459Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
                <path d="M1.07948 147.46L23.6015 116.984C23.9314 116.537 24.4537 116.274 25.0089 116.274H70.9911C71.5463 116.274 72.0686 116.537 72.3985 116.984L94.9205 147.46C95.3773 148.078 95.3773 148.922 94.9205 149.54L72.3985 180.016C72.0686 180.463 71.5463 180.726 70.9911 180.726H25.0089C24.4537 180.726 23.9314 180.463 23.6015 180.016L1.07948 149.54C0.62267 148.922 0.622669 148.078 1.07948 147.46Z" fill={getColor()} fillOpacity={props.fillOpacity} stroke={getColor()} strokeWidth={props.strokeWidth} />
            </svg>
        )
    } else {
        return '';
    }
}

export default LoadingNewDeco;