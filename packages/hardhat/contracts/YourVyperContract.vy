# @version ^0.3.3

event SetPurpose:
    sender: address
    purpose: String[100]

purpose: public(String[100])

@external
@payable
def __init__():
  # what should we do on deploy?
  self.purpose = "Building Unstoppable Apps!!!"

@external
def setPurpose(newPurpose: String[100]):
  self.purpose = newPurpose
  log SetPurpose(msg.sender, self.purpose)

@external
@payable
def __default__():
  # to support receiving ETH by default
  assert True