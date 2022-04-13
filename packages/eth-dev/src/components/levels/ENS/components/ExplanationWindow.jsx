import React, { useState } from 'react'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({ isOpen, continueDialog, setExplanationWindowVisibility }) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth * 0.45}
      initHeight={window.innerHeight * 0.95}
      initWidth={window.innerWidth / 2}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='ENS'
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
          overflowX: 'hidden'
        }}
      >
        <div
          style={{
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          <h2>What is ENS?</h2>
          ENS stands for "Ethereum Domain Name Service". What it essentially does is map human
          readable indentifiers like 'my-wallet.eth' to Ethereum addresses like
          0x4d557D359087279fbE4FbbC8e5ae705B36eBA656. So now when someone wants to interact with
          this address, the don't have to type 0x... but can just use my-wallet.eth.
          <br />
          The abstract in{' '}
          <a target='_blank' rel='noreferrer' href='https://eips.ethereum.org/EIPS/eip-137'>
            EIP 137
          </a>{' '}
          gives good overview on the idea behind ENS:
          <br />
          <br />
          <h2>EIP 137 - Abstract</h2>
          This draft EIP describes the details of the Ethereum Name Service, a proposed protocol and
          ABI definition that provides flexible resolution of short, human-readable names to service
          and resource identifiers. This permits users and developers to refer to human-readable and
          easy to remember names, and permits those names to be updated as necessary when the
          underlying resource (contract, content-addressed data, etc) changes.
          <br />
          <br />
          The goal of domain names is to provide stable, human-readable identifiers that can be used
          to specify network resources. In this way, users can enter a memorable string, such as
          ‘vitalik.wallet’ or ‘www.mysite.swarm’, and be directed to the appropriate resource. The
          mapping between names and resources may change over time, so a user may change wallets, a
          website may change hosts, or a swarm document may be updated to a new version, without the
          domain name changing. Further, a domain need not specify a single resource; different
          record types allow the same domain to reference different resources. For instance, a
          browser may resolve ‘mysite.swarm’ to the IP address of its server by fetching its A
          (address) record, while a mail client may resolve the same address to a mail server by
          fetching its MX (mail exchanger) record."
          <br />
          <br />
          <h2>ENS History</h2>
          Back in 2013 Vitalik Buterin mentions a similar concept in the{' '}
          <a
            target='_blank'
            rel='noreferrer'
            href='https://blockchainlab.com/pdf/Ethereum_white_paper-a_next_generation_smart_contract_and_decentralized_application_platform-vitalik-buterin.pdf'
          >
            Ethereum Whitepaper
          </a>{' '}
          which he called Namecoin. In April 2016 Nick Johnson submitted a proosal to the Ethereum
          improvement process{' '}
          <a target='_blank' rel='noreferrer' href='https://eips.ethereum.org/EIPS/eip-137'>
            EIP 137
          </a>{' '}
          in which he outlined a first specification for the Ethereum Name Service.
          <br />
          On the{' '}
          <a
            target='_blank'
            rel='noreferrer'
            href='https://medium.com/the-ethereum-name-service/announcing-the-ethereum-name-service-relaunch-date-4390af6dd9a2'
          >
            4th of May, 2017
          </a>{' '}
          Nick Johnsen together with Alex Van de Sande launched the first version of ENS. <br />
          Get the full history <a href='https://wikitia.com/wiki/Ethereum_Name_Service'>here</a>.
          <br />
          <br />
          <h2>Challenge</h2>
          Help Anon Punk by using the{' '}
          <a
            target='_blank'
            rel='noreferrer'
            href=' https://docs.ens.domains/deploying-ens-on-a-private-chain'
          >
            ENS guide
          </a>{' '}
          to deploy a prvate ENS to your local Ethereum network. <br />
          Then{' '}
          <a
            target='_blank'
            rel='noreferrer'
            href=' https://docs.scaffoldeth.io/scaffold-eth/getting-started/installation'
          >
            clone a fresh scaffold-eth project
          </a>{' '}
          and use the{' '}
          <a
            target='_blank'
            rel='noreferrer'
            href='https://docs.ens.domains/dapp-developer-guide/resolving-names'
          >
            ENS guide
          </a>{' '}
          to register and resolve an ens address onyour local chain.
          <>
            <br />
            <br />
            <h2>Further reading</h2>
            <ul>
              <li>
                <a
                  target='_blank'
                  rel='noreferrer'
                  href='https://medium.com/@eric.conner/the-ultimate-guide-to-ens-names-aa541586067a'
                >
                  The Ultimate Guide to ENS Names
                </a>
              </li>
              <li>
                <a
                  target='_blank'
                  rel='noreferrer'
                  href='https://github.com/ensdomains/ens-contracts'
                >
                  ens-contracts
                </a>
              </li>
              <li>
                <a target='_blank' rel='noreferrer' href='https://docs.ens.domains/'>
                  ENS Documentation
                </a>
              </li>
              <li>
                <a target='_blank' rel='noreferrer' href='https://eips.ethereum.org/EIPS/eip-137'>
                  EIP 137
                </a>
              </li>
            </ul>
          </>
        </div>
        <Button
          className='is-warning'
          onClick={() => {
            continueDialog()
            setExplanationWindowVisibility(false)
          }}
        >
          Done
        </Button>
      </div>
    </WindowModal>
  )
}

export default ExplanationWindow
