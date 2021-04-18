import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps, reducer } from './controller'
import { DialogWindow, TokenContractWindow } from './views/windows'
import './styles.css'

const DialogContainer = ({
  localProvider,
  userProvider,
  transactor,
  address,
  dialogVisible,
  dialogs,
  currentDialog,
  actions
}) => {
  return (
    <>
      <DialogWindow
        localProvider={localProvider}
        address={address}
        dialogVisible={dialogVisible}
        dialogs={dialogs}
        currentDialog={currentDialog}
        actions={actions}
      />

      {dialogs[currentDialog.name].map((dialog, index) => {
        const { anchorId, avatar, alignment, text, code, choices } = dialog

        if (index <= currentDialog.index) {
          if (currentDialog.name === 'setupCodingEnv' && anchorId === 'cityFundsContract') {
            return (
              <TokenContractWindow
                localProvider={localProvider}
                userProvider={userProvider}
                address={address}
                transactor={transactor}
                contractCode={code}
                actions={actions}
              />
            )
          }
        }
      })}
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogContainer)

export { reducer }
