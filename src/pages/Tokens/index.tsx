import LineChart from "components/LineChart"
import styled from "styled-components"


const Tokens = () => {
    return (
        <Container>
            <LineChart />
        </Container>
    )
}

export default Tokens

const Container = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
`
