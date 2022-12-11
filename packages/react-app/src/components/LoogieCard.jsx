import { Button, Card } from "antd";
import Address from "./Address";
import AddressInput from "./AddressInput";

export default function LoogieCard({
  image,
  id,
  name,
  description,
  owner,
  mainnetProvider,
  blockExplorer,
  yourLoogies,
  tx,
  transferToAddresses,
  setTransferToAddresses,
  writeContracts,
  address,
}) {
  const showTransfer = yourLoogies && tx && transferToAddresses && setTransferToAddresses && writeContracts && address;
  return (
    <Card>
      <img src={image} alt={"Loogie #" + id} width="200" />
      <div style={{ borderTop: "1px solid #f0f0f0", textAlign: "left" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>
          <span style={{ fontSize: 18, marginRight: 8 }}>{name}</span>
        </div>
        <div style={{ marginTop: "8px" }}>{description}</div>
        {!yourLoogies && (
          <div style={{ marginTop: "8px" }}>
            <Address address={owner} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={16} />
          </div>
        )}
        {showTransfer && (
          <>
            <div style={{ marginTop: "10px" }}>
              <AddressInput
                style={{ marginTop: "10px" }}
                ensProvider={mainnetProvider}
                placeholder="transfer to address"
                value={transferToAddresses[id]}
                onChange={newValue => {
                  const update = {};
                  update[id] = newValue;
                  setTransferToAddresses({ ...transferToAddresses, ...update });
                }}
              />
            </div>
            <Button
              style={{ marginTop: "10px" }}
              onClick={() => {
                tx(writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id));
              }}
            >
              Transfer
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
