import WlcSupplyScheduleImage from 'assets/learn/post/coinomics/wlcSupplySchedule.png';

const Coinomics = () => {
  return (
    <>
      <h1>WorldLand Coinomics</h1>
      <p>
        Coinomics of WorldLand involves the issuance and utilization of the mainnet coin WLC to support the development
        ecosystem of dApps and the operation of the mainnet. Here are the key aspects of WorldLand's coinomics:
      </p>
      <img src={WlcSupplyScheduleImage} alt="WlcSupplyScheduleImage" />
      <ol>
        <li>
          <strong>Coin Issuance</strong>: The mainnet coin WLC is issued to establish, nurture, and maintain the
          development ecosystem of dApps on the WorldLand platform. The issuance of WLC tokens is primarily the
          responsibility of the developer launching and operating the mainnet.
        </li>
        <li>
          <strong>Network Usage Fees</strong>: WLC tokens are used by node operators to voluntarily contribute to the
          ecosystem, pay for network usage fees, and maintain wallets. Additionally, WLC tokens are used by smart
          contract users for transactions within the network.
        </li>
        <li>
          <strong>Exclusive Issuance Rights</strong>: The issuers of WLC tokens lose their exclusive issuance rights to
          coins other than those issued on the Genesis block immediately after the mainnet launch. This ensures that the
          initial issuance remains stable and prevents arbitrary creation of additional tokens.
        </li>
        <li>
          <strong>Permanence of Coin Usage</strong>: WLC coins are intended to be permanently used among network users
          as long as the WorldLand network exists, serving as a medium of exchange and value within the ecosystem.
        </li>
        <li>
          <strong>Token Supply:</strong> To maximize the initial network effect, WLC coins are supplied to the network
          through four half-lives over eight years after the Genesis block. Following the initial halving, the token
          supply experiences stable and predictable growth through a 4% inflation rate.
        </li>
        <li>
          <strong>Foundation Decentralization</strong>: The WorldLand Foundation plays a role in the initial stages but
          aims to gradually decentralize its stake. The foundation's stake in the Genesis block is continuously reduced
          from 55% to 29% in the second year and further reduced to 17% in the fifth year. This decentralization fosters
          a more distributed and community-driven ecosystem.
        </li>
      </ol>
      <br />
      <p>
        By implementing these coinomics principles, WorldLand aims to incentivize participation, ensure a stable token
        supply, and foster a decentralized and sustainable development ecosystem for dApps on its platform.
      </p>
    </>
  );
};

export default Coinomics;
