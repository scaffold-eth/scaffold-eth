# Starknet + nile NFT

This dapp will deploy an ERC721 contract (written in cairo) to the starknet goerli alpha testnet.

## Set up the project

### Create a Python virtual environment

```bash
python3 -m venv env
source env/bin/activate
```

### 📦 Install requirements

```bash
pip install -r requirements.txt
```

## ⛏️ Compile

```bash
nile compile --directory packages/nile/src/starknet-nft
```

## 🌡️ Test

```bash
# Run all tests
pytest ./packages/nile/tests

# Run a specific test file
pytest ./packages/nile/tests/test_ERC721.py
```

## Resources

* [starknet](https://starkware.co/starknet/)
* [nil](https://github.com/OpenZeppelin/nile)
* [cairo-lang](https://www.cairo-lang.org/)
* [cairo-lang docs](https://www.cairo-lang.org/docs/)
* [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth)
* [goerli starknet block explorer](https://goerli.voyager.online/)
