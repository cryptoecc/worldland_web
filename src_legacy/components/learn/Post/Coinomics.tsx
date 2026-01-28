import WlcSupplyScheduleImage from 'assets/learn/post/coinomics/wlcSupplySchedule.png';

const Coinomics = () => {
  return (
    <>
      <h1>WorldLand Coinomics</h1>
      <p>
        WorldLand's coinomics involves issuing and utilizing the mainnet coin WLC to support the development ecosystem
        of DApps and the operation of the mainnet. Here are some highlights of WorldLand's coinomics:
      </p>
      <img src={WlcSupplyScheduleImage} alt="WlcSupplyScheduleImage" />
      <ol>
        <li>
          <strong>Coin Issuance</strong>: WLC, the mainnet coin, is issued to build, foster, and maintain the
          development ecosystem of DApps on the Worldland platform. The issuance of WLC is primarily the responsibility
          of developers who launch and operate the mainnet. There are 40,996,800 coins issued in the genesis block,
          which will be used for d ecosystem. For the next five years, the network supply of WLC coins will be
          40,996,800 coins, matching the number issued in the genesis block.
        </li>
        <li>
          <strong>Network Usage Fees</strong>: WLC is used by node operators to voluntarily contribute to the ecosystem,
          pay network usage fees, and maintain wallets. Smart contract users also WLC for transactions within the
          network.
        </li>
        <li>
          <strong>Exclusive Issuance Rights</strong>: WLC issuers lose their exclusive minting rights to any other coins
          except those issued in the genesis block immediately after the mainnet launch. This ensures that the initial
          issuance remains stable and prevents the random creation of additional coins.
        </li>
        <li>
          <strong>Permanence of Coin Usage</strong>: WLC is permanently used among network users as long as the
          WorldLand Network exists, serving as a medium of exchange and value within the ecosystem.
        </li>
        <li>
          <strong>Coin Supply:</strong> To maximize initial network effectiveness, WLC coins will be supplied to the
          network in four halving cycles over the course of eight years following the genesis block. After the initial
          halving, the coin supply experiences stable and predictable growth through an inflation rate of 4%.
        </li>
        <li>
          <strong>Coin burning</strong>: coins issued in the genesis block can be burned by Dao's decision.
        </li>
        <li>
          <strong>Foundation Decentralization</strong>: The WorldLand Foundation will play a role in the early stages,
          but aims to gradually diversify its stake. The Foundation's Long-Term Endowment (LTE) stake in the Genesis
          Block is 20%. 80% of the shares issued in the Genesis Block are ECO Funds. The ECO Fund will be used to expand
          the WorldLand ecosystem. The main projects for ecosystem expansion include Wallets, NFT/Game, Voting/Bridge,
          My AI Network, Mainnet, Research, Education, and Investment. The ECO fund will be used in the following
          proportions: 30%, 30%, 20%, 10%, and 10% per year for 5 years. After five years, the foundation's LTE will be
          10%, and this decentralization will create a more decentralized and community-driven ecosystem.
        </li>
      </ol>
      <br />
      <p>
        By implementing these coinomics principles, Worldland aims to encourage participation, ensure a stable coin
        supply, and create a decentralized and sustainable development ecosystem for dApps on the platform.
      </p>
    </>
  );
};

export default Coinomics;

