import BalanceTree from './balance-tree'

// This is the blob that gets distributed and pinned to IPFS.
// It is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.
interface MerkleDistributorInfo {
  merkleRoot: string
  claims: {
    [hash: string]: {
      index: number
      exists: boolean
      proof: string[]
      flags?: {
        [flag: string]: boolean
      }
    }
  }
}

type OldFormat = { [hash: string]: boolean }
type NewFormat = { hash: string; exists: boolean; }

export function parseBalanceMap(balances: OldFormat | NewFormat[]): MerkleDistributorInfo {
  const balancesInNewFormat: NewFormat[] = Array.isArray(balances)
    ? balances
    : Object.keys(balances).map(
        (hash): NewFormat => ({
          hash: hash,
          exists: balances[hash],
        })
      )

  const dataByAddress = balancesInNewFormat.reduce<{
    [hash: string]: { exists: boolean; flags?: { [flag: string]: boolean } }
  }>((memo, { hash: hash, exists }) => {
    if (memo[hash]) throw new Error(`Duplicate Hash`);
    const flags = {
      isPresent: true
    }
    memo[hash] = { exists: exists, ...( flags) }
    return memo
  }, {})

  const sortedAddresses = Object.keys(dataByAddress).sort()

  // construct a tree
  const tree = new BalanceTree(
    sortedAddresses.map((hash) => ({ hash: hash, exists: dataByAddress[hash].exists }))
  )

  // generate claims
  const claims = sortedAddresses.reduce<{
    [hash: string]: { exists: boolean; index: number; proof: string[]; flags?: { [flag: string]: boolean } }
  }>((memo, hash, index) => {
    const { exists, flags } = dataByAddress[hash]
    memo[hash] = {
      index,
      exists: exists,
      proof: tree.getProof(index, hash, exists),
      ...(flags ? { flags } : {}),
    }
    return memo
  }, {})

  return {
    merkleRoot: tree.getHexRoot(),
    claims,
  }
}
