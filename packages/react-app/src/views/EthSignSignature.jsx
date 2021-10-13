export class EthSignSignature {
  constructor(signer, signature) {
    this.signer = signer
    this.data = signature
  }
  staticPart() {
    return this.data
  }
  dynamicPart() {
    return ''
  }
}
