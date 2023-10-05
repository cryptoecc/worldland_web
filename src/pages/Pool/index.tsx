import styled from 'styled-components';
import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import Backdrop from 'components/Backdrop';
import { ImDrawer2 } from "react-icons/im";

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
  .content-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 4;
    max-width: 800px;
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
  }
`