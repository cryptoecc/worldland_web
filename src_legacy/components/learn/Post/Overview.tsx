const Overview = () => {
  return (
    <>
      <h1>What is WorldLand</h1>
      <p>
        WorldLand is an L2 or side chain of Ethereum, designed as a bottom-up solution to enhance the Ethereum
        ecosystem. Recognizing that the blockchain trilemma cannot be fully addressed by a single blockchain, WorldLand
        proposes the utilization of decentralized security blockchains, referred to as DeSecure blockchains, to achieve
        scalability while preserving decentralization and security. By connecting multiple side chains in parallel,
        WorldLand aims to increase block space and enhance transaction processing capabilities by integrating
        sub-national chains, local chains, and application chains.
      </p>
      <br />
      <p>
        WorldLand seeks to utilize the Proof-of-Work (PoW) consensus algorithm, which is not only simple and robust but
        also operates with independent peers that do not require constant information exchange. This characteristic
        reduces the network's influence on the consensus process. With PoW, each block records the number of independent
        nodes participating in consensus. Reversing a specific block would require securing more nodes than the number
        recorded in the block header. In other words, attempting to launch a reversible attack becomes costly, ensuring
        irreversibility.
      </p>
      <br />
      <p>
        However, traditional PoW systems have come under scrutiny due to their significant energy consumption,
        equivalent to that of a small country, for solving computational puzzles to elect block-creating nodes.
        WorldLand acknowledges this energy overconsumption problem associated with PoW and aims to provide a solution
        for it.
      </p>
    </>
  );
};

export default Overview;
