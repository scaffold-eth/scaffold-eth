import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

function CyberConnectFollowButton({ isFollowing, targetAddress, injectedProvider }) {
  const cyberConnect = new CyberConnect({
    namespace: "CyberConnect-Scaffold-Eth",
    env: Env.PRODUCTION,
    chain: Blockchain.ETH,
    provider: injectedProvider,
  });

  const handleOnClick = async () => {
    if (!injectedProvider) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      if (isFollowing) {
        await cyberConnect.disconnect(targetAddress);
        alert(`Success: you've unfollowed ${targetAddress}!`);
        window.location.reload();
      } else {
        await cyberConnect.connect(targetAddress);
        alert(`Success: you're following ${targetAddress}!`);
        window.location.reload();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <button
      onClick={handleOnClick}
      style={{
        background: "black",
        borderRadius: "20px",
        border: "1px solid white",
        color: "white",
        cursor: "pointer",
        fontSize: "14px",
        padding: "6px 20px",
      }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default CyberConnectFollowButton;
