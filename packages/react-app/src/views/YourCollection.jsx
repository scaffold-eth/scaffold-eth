import { Button, Card, List, Popover } from "antd";

function YourCollection({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  address,
  localProviderPollingTime,
  yourNfts,
  loadingYourNfts,
}) {
  return (
    <div style={{ width: "auto", paddingBottom: 25, minHeight: 800, margin: 20 }}>
      <div style={{ maxWidth: 515, margin: "0 auto" }}>
        <Button
          style={{ width: 300, height: 40, fontSize: 20 }}
          type="primary"
          onClick={async () => {
            try {
              tx(writeContracts.Emotilon.mintItem({ gasLimit: 400000 }), function (transaction) {
                // TODO
              });
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT
        </Button>
      </div>
      <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800, paddingTop: 20 }}>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 6,
          }}
          loading={loadingYourNfts}
          dataSource={yourNfts}
          renderItem={item => {
            const id = item.id.toNumber();

            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <Popover content={item.description} title="Emotilon Description">
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                      </Popover>
                    </div>
                  }
                >
                  <img width="200" src={item.image} title={item.name} alt={item.name} />
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}

export default YourCollection;
