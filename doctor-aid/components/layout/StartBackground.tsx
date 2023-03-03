import styles from './StartBackground.module.scss';
import Image from "next/image";

const StartBackground = () => {
    return (
        <div>
            <Image src="/background.jpg" alt="doctorAID" layout='fill' objectFit="cover" quality={100}
                   className={styles.background}/>
        </div>
    )
}

export default StartBackground;