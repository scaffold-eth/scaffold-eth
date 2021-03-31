import MerkleTree from './merkle-tree'
import { BigNumber, utils } from 'ethers'

export default class BalanceTree {
  private readonly tree: MerkleTree
  constructor(balances: { hash: string; exists: boolean }[]) {
    this.tree = new MerkleTree(
      balances.map(({ hash, exists }, index) => {
        return BalanceTree.toNode(index, hash, exists)
      })
    )
  }

  public static verifyProof(
    index: number | BigNumber,
    hash: string,
    exists: boolean,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceTree.toNode(index, hash, exists)
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item)
    }

    return pair.equals(root)
  }

  // keccak256(abi.encode(index, hash, exists))
  public static toNode(index: number | BigNumber, hash: string, exists: boolean): Buffer {
    return Buffer.from(
      utils.solidityKeccak256(['uint256', 'string', 'bool'], [index, hash, exists]).substr(2),
      'hex'
    )
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot()
  }

  // returns the hex bytes32 values of the proof
  public getProof(index: number | BigNumber, hash: string, exists: boolean): string[] {
    return this.tree.getHexProof(BalanceTree.toNode(index, hash, exists))
  }
}
