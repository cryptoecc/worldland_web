import { useEffect } from "react"
import Layout from "components/@common/Layout/Layout"
import LineChart from "components/LineChart"
import BarChart from "components/BarChart"
import styled from "styled-components"


const Tokens = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <Layout>
            <Container>
                <LineChart />
                <BarChart />
            </Container>
        </Layout>
    )
}

export default Tokens

const Container = styled.section`
    position: absolute;
    left: 0;
    top: 7rem;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100vh;

    @media screen and (max-width: 728px) {
        flex-direction: column;
        row-gap: 1rem;
    }
`
