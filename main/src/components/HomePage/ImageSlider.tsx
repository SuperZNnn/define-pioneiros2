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
            <div
                className={`secondary_image photo shadow simple-box-shadow`}
                style={{ 
                    position: 'absolute',
                    backgroundImage: `url('https://pioneirosdoadvento.com/assets/photos/${imgCount2}.jpg?t=1')`
                }}
            />
            <div
                className={`main_image photo ${animation ? 'fadeout' : ''}`}
                style={{backgroundImage: `url('https://pioneirosdoadvento.com/assets/photos/${imgCount}.jpg?t=1`}}
            />
        </ImageSliderStyle>
    )
}
export default ImageSlider

const ImageSliderStyle = styled.section`
    position: absolute;
    z-index: -1;
    width: 100%;

    .photo{
        width: 50%;
        height: 100vh;
        object-fit: cover;
        transition: background-image 1s ease-in-out;
        background-position: center;
        background-size: cover;

        @media (max-width: 1150px){
            width: 100%;
        }

        &.fadeout{
            animation: fadeout ease-in-out .5s forwards
        }

    }
`