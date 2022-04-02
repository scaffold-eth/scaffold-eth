import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { connectController as wrapGlobalGameData } from '../../../../gameItems'
import { Button, CodeContainer, WindowModal } from '../../../../gameItems/components'

const ChallengeWindow = ({
  isOpen,
  globalGameActions,
  setHistoryWindowVisibility,
  setChallengeWindowVisibility,
  setContractWindowVisibility
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  const [fileContent0, setFileContent0] = useState('')
  const [fileContent1, setFileContent1] = useState('')
  const [fileContent2, setFileContent2] = useState('')
  const [fileContent3, setFileContent3] = useState('')
  const [fileContent4, setFileContent4] = useState('')
  const [fileContent5, setFileContent5] = useState('')
  const [fileContent6, setFileContent6] = useState('')
  const [fileContent7, setFileContent7] = useState('')

  useEffect(() => {
    import(`./Checkpoint_0.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent0(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    import(`./Checkpoint_1.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent1(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    import(`./Checkpoint_2.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent2(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    import(`./Checkpoint_3.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent3(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    import(`./Checkpoint_4.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent4(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    import(`./Checkpoint_5.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent5(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    import(`./Checkpoint_6.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent6(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    import(`./Checkpoint_7.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent7(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  })

  return (
    <WindowModal
      initTop={10}
      initLeft={window.innerWidth * 0.05}
      initHeight={window.innerHeight * 0.95}
      initWidth={window.innerWidth * 0.5}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Token Vendor'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          lineHeight: 2.2
        }}
      >
        <h2>🏵 Token Vendor 🤖</h2>
        <Markdown>{fileContent0}</Markdown>
        {currentStep >= 1 && <Markdown>{fileContent1}</Markdown>}
        {currentStep >= 2 && <Markdown>{fileContent2}</Markdown>}
        {currentStep >= 3 && <Markdown>{fileContent3}</Markdown>}
        {currentStep >= 4 && <Markdown>{fileContent4}</Markdown>}
        {currentStep >= 5 && <Markdown>{fileContent5}</Markdown>}
        {currentStep >= 6 && <Markdown>{fileContent6}</Markdown>}
        {currentStep >= 7 && <Markdown>{fileContent7}</Markdown>}

        {currentStep < 7 && (
          <Button
            style={{ marginTop: 30,  marginBottom: 40 }}
            onClick={() => {
              setCurrentStep(currentStep + 1)
            }}
          >
            Continue
          </Button>
        )}
        {currentStep >= 7 && (
          <Button
            className='is-warning'
            onClick={() => {
              globalGameActions.dialog.continueDialog()
              setHistoryWindowVisibility(false)
              setChallengeWindowVisibility(false)
              setContractWindowVisibility(false)
            }}
          >
            Done
          </Button>
        )}
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(ChallengeWindow)
