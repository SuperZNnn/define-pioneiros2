import { useState, useCallback, useRef } from "react";
import Cropper, { type Area } from "react-easy-crop";
import styled from "styled-components";

const CropperComponent = Cropper as unknown as React.ComponentType<{
    image?: string,
    crop: { x: number, y: number }
    zoom: number
    aspect: number
    onCropChange: (location: { x: number, y: number }) => void
    onZoomChange: (zoom: number) => void
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
}>

const ImageCropper = ({send, type}: { type?: 'secEdit'; send: (image: string) => void }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedArea, setCroppedArea] = useState<Area | null>(null)
    const [imageToCrop, setImageToCrop] = useState<string>()
    const [showCropper, setShowCropper] = useState<boolean>(false)

    const [closeCropper, setCloseCropper] = useState<boolean>()

    const InputFile = useRef<HTMLInputElement>(null)

    const handleConfirmCrop = async () => {
        if (imageToCrop && croppedArea){
            const croppedImageUrl = await getCroppedImg(imageToCrop, croppedArea)
            if (croppedImageUrl){
                handleClose()
                send(croppedImageUrl)
            }
        }
    }

    const handleClose = () => {
        setCloseCropper(true)

        setTimeout(() => {
        setShowCropper(false)
        if (InputFile.current) {
            InputFile.current.value = ''
        }
        }, 500);
    }

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels)
    }, [])

    const getCroppedImg = async (imageSrc: string, crop: Area) => {
        const image = new Image()
        image.src = imageSrc
        await new Promise((resolve) => (image.onload = resolve))

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return null

        canvas.width = crop.width
        canvas.height = crop.height

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        )

        return new Promise<string>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob){
                    resolve(URL.createObjectURL(blob))
                }
            }, "image/jpeg")
        })
    }

    return (
        <CropperWrapper style={{ display: `${showCropper?'':'none'}` }} type={type}>
            {showCropper?<>
                <div className={`image-cropper ${closeCropper?'out':''}`}>
                    <div className="filler">
                        <CropperComponent
                            image={imageToCrop}
                            crop={crop}
                            zoom={zoom}
                            aspect={1/1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />

                        <div className="buttons-container">
                            <button className="btn" style={{ backgroundColor: 'var(--first-color)' }} onClick={handleConfirmCrop}>Pronto</button>
                            <button className="btn" style={{ backgroundColor: 'var(--fourth-color)' }} onClick={handleClose}>Fechar</button>
                        </div>
                    </div>
                </div>
            </>:null}

            <input type="file" accept="image/*" id="profile-select" style={{display: 'none'}}
                ref={InputFile}
                onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0]
                    const imageUrl = URL.createObjectURL(file)
                    setImageToCrop(imageUrl)
                    setShowCropper(true)
                    setCloseCropper(false)
                }
                }}
            />
        </CropperWrapper>
    )
}
export default ImageCropper

export const CropperWrapper = styled.div<{ type?: 'secEdit' }>`
    z-index: 3;
    
    height: ${({type}) => type?`
        ${type==='secEdit'?'47vh':null}
    `:'50vh'};
    width: ${({type}) => type?`
        ${type==='secEdit'?'47vh':null}
    `:'50%'};
    position: ${({type}) => type?`
        ${type==='secEdit'?'relative':null}
    `:'absolute'};;
    left: ${({type}) => type?`
        ${type==='secEdit'?'0':null}
    `:'50%'};

    ${({type}) => !type?`@media (max-width: 700px){
        width: 100%;
        left: 0;
        top: 70vh;
    }`:null}

    @media (max-width: 700px){
        ${({type}) => !type?`
        top: 99vh;
        transform: translateY(-50%)`:null}
    }

    .image-cropper{
        animation: fadein .5s ease-in-out forwards;

        &.out{
            animation: fadeout .5s ease-in-out forwards;
        }
    }

    .reactEasyCrop_Container{
        width: 100%;
        height: 100vh;
    }

    .buttons-container{
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: space-evenly;
        height: 10vh;
        top: 80.5vh;
        align-items: center;

        button{
            width: 20vh;
            height: 5vh;
            color: #fff;
            font-family: 'Inter', sans-serif;
            border: .3vh solid #fff;
            cursor: pointer;
            transition: .2s;

            &:hover{
                transform: scale(1.1)
            }

            &:nth-child(1){
                background-color: var(--green);
            }
            &:nth-child(2){
                background-color: var(--yellow);
                color: #000;
            }
        }
    }
`