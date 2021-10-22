pragma solidity <0.8.5;

import "hardhat/console.sol";
import "./YourCollectible.sol";

contract YourToken is YourCollectible {

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event TransferOfERC20(address to, address from, uint256 amount);
    event ApprovalofERC20(address from, address to, uint256 amount);

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    constructor() public {
        _name = "Flemjamins";
        _symbol = "FLEM";
    }

    /**
     * @dev Returns the name of the token.
     */
    function tokenName() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function tokenSymbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function tokenDecimals() public view virtual returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function tokenTotalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function TokenBalanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }
    
    //------------------------------------BURN BABY BURN!---------------------------------------------//

    function burnLoogie(uint256 _loogieTokenId) public {
        uint256 payout = chubbiness[_loogieTokenId]*(10**18)/10;
        console.log(payout);

        //ERC721 _burn function in YourCollectible contract
        _burn(_loogieTokenId);

        // Mint payout to msg.sender
        _tokenMint(msg.sender, payout);
    }

    //----------------------------------------------------------------------------------------------//

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function TokenTransfer(address recipient, uint256 amount) public virtual returns (bool) {
        _tokenTransfer(msg.sender, recipient, amount);
        return true;
    }

    function TokenAllowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function TokenApprove(address spender, uint256 amount) public virtual returns (bool) {
        _tokenApprove(msg.sender, spender, amount);
        return true;
    }

    /**
     *
     *
     * Requirements:
     *
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function TokenTransferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual returns (bool) {
        _tokenTransfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _tokenApprove(sender, msg.sender, currentAllowance - amount);

        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function TokenIncreaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _tokenApprove(msg.sender, spender, _allowances[msg.sender][spender] + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function TokenDecreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        uint256 currentAllowance = _allowances[msg.sender][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
         _tokenApprove(msg.sender, spender, currentAllowance - subtractedValue);

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `sender` to `recipient`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _tokenTransfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;

        emit TransferOfERC20(sender, recipient, amount);

    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _tokenMint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit TransferOfERC20(address(0), account, amount);

    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _tokenBurn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");


        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
         _balances[account] = accountBalance - amount;
        _totalSupply -= amount;

        emit TransferOfERC20(account, address(0), amount);
        
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _tokenApprove(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit ApprovalofERC20(owner, spender, amount);
    }

}
