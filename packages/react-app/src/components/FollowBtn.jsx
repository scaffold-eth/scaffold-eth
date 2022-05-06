import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

const cyberConnect = new CyberConnect({
  namespace: "CyberConnect-Scaffold-Eth",
  env: Env.PRODUCTION,
  chain: Blockchain.ETH,
  provider: window.ethereum,
});

function FollowButton({ address, isFollowing }) {
  const handleOnClick = async () => {
    try {
      if (isFollowing) {
        await cyberConnect.disconnect(address);
        alert(`Success: you've unfollowed ${address}!`);
      } else {
        await cyberConnect.connect(address);
        alert(`Success: you're following ${address}!`);
      }
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button className="followButton" onClick={handleOnClick}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
