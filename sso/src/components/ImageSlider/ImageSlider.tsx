import { useEffect, useState } from "react"
import styled from "styled-components"

const ImageSlider = () => {
    const quant = 5

    const [imgCount, setImgCount] = useState<number>(1)
    const [imgCount2, setImgCount2] = useState<number>(1)
    const [animation, setAnimation] = useState<boolean>(false)

    useEffect(() => {
        const interval = setInterval(nextImg, 5000)
        return () => clearInterval(interval);
    }, [])

    const nextImg = () => {
        setImgCount2((prev) => (prev === quant ? 1 : (prev || imgCount) + 1))
        setAnimation(true)
        setTimeout(() => {
            setImgCount((prev) => (prev === quant ? 1 : prev + 1))
            setAnimation(false)
        }, 500)
    }

    return (
        <ImageSliderStyle>
            <img
                className={`secondary_image photo shadow simple-box-shadow`}
                src={`https://pioneirosdoadvento.com/assets/photos/${imgCount2}.jpg`}
                style={{ position: 'absolute'}}
                alt="Imagem secundária do slider"
            />
            <img
                className={`main_image photo ${animation ? 'fadeout' : ''}`}
                src={`https://pioneirosdoadvento.com/assets/photos/${imgCount}.jpg`}
                alt="Imagem primária do slider"
            />
        </ImageSliderStyle>
    )
}
export default ImageSlider

const ImageSliderStyle = styled.div`
    position: relative;

    img{
        aspect-ratio: 16/9;
        width: 40vh;
        object-fit: cover;
        transition: 1s ease-in-out;

        @media (max-width: 650px){
            width: 30vh;
        }

        &.fadeout{
            animation: fadeout ease-in-out .5s forwards
        }
    }
`