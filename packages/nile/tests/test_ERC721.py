"""ERC721.cairo test file."""
import pytest
from starkware.starknet.testing.starknet import Starknet
from utils import (
    assert_revert, cached_contract, contract_path, get_contract_def,
    to_uint, assert_event_emitted, str_to_felt, Signer
)


# testing vars
OWNER=42
NAME = str_to_felt("Starknet NFT")
SYMBOL = str_to_felt("STARK")

@pytest.fixture
def contract_defs():
    erc721_def = get_contract_def('starknet-nft/ERC721.cairo')
    return erc721_def

@pytest.fixture
async def starknet_nft_init(contract_defs):
    erc721_def = contract_defs
    starknet = await Starknet.empty()
    erc721 = await starknet.deploy(
        contract_def=erc721_def,
        constructor_calldata=[NAME, SYMBOL, OWNER]
    )
    return (
        starknet.state,
        erc721,
    )

@pytest.fixture
def starknet_nft_factory(contract_defs, starknet_nft_init):
    erc721_def = contract_defs
    state, erc721 = starknet_nft_init
    _state = state.copy()
    erc721 = cached_contract(_state, erc721_def, erc721)    
    return erc721

@pytest.mark.asyncio
async def test_initial_data(starknet_nft_factory):
    erc721 = starknet_nft_factory
    execution_info = await erc721.name().call()
    assert execution_info.result.name == NAME