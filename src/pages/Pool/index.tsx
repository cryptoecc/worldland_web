import styled from 'styled-components';
import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import Backdrop from 'components/Backdrop';
import { ImDrawer2 } from "react-icons/im";
import { AiOutlineArrowRight } from "react-icons/ai";

const Pool = () => {
    return (
        <Container>
            <Backdrop intensity={5} />
            <VideoContainer>
                <Video autoPlay loop muted playsInline>
                    <source src="/videos/MainVideo.mp4" />
                    Your browser does not support the video tag.
                </Video>
            </VideoContainer>
            <section className="content-wrap">
                <div className="header">
                    <h1>Pools</h1>
                    <button className="add-liquidity">
                        + New position
                    </button>
                </div>
                <div className="active-positions">
                    <div className="no-positions">
                        <ImDrawer2 color="#ffffff" size={55} />
                        <h3>Your active liquidity positions will appear here.</h3>
                    </div>
                </div>
                <div className="learn">
                    <div className="walkthrough">
                        <p>Learn about providing liquidity <AiOutlineArrowRight color="#ffffff" size={15} style={{ transform: "rotate(-45deg)" }} /></p>
                        <p>Check out our v3 LP walkthrough and migration guides.</p>
                    </div>
                    <div className="walkthrough">
                        <p>Top pools <AiOutlineArrowRight color="#ffffff" size={15} style={{ transform: "rotate(-45deg)" }} /></p>
                        <p>Explore Kimchiswap analytics.</p>
                    </div>
                </div>
            </section>
        </Container>
    )
}

export default Pool;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  position: relative;
  font-family: 'Nunito Sans', sans-serif;
  padding: 20px;
  .content-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 4;
    max-width: 900px;
    width: 100%;
    gap: 30px;


    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-weight: 600;
        h1 {
        color: #ffffff;
        font-size: 38px;
        }
        button {
        color: #ffffff;
        font-size: 20px;
        border-radius: 15px;
        background-color: #FC72FF;
        padding: 12px;
        cursor: pointer;
        }
    }
    .active-positions {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        background-color: rgb(255, 255, 255, 0.1);
        width: 100%;
        max-width: inherit;
        height: 300px;
        .no-positions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex-direction: column;
            color: #ffffff;

            h3 {
                font-size: 20px;
                max-width: 320px;
                text-align: center;
                line-height: 1.4;
            }
        }
    } 
    .learn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .walkthrough {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            border: 1px solid #5b5b5b;
            border-radius: 20px;
            color: #ffffff;
            max-width: 440px;
            width: 100%;
            font-weight: 550;
        }
        .walkthrough:hover {
            opacity: 0.6;
            cursor: pointer;
        }

        @media screen and (max-width: 728px) {
            flex-direction: column;
            gap: 20px;
        }
    }
  }
`