import InitializeAccount from "./components/InitializeAccount"
import NewUploads from "./components/NewUploads"

function Sell({ initialized = true }): JSX.Element {

  if (!initialized) return <InitializeAccount />

  return (
    <>
      <NewUploads />

    </>
  )
}

export default Sell
