import start from './dialogParts/start'
import knowsWallets from './dialogParts/knows-wallets'
import doesNotKnowWallets from './dialogParts/does-not-know-wallets'

export default [...start, ...knowsWallets, ...doesNotKnowWallets]
