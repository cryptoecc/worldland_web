import { styled } from "styled-components";

const Backdrop = ({ close, intensity }: BackdropProps) => {
    return (
        <Container intensity={intensity} onClick={() => close && close(false)} />
    )
}

export default Backdrop

const Container = styled.div<{ intensity: number }>`
    position: absolute;
    z-index: ${({ intensity }) => intensity > 5 ? "5" : "3"} ;
    width: 100%;
    height: 100vh;
    cursor: pointer;
    background-size: cover;
    backdrop-filter: ${(props) => `blur(${props.intensity}px)`}
    `;