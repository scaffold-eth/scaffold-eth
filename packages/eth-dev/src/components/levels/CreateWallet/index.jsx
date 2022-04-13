import React from 'react'
import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Background, Terminal, TerminalDialogContainer, Wallet } from '../../gameItems/components'

import { DetailsOnWalletsWindow, CreateWalletWindow } from './components'
import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'CreateWallet'

const CreateWalletLevel = props => {
  const {
    web3Modal,
    address,
    localProvider,
    userProvider,
    ensProvider,
    // price,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    networkSelect
  } = props

  // --------------------------------
  // set initial level background
  const [backgroundId, setBackgroundId] = useLocalStorage(
    `${LEVEL_ID}-backgroundId`,
    backgroundIds.City
  )

  // set initial dialog index
  const [currentDialogIndex, setCurrentDialogIndex] = useLocalStorage(`${LEVEL_ID}-dialogIndex`, 0)
  const continueDialog = () => setCurrentDialogIndex(currentDialogIndex + 1)

  const [
    dialogPathsVisibleToUser,
    setDialogPathsVisibleToUser
  ] = useLocalStorage(`${LEVEL_ID}-dialogPathsVisibleToUser`, [INITIAL_DIALOG_PART_ID])

  const jumpToDialogPath = ({ dialogPathId }) => {
    // determine new currentDialogIndex
    let updatedCurrentDialogIndex
    levelDialog.map((dialogPart, index) => {
      if (!updatedCurrentDialogIndex && dialogPart.dialogPathId === dialogPathId) {
        updatedCurrentDialogIndex = index
      }
    })
    // add dialogPathId to dialogParts that are visible to the user
    setDialogPathsVisibleToUser([...dialogPathsVisibleToUser, dialogPathId])
    setCurrentDialogIndex(updatedCurrentDialogIndex)
  }
  // --------------------------------

  const [walletIsVisible, setWalletIsVisible] = useLocalStorage(
    `${LEVEL_ID}-walletIsVisible`,
    false
  )

  const [detailsOnWalletsWindowVisible, setDetailsOnWalletsWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-detailsOnWalletsWindowVisible`,
    false
  )

  return (
    <>
      <Background backgroundId={backgroundId} />

      <div id='createWalletLevel'>
        <Terminal
          isOpen
          showMessageNotification={{
            delayInSeconds: null
          }}
        >
          <TerminalDialogContainer
            levelDialog={levelDialog}
            currentDialogIndex={currentDialogIndex}
            setCurrentDialogIndex={setCurrentDialogIndex}
            continueDialog={continueDialog}
            dialogPathsVisibleToUser={dialogPathsVisibleToUser}
            jumpToDialogPath={jumpToDialogPath}
            setBackgroundId={setBackgroundId}
            //
            setDetailsOnWalletsWindowVisibility={setDetailsOnWalletsWindowVisibility}
            setWalletIsVisible={setWalletIsVisible}
          />
        </Terminal>

        <Wallet
          isOpen={walletIsVisible}
          web3Modal={web3Modal}
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          ensProvider={ensProvider}
          // price={price}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          networkSelect={networkSelect}
        />

        <DetailsOnWalletsWindow
          isOpen={detailsOnWalletsWindowVisible}
          currentDialogIndex={currentDialogIndex}
          setCurrentDialogIndex={setCurrentDialogIndex}
          continueDialog={continueDialog}
          jumpToDialogPath={jumpToDialogPath}
          //
          setDetailsOnWalletsWindowVisibility={setDetailsOnWalletsWindowVisibility}
          setWalletIsVisible={setWalletIsVisible}
        />

        {/* <CreateWalletWindow isOpen={createWalletWindowVisible} /> */}
      </div>
    </>
  )
}

export default CreateWalletLevel
