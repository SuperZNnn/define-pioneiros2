import styled from "styled-components"

const CamporiContainer = () => {
    return (
        <CamporiContainerStyle id="camporis">
            <h2 className="main-title" style={{ textAlign: "left", color: 'var(--white)' }}>Histórico de camporis</h2>

            <div className="styled-container white2 overflow">
                <Campori
                    image="https://pioneirosdoadvento.com/assets/photos/camporis/protagonistas.jpg"
                    campori="Protagonistas"
                    status="UNeB 2024"
                    local="Parnamirim - RN"
                />
                <Campori
                    image="https://pioneirosdoadvento.com/assets/photos/camporis/imortais.jpg"
                    campori="Imortais"
                    status="APE & APeC 2023"
                    local="Gravatá - PE"
                />
                <Campori
                    image="https://pioneirosdoadvento.com/assets/photos/camporis/a_melhor_aventura.jpg"
                    campori="A melhor aventura"
                    status="DSA 2019"
                    local="Barretos - SP"
                />
                <Campori
                    image="https://pioneirosdoadvento.com/assets/photos/camporis/inabalavel.jpg"
                    campori="Inabalável"
                    status="UNeB 2017"
                    local="Parnamirim - RN"
                />
                <Campori
                    image="https://pioneirosdoadvento.com/assets/photos/camporis/geracao_de_campeoes.jpg"
                    campori="Geração de Campeões"
                    status="APE 2016"
                    local="Paudalho - PE"
                />
                <Campori
                    image="https://pioneirosdoadvento.com/assets/photos/camporis/investidos_para_eternidade.jpg"
                    campori="Investidos para a eternidade"
                    status="APE 2013"
                    local="Paudalho - PE"
                />
            </div>
        </CamporiContainerStyle>
    )
}
export default CamporiContainer

const Campori = ({image, campori, status, local}:{ image: string, campori: string, status: string, local: string }) => {
    return (
        <div className="campori">
            <img alt={`Campori ${campori}`} src={image}/>
            <p className="simple-text" style={{ fontSize: '1rem' }}><b>{campori}</b><br/>{status}</p>
            <p className="simple-text" style={{ fontSize: '1rem' }}><u>{local}</u></p>
        </div>
    )
}

const CamporiContainerStyle = styled.section`
    width: 100%;
    background-color: var(--fifth-color);
    padding: 1vh;

    ::-webkit-scrollbar {
        width: 1vh;
    }
    ::-webkit-scrollbar-track {
        background: #484f4a;
    }
    ::-webkit-scrollbar-thumb {
        background: var(--third-color);
        border-radius: .7vh;
    }

    .campori{
        height: 45vh;

        img{
            width: 35vh;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-radius: 1vh 0 1vh 0;
            box-shadow: 5px 5px 0px var(--fourth-color);
        }
        p{
            text-align: center;
        }
    }
`