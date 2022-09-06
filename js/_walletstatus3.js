// JavaScript Document
MyLibrary = {"wallet":"0x61418293d8649Cc9066cb103028710253184CE77"};
MyLibrary.network = "0x5"; //goerli 0x5 //kovan: 0x2a
MyLibrary.etherScan = "https://goerli.etherscan.io"; //https://goerli.etherscan.io //https://kovan.etherscan.io/
MyLibrary.decimals = 18;
MyLibrary.tokenAddress = '0xa39182d33FDB94255522B78B1b097961b56046F7';
MyLibrary.liquidity_pool_addy = '0xdC69F4385689b9BEA2446a68C06453FC4A7ab05c'; 
MyLibrary.rbwallet = "0xA66706Ea6EC015a544CA8D5e4dA34Be82f808d57";
MyLibrary.treasurywallet = "0x836a15747a8490D33020b85C19E6ca857D9BAF4C";

MyLibrary.factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";//eth price calc
MyLibrary.uniswapV2router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
MyLibrary.wethAddress = '0xd0A1E359811322d97991E03f863a0C30C2cF029C';//WETH contract address //0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
MyLibrary.UniswapUSDCETH_LP = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";//for calc eth prices: UniswapUSDCETH_LP address
MyLibrary.usdcContractAdd = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";//for calc usd prices
MyLibrary.wethContractAdd = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";//weth contract address for alchemy getassetprices

MyLibrary.RRDay = 6; //Saturday 6, Sunday is 0 in JS...Solidity Library diffrent (Sunday is 7)
MyLibrary.gunBalance = 0;
MyLibrary.ethBalance = 0;
MyLibrary.buyKey = 0;
MyLibrary.sellKey = 0;
MyLibrary.disconnected = 0;
MyLibrary.totalBuyBacks = 0;
MyLibrary.totalBuyBacksEth = 0;
MyLibrary.number_of_buybacks = 0;
MyLibrary.number_of_claims = 0;
MyLibrary.totalSellETHOut = 0; //clear sum for the txtype only on page load
MyLibrary.SellTxsLibrary = []; // global trades array, we will feed objects into it
MyLibrary.BuyBackTxsLibrary = []; // global trades array, we will feed buyback tx objects into it
MyLibrary.AlchemyURL = "https://eth-kovan.alchemyapi.io/v2/1W9ERTKJSE7IB6ydFCa3DVRgq20qCm2I"; //just replace mainnet with kovan
MyLibrary.popuptimer = 20;

MyLibrary.contractABI = [{"inputs":[{"internalType":"addresspayable","name":"_bokkyAdd","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"netamount","type":"uint256"}],"name":"BUYft","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethreceive","type":"uint256"}],"name":"BanditSell","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"torcher","type":"address"},{"indexed":false,"internalType":"uint256","name":"ethbuy","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BuyBack","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"claimer","type":"address"},{"indexed":false,"internalType":"uint256","name":"reflection","type":"uint256"}],"name":"ClaimReflection","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"claimer","type":"address"},{"indexed":true,"internalType":"address","name":"lessor","type":"address"},{"indexed":false,"internalType":"uint256","name":"reflection","type":"uint256"}],"name":"ClaimReflectionLease","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"claimer","type":"address"},{"indexed":true,"internalType":"address","name":"proxy","type":"address"},{"indexed":false,"internalType":"uint256","name":"reflection","type":"uint256"}],"name":"ClaimReflectionStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"investor","type":"address"},{"indexed":true,"internalType":"address","name":"proxy","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DelegateLease","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"investor","type":"address"},{"indexed":true,"internalType":"address","name":"proxy","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DelegateSell","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lessor","type":"address"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"time","type":"uint256"}],"name":"LeaseEnd","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lessor","type":"address"},{"indexed":false,"internalType":"uint256","name":"ethask","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"LeaseList","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lessor","type":"address"},{"indexed":true,"internalType":"address","name":"lessee","type":"address"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"LeaseStart","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lessor","type":"address"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"time","type":"uint256"}],"name":"LeaseUnlist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":true,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":false,"internalType":"bool","name":"sixmonther","type":"bool"}],"name":"Unstaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"loaded","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pulled","type":"uint256"}],"name":"trigger","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"proxy","type":"address"},{"indexed":true,"internalType":"address","name":"investor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unDelegateLease","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"proxy","type":"address"},{"indexed":true,"internalType":"address","name":"investor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unDelegateSell","type":"event"},{"inputs":[],"name":"ScheduledSells","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_RRDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_beneficiaryReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_bokkyAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"swapdeadline","type":"uint256"}],"name":"_bonfireEvent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"_burnAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"swapdeadline","type":"uint256"}],"name":"_buyGuns","outputs":[{"internalType":"uint256","name":"outputTokenCount","type":"uint256"},{"internalType":"uint256","name":"requiredTokens","type":"uint256"},{"internalType":"uint256","name":"balancePending","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"_buyRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_checkOccupiedLease","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"_checkShareReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_checkStakeReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_circSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_claimBeneficiary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"_delegateSell","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"_delegateShares","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_discountRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_ethRewardBasis","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_holders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_lastPlay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_lastRewardBasis","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxHoldings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_monthPlayers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_netEthRewardedBE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_netEthRewardedWallet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_netRewardClaims","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_netRewardsTomyBE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_netRewardsmyDonors","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_pairAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_num","type":"uint256"}],"name":"_playRussianRoulette","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_rebalanceWallet","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_reflectRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rrwinnerRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_sellDelegation","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"swapdeadline","type":"uint256"}],"name":"_sellGuns","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_sellRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_shareDelegation","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sixersLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sixersSlot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"_sixmontherEntry","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"stakedays","type":"uint256"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"_stakeTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_totalBeneficiaryAssigns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalBonfireCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalBuyBackETH","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalDeleLease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalDeleSell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalDonated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalEthRebalanced","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_totalEthReflectedSL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_totalEthReflectedST","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalFeeLiquidated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalLeased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalNVL_dexsell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalNVL_proxysell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalRewardCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalServiceFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_tradingStartBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_treasuryWallet","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"_undelegateSell","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"_undelegateShares","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_useWinnerFees","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"acpt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addBeneficiary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addBot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"addDays","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"addReflectionETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"backEndOdds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimReflection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"addresspayable","name":"lessor","type":"address"}],"name":"claimShareReflection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimStakeReflection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"concludeShareLease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokens","type":"uint256"},{"internalType":"uint256","name":"ethRequired","type":"uint256"},{"internalType":"uint256","name":"lease_days","type":"uint256"}],"name":"createShareLease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"currentDonorRewards","outputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"netreward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"currentRewardForWallet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dateToday","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"daysLeftInMonth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"stamp","type":"uint256"}],"name":"diffDays","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"swap","type":"uint256"}],"name":"fetchSwapAmounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"frontEndOdds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"stamp","type":"uint256"}],"name":"getMonth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getShareLease","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getShareLeases","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_expiryKey","type":"uint256"}],"name":"getSixersExpiring","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getStakeData","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"stamp","type":"uint256"}],"name":"getYear","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isBot","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isTaxExcluded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"tokenprice","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"removeBeneficiary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"discountFee","type":"uint256"}],"name":"setFeeLiqDiscount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxHoldings","type":"uint256"}],"name":"setMaxHoldings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"_odds","type":"uint8"}],"name":"setOdds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"day","type":"uint256"}],"name":"setRRDay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"addresspayable","name":"_rebalance","type":"address"}],"name":"setRebalanceWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"setSellTax","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"setSixersLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"addresspayable","name":"_treasury","type":"address"}],"name":"setTreasuryWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"addresspayable","name":"lessor","type":"address"}],"name":"takeupShareLease","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"start","type":"uint256"}],"name":"tradingStart","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"viewBenefactors","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

MyLibrary.rbwalletABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"currentRBB","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"action","type":"uint256"}],"name":"outofPollRange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pollID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"treasuryVotes","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"buybackVotes","type":"uint256"}],"name":"passedBuyBack","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pollID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"treasuryVotes","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"buybackVotes","type":"uint256"}],"name":"passedTreasury","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"creator","type":"address"},{"indexed":true,"internalType":"uint256","name":"pollID","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"starts","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"expires","type":"uint256"}],"name":"pollCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pollID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"treasuryVotes","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"buybackVotes","type":"uint256"},{"indexed":false,"internalType":"enumTCDRBWallet.PollStatus","name":"status","type":"uint8"}],"name":"pollEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rbBURN","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"torcher","type":"address"},{"indexed":false,"internalType":"uint256","name":"ethbuy","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rbBUYBACK","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"checker","type":"address"},{"indexed":true,"internalType":"uint256","name":"rbb","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"verdict","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"returned","type":"uint256"}],"name":"rbCHECK","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rbTREASURY","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"totalNVL","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"currentBBTotal","type":"uint256"}],"name":"rbbraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"rbb","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rbbmin","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rbbmax","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"call","type":"uint256"}],"name":"rbbs","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":true,"internalType":"uint256","name":"pollID","type":"uint256"},{"indexed":false,"internalType":"string","name":"vote","type":"string"}],"name":"voteCasted","type":"event"},{"inputs":[],"name":"autoRebalancingCheck","outputs":[{"internalType":"bool","name":"voteProceed","type":"bool"},{"internalType":"uint256","name":"rbb","type":"uint256"},{"internalType":"uint256","name":"action","type":"uint256"},{"internalType":"uint256","name":"eth_toDeploy","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"},{"internalType":"bool","name":"_vote","type":"bool"}],"name":"breakImpasse","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"},{"internalType":"bool","name":"_vote","type":"bool"}],"name":"castVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"}],"name":"endPoll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"newPoll","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"frequency","type":"uint256"}],"name":"setFrequency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[{"internalType":"addresspayable","name":"_tokenAdd","type":"address"},{"internalType":"addresspayable","name":"_treasury","type":"address"},{"internalType":"address","name":"_bokkyAdd","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"_amountthruChecks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_amountthruPolls","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"totalNVL","type":"uint256"},{"internalType":"uint256","name":"currentBBTotal","type":"uint256"}],"name":"_buybackTOMAXrbb","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"totalNVL","type":"uint256"},{"internalType":"uint256","name":"currentBBTotal","type":"uint256"}],"name":"_buybackTOMEDIANrbb","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"totalNVL","type":"uint256"},{"internalType":"uint256","name":"currentBBTotal","type":"uint256"}],"name":"_buybackTOMiNrbb","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"_curActivePoll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_ethVotedOn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_firstPoll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"totalNVL","type":"uint256"},{"internalType":"uint256","name":"currentBBTotal","type":"uint256"}],"name":"_foregoreTOMEDIANrbb","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_lastPollTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_minimumVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_pollCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_RBfrequency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rebalancedthruChecks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rebalancedthruPolls","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalAutoRebalancingChecks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalRBW_buybacks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalRBW_treasury","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"blockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bokkyAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dayOfWeek","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"getIfUserHasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"}],"name":"getPoll","outputs":[{"internalType":"uint256","name":"Tvotes","type":"uint256"},{"internalType":"uint256","name":"BBvotes","type":"uint256"},{"internalType":"uint256","name":"rbbATOP","type":"uint256"},{"internalType":"uint256","name":"ethInQ","type":"uint256"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"expire","type":"uint256"},{"internalType":"address","name":"creator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"}],"name":"getPollExpirationTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_voter","type":"address"}],"name":"getPollHistory","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"},{"internalType":"address","name":"_voter","type":"address"}],"name":"getPollInfoForVoter","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"}],"name":"getPollStatus","outputs":[{"internalType":"enumTCDRBWallet.PollStatus","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReserveRequire","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRRarray","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pollID","type":"uint256"}],"name":"getVotersForPoll","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timeA","type":"uint256"}],"name":"hoursAdd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timeA","type":"uint256"}],"name":"hoursDifference","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myVoteString","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"polls","outputs":[{"internalType":"uint256","name":"treasuryVotes","type":"uint256"},{"internalType":"uint256","name":"buybackVotes","type":"uint256"},{"internalType":"uint256","name":"rbb","type":"uint256"},{"internalType":"uint256","name":"ethVotedOn","type":"uint256"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"expiration","type":"uint256"},{"internalType":"enumTCDRBWallet.PollStatus","name":"status","type":"uint8"},{"internalType":"address","name":"creator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rbbLevels","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"treasuryAddress","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

MyLibrary.treasurywalletABI = [{"inputs":[{"internalType":"addresspayable","name":"_tokenAdd","type":"address"},{"internalType":"address","name":"_bokkyAdd","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"setter","type":"address"},{"indexed":true,"internalType":"address","name":"farmer","type":"address"}],"name":"farmerAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"farmer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"farmerWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"requestID","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"ethConsidered","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"availableETH","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lastRequest","type":"uint256"}],"name":"request","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stamper","type":"address"},{"indexed":true,"internalType":"bool","name":"stamp","type":"bool"},{"indexed":true,"internalType":"uint256","name":"requestID","type":"uint256"}],"name":"wdStamp","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"totalNVL","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethConsider","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"NVLgap","type":"uint256"}],"name":"withdrawal","type":"event"},{"inputs":[],"name":"_bufferTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"totalNVL","type":"uint256"},{"internalType":"uint256","name":"currentBBTotal","type":"uint256"}],"name":"_buybackTOMEDIANrbb","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"_coolDownUntilTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_cooldownHours","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_curActiveRequest","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_farmerDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_lastFarmerWithdrawal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_lastRequest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_pollingHours","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_requestCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalFarmerWithdrawals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalRBW_receive","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalRBW_withdrawals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bokkyAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dayOfWeek","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"depositETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"farmerWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"farmerWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_requestID","type":"uint256"}],"name":"getWithdrawalRequest","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"ethRequested","type":"uint256"}],"name":"requestWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"requests","outputs":[{"internalType":"address","name":"requester","type":"address"},{"internalType":"uint256","name":"ethBalance","type":"uint256"},{"internalType":"uint256","name":"ethToConsider","type":"uint256"},{"internalType":"uint256","name":"yesVotes","type":"uint256"},{"internalType":"uint256","name":"noVotes","type":"uint256"},{"internalType":"uint256","name":"gapNVL_BBS","type":"uint256"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"expires","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_hours","type":"uint256"}],"name":"setCooldownHours","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_day","type":"uint256"}],"name":"setFarmerDay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_farmerWallet","type":"address"}],"name":"setFarmerWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_hours","type":"uint256"}],"name":"setPollingHours","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"ethRequested","type":"uint256"}],"name":"skipCoolDown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"stamp","type":"bool"}],"name":"stampWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];

//Initialize B
try{
	if (typeof window.ethereum == 'undefined') {
		swal({title: "Hold on!",type: "error",confirmButtonColor: "#F27474",text: "metamask missing, so is the full experience now..."});
	}else if (typeof window.ethereum !== 'undefined') {
		//Metamask on BROWSER, NOW SET WEB3 PROVIDER
		window.web3 = new Web3(window.ethereum);
		//SET INSTANCE
		var tokenAddress = MyLibrary.tokenAddress;		
		var erc20Abi = MyLibrary.contractABI;
		window.tokenInst = new window.web3.eth.Contract(erc20Abi, tokenAddress);
		//SET INSTANCE rbw
		var rbwAddress = MyLibrary.rbwallet;		
		var rbwalletAbi = MyLibrary.rbwalletABI;
		window.rbw_tokenInst = new window.web3.eth.Contract(rbwalletAbi, rbwAddress);
		//SET INSTANCE treasury
		var treasuryAddress = MyLibrary.treasurywallet;		
		var trwalletAbi = MyLibrary.treasurywalletABI;
		window.tre_tokenInst = new window.web3.eth.Contract(trwalletAbi, treasuryAddress);

		//ERROR HANDLING - doesnt work wait for web3js update, currently throws error: invalid arrayify value (argument="value"
		//web3.eth.handleRevert = true;
	} else {
		console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live");
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		App.web3 = new Web3( new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
	}
}catch(error) {}

//listen
window.addEventListener("load", function() {	
	//## ONE
	window.ethereum.on('connect', function (chainID) {//emitted when Metamask first connects to node
		window.chainID = chainID.chainId; //pull from array
		console.log('current chain:',window.chainID);
	});

	//## TWO - check  + update | detect Metamask account change
	window.currentAccount = null;
	window.ethereum.on('accountsChanged', function (accounts) {
	  console.log('account changed:',accounts);
	  MyLibrary.wallet = accounts[0];
	  if (accounts.length === 0) {
		// MetaMask is locked or the user has not connected any accounts
		console.log('Please connect to MetaMask.');
	  } else if (accounts[0] !== currentAccount) {
		window.currentAccount = accounts[0];
		//1. show account name
		//2. query account balance
		InitialiseConnection();
	  }
	});

	 //## FOUR - check + reload | detect Network account change
	window.ethereum.on('chainChanged', function(networkId){
		console.log('networkChanged:',networkId);
		window.chainID = networkId;
		//alt method> async function chainCheck() {	const chainId = await ethereum.request({ method: 'eth_chainId' });	}
		if(networkId !== MyLibrary.network){
			console.log('reading other chain: '+networkId);
			$('.wallets').css('display', 'none');
			$('.network_switch').css('display', 'inline-block');
		}else if(networkId == MyLibrary.network){
			InitialiseConnection();
			console.log('reading eth mainnet');
		}
	   window.location.reload();
	});
});

//since its on page load, we just show waiting button and hide everything else
//walletcheck will correct this button alignment
$(document).ready(function(e) {
    $('.waiting_init').css('display', 'inline-block');
	InitialiseConnection();
});
//connect wallet click
$(document).on('click','.wallet_connect',function(){
	reqConnect();//ethereum.enable is just like wallet_requestPermissions. https://docs.metamask.io/guide/rpc-api.html#permissions
});
//network switch
$(document).on('click','.network_switch',function(){ //switching to ETH mainnet
	switchNetwork();
});
//disconnect wallet click
$(document).on('click','#wallet_id',function(){
	disconnectwallet();
});
$(document).on('click','#discon',function(){
	
});

async function InitialiseConnection(){
	if(chainCheck()){//correct chain, fetch balances
		currentBlock(); //Fetch current block
		blockTimer = setInterval( function() {currentBlock();}, 40000);
		
		if (await unlockedWallet() === false){
			//reqConnect();
		}else{
			//unlocked proceed, call last initialise function
			walletCheckProceed();
			checks = setInterval( function() {walletCheckProceed();}, 40000);
		}
	}else{//incorrect chain, request switch	
		if(switchNetwork()){//if given
			InitialiseConnection();//recall
		}else{
			//will throw swal error in switchNetwork function
		}		
	}
}
async function unlockedWallet(){//checked 3 ways, internally, in system when unlocked, and with an outside direct all to return true. dont change it.
	var accounts = await window.web3.eth.getAccounts();
	//if we disconnected, freeze data updates
	if (accounts.length > 0) {
		MyLibrary.wallet = accounts[0];
		$('.wallets').css('display', 'none');
		$('.walletpur').css('display', 'inline-block');
		//proceed
		return true;
	}else if(accounts.length == 0 || MyLibrary.disconnected === 1){
		//if locked then hide the details bar and show connect button
		$('.wallets').css('display', 'none');
		$('.wallet_connect').css('display', 'inline-block');
		return false;
	}
}
async function balanceOf(account){
	tokenInst.methods.balanceOf(account).call().then(function (result,error) {
		var decimals = MyLibrary.decimals;
		var balance = (result / Math.pow(10, decimals)).toFixed(2);
		MyLibrary.gunBalance = balance;
		if (!error && result) {
			 var first = account.substring(0, 6);//get first chars
			 var last = account.slice(account.length - 3);//get last chars
			 var privatize = first+'..'+last;
			 $('#wallet_id').empty().append(privatize);
			 $('#wallet_balance').empty().append(balance+' GUN');					 
			 $(".dot").css({'background-color': 'rgb(39, 174, 96)'});
			 return balance;
		 }
		  else {
			console.log(error);
			swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Issue: "+error.message});
		  }//CLOSE IF NO ERROR
	});//CLOSE TOKENINST
}
async function currentBlock(){
	try{//get blocknumber regardless if logged in or not, unlocked or not
		await window.web3.eth.getBlockNumber().then(block => {
		document.getElementById("blocknumber").innerHTML = '<a href="'+MyLibrary.etherScan+'/block/'+block+'" target="_blank">'+block+'</a>';
		});
	} catch (error) {//close try/catch
		console.log(error);
		swal({title: "Offline",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: error});
		$(".dot").css({'background-color': '#ec0624'});
	}	
}
async function chainCheck(){
	await ethereum.request({method: 'eth_chainId' }).then((result) => {chainID = result;})
	if(chainID == MyLibrary.network){//eth chain
		console.log(chainID);
		$('.wallets').css('display', 'none');//hide if succesful
		$('.waiting_init').css('display', 'inline-block');
		return true;
	}else if(chainID !== MyLibrary.network){//wrong network
		console.log('wrong chain: '+chainID);
		$('.wallets').css('display', 'none');
		$('.network_switch').css('display', 'inline-block');
		return false;
	}
}
async function switchNetwork() {
	if (window.ethereum) {
		try {// check if the chain to connect to is installed
			await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
			});
		} catch (error) {
			// This error code indicates that the chain has not been added to MetaMask
			if (error.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [
							{	chainId: '0x1',
								chainName: 'Ethereum Mainnet',
								nativeCurrency: {
									name: 'Ethereum',
									symbol: 'ETH', // 2-6 characters long
									decimals: 18
								},
								blockExplorerUrls: [MyLibrary.etherScan],
								rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
							},
						],
					});
					//added, now show connect button parent cont
					$('.wallets').css('display', 'none');
					//show wallet connect button parent
					$('.walletpur').css('display', 'inline-block');
					//proceed to fetch wallet Info
					InitialiseConnection();
				} catch (addError) {
					console.log(addError);//user refused to add network
					$('.network_switch').css('display', 'inline-block');//show if unsuccesful
					swal({
						title: "",
						text: "Please Switch Network",
						type: "info",  //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
						html: false,
								  dangerMode: false,
								  confirmButtonText: "switch",
								  cancelButtonText: "cancel",
						showConfirmButton: true,
						showCancelButton: true,
						timer: 4000,
						animation: "slide-from-top"
						
					},function(){//on confirm click
						switchNetwork();
					});
					return false;
				}
			}else{
				console.log(error);//user refused to switch
				$('.network_switch').css('display', 'inline-block');//show if unsuccesful
				return false;
			}	
		}//catch close	  
	} else {
	  swal({title: "Hold on!",type: "error",confirmButtonColor: "#F27474",text: "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"});
	}
}

async function disconnectwallet(){
		
	await window.web3.eth.getAccounts().then(it => {
		account = it[0]; 
		accounts = it;
	}); //our default account inside metamask
	
	if (accounts.length === 0) {
		console.log('MetaMask is locked');
		swal({title: "Failed.",type: "error",confirmButtonColor: "#F27474",text: "Error: Metamask is locked"});
	}else {
		console.log('MetaMask is unlocked');
		var first = account.substring(0, 8);//get first 5 chars
		var last = account.slice(account.length - 5);//get last 5
		var privatize = first+'...'+last;
		var disconnect = '<div class="stakesuccess"><span class="stakesuccessnotice"><p>Currently connected</p></span><span class="stakesuccessduration">'+privatize+'</span><span class="stakesuccessetherscan"><img src="img/external.svg" /><a target="_blank" href="'+MyLibrary.etherScan+'/address/'+account+'">View on Etherscan</a></span></div><span id="discon"></span>';
		swal({
		title: "ERC20 Wallet:",
		text: disconnect,
		html: true,
		showCancelButton: true,
		dangerMode: true,
		confirmButtonText: "disconnect",
		cancelButtonText: "cancel",
		confirmButtonColor: "#F27474",
		closeOnConfirm: false
		},function () {//on confirm click
			LockUp();
			swal({
				  title: "wallet disconnected!",
				  text: privatize,
				  type: "success",
				  html: false,
				  showConfirmButton: true,
				  showCancelButton: false,
				  timer: 4000,
				  animation: "slide-from-top"
			},function(){	});//inner swal close
		});//outer swal close
	}//close account.length else
}//close disconnectwallet

function reqConnect() {//not async, the alt approach script with .send({ method: 'wallet_requestPermissions', params:...... uses await
	ethereum.request({
	  method: 'wallet_requestPermissions',
	  params: [{ eth_accounts: {} }],
	})
	.then((permissions) => {
	  const accountsPermission = permissions.find((permission) => permission.parentCapability === 'eth_accounts');
	  if (accountsPermission) {
		  MyLibrary.disconnected = 0;//1 is true, 0 is false
		  console.log('eth_accounts permission successfully requested!  set: '+MyLibrary.disconnected);
		  InitialiseConnection();//switch buttons and fetch balances
	  }
	  return true;
	})
	.catch((error) => {
		if (error.code === 4001) {
			// EIP-1193 userRejectedRequest error
			console.log('Permissions needed to continue.');
			swal({
			  title: "",
			  text: "Permissions needed on dashboard..",
			  type: "info",  //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
			  html: false,
						dangerMode: false,
						confirmButtonText: "try again",
						cancelButtonText: "cancel",
			  showConfirmButton: true,
			  showCancelButton: true,
			  timer: 4000,
			  animation: "slide-from-top"
			  
			},function(){//on confirm click
				console.log('permissions retry...');
				reqConnect();
			});//inner swal close
		} else {
			console.log(error);
		}
		return false;
	});
}

async function walletCheckProceed() {
	
	//GET TOKEN DECIMALS
	try{
		MyLibrary.decimals = await tokenInst.methods.decimals().call();			
	} catch (error) {//close try/catch
		console.log(error); 
	}			
	
	//GET ACCOUNTS, IF LOCKED THEN SKIP
	try{
		var account = MyLibrary.wallet;
		balanceOf(MyLibrary.wallet);
	}catch(error){
		console.log("Metamask Locked");
	}

	return true;
}
//ON LOCK ACCOUNT CLICK
async function LockUp(){
	MyLibrary.wallet = '0x';//remove all accounts from dom. wait for reinitialise
	
	MyLibrary.disconnected = 1;//1 is true, 0 is false
	
	//fire wallet check to flash out address in elements
	InitialiseConnection();
}
//Idle Helper
async function isMetaMaskConnected() {
	const {ethereum} = window;
	const accounts = await ethereum.request({method: 'eth_accounts'});
	return accounts && accounts.length > 0;
}

async function popupSuccess(type, currency, Txhash, title, amountEth, amountTokens, wallet, nonTxAction){	//format: title, amounts{eth}, amountsT{tokens} - human readable amounts only not BN
	//reset
	MyLibrary.popuptimer = 20;
	$("#popupNotify, #pNt").removeAttr("style");
	$('#pNt').css({'width':'100% !important'});
	$('#pNotifyX').click();	
	//add values
	$('#popupTitle').empty().append(title);//title
	if(currency == 'GUN'){
		$('#popupAmounts').empty().append(Number(amountTokens).toLocaleString()+' '+currency);//body amounts
	}else if(currency == 'ETH'){
		$('#popupAmounts').empty().append(amountEth+' '+currency);//body amounts
	}else{
		if(nonTxAction.length >2){//ignore Transaction based message, show action-perfomed based message
			$('#popupAmounts').empty().append(nonTxAction);
		}else{
			
		}	
	}
	$('#popupTxhash').empty().append('<a href="'+MyLibrary.etherScan+'/tx/'+Txhash+'" target="_blank">View Transaction on EtherScan..</a>');
	$('#popupNotify').css('display', 'flex');
	
	MyLibrary.resumeclock = MyLibrary.popuptimer*1000;
	$('#pNt').animate({width: "0px"}, MyLibrary.resumeclock, "swing", function(){		$('#pNotifyX').click();		});
}
function decrementSeconds() { 
	if(MyLibrary.popuptimer <= 0){
		MyLibrary.popuptimer = 0;
		console.log('decrement stopped: '+MyLibrary.popuptimer);
	}else{
		MyLibrary.popuptimer -= 1;
	}
}
//Tokens unrounded
function fromWeiToFixed2_unrounded(amount) {//doesnt round up figures
	var amount = amount / Math.pow(10, MyLibrary.decimals);
	var fixed = 2;
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return amount.toString().match(re)[0];
}
//ETH unrounded
function toFixed8_unrounded(amount) {
	//accepts decimals
	var parsed_eth = parseFloat(amount);
	var fixed = 8;//8 is good for all esp RBW
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return parsed_eth.toString().match(re)[0];
}
function fromWeiToFixed5_unrounded(amount) {//doesnt round up figures
	//accepts wei only not decimals, also no need to string wei
	var raw_eth = web3.utils.fromWei(amount, "ether");
	var parsed_eth = parseFloat(raw_eth);
	var fixed = 6;//6 is good for all esp RBW
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return parsed_eth.toString().match(re)[0];
}
function fromWeiToFixed8_unrounded(amount) {//doesnt round up figures
	//accepts wei only not decimals, also no need to string wei
	var raw_eth = web3.utils.fromWei(amount, "ether");
	var parsed_eth = parseFloat(raw_eth);
	var fixed = 8;
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return parsed_eth.toString().match(re)[0];
}
function fromWeiToFixed8(amount){
	var raw_eth = web3.utils.fromWei(amount, "ether");
	var parsed_eth = parseFloat(raw_eth);
	var ethFriendly = parsed_eth.toFixed(8);
	return ethFriendly;
}
function fromWeiToFixed12(amount){
	var raw_eth = web3.utils.fromWei(amount, "ether");
	var parsed_eth = parseFloat(raw_eth);
	var ethFriendly = parsed_eth.toFixed(12);
	return ethFriendly;
}
function fromWeiToFixed5(amount){
	var raw_eth = web3.utils.fromWei(amount, "ether");
	var parsed_eth = parseFloat(raw_eth);
	var ethFriendly = parsed_eth.toFixed(6);//6 is good for all esp RBW
	return ethFriendly;
}
//WINDOW EVENTS
$(document).on('click', '#pNotifyX', function(e){
	$('#pNt').stop(true,true);//stopAll,goToEnd defaults are false. stopall clears animation queue if any, gotoend skips to end of animation
	$("#popupNotify").removeAttr("style");
	$("#pNt").removeAttr("style");
	$('#popupNotify').css({'display' : 'none'});
});

$(document).ready(function(){
	var popup = document.getElementById("popupNotify");
	popup.addEventListener("mouseover", function (event) {
		isMouseHover = true;//console.log(isMouseHover);
		if (typeof window.pauseCount === 'undefined') {//pause once instead of play once
			$('#pNt').stop(true);//stop (animation, clear queue of animations on element, jump to end of animation)
			var x = $('#pNt').width();
			var countdown = (x) / 280 * 10;
			MyLibrary.popuptimer = countdown;
		}else{ }	
	}, false);
	popup.addEventListener("mouseleave", function (event) {
	  isMouseHover = false;//console.log(isMouseHover);
	  	var resumeclock = MyLibrary.popuptimer*1000;
		if(MyLibrary.popuptimer > 0){	//only if theres something to resume
			$('#pNt').animate({width: "0px"}, resumeclock, "swing", function(){	$('#pNotifyX').click();	});
		}else{ }
		window.pauseCount=1;//pause once
	}, false);
});


/*
//OLD FIRST
function reqConnect() {
	ethereum.request({
	  method: 'wallet_requestPermissions',
	  params: [{ eth_accounts: {} }],
	})
	.then((permissions) => {
	  const accountsPermission = permissions.find((permission) => permission.parentCapability === 'eth_accounts');
	  if (accountsPermission) {
		  MyLibrary.disconnected = 0;//1 is true, 0 is false
		  console.log('eth_accounts permission successfully requested!  set: '+disconnected);
		  var disconnected = MyLibrary.disconnected;
		  walletCheck(disconnected);//swicth buttons and fecth balances
		  return true;
	  }
	})
	.catch((error) => {
	  if (error.code === 4001) {
		// EIP-1193 userRejectedRequest error
		console.log('Permissions needed to continue.');
		swal({
			  title: "",
			  text: "Permissions needed on dashboard..",
			  type: "info",  //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
			  html: false,
						dangerMode: false,
						confirmButtonText: "try again",
						cancelButtonText: "cancel",
			  showConfirmButton: true,
			  showCancelButton: true,
			  timer: 4000,
			  animation: "slide-from-top"
			  
		},function(){//on confirm click
			console.log('fetch retry...');
			reqConnect();
		});//inner swal close
		return false;
	  } else {
		console.log(error);
	  }
	});
}

//NEW WITHOUT CALLBACK - breaks system as it returns nothing on permission rejection
async function reqConnect() {

	var permissions = await ethereum.request({method: 'wallet_requestPermissions',params: [{ eth_accounts: {} }]});//alt<use with .then callback> var permissions = await ethereum.send({method: 'wallet_requestPermissions',params: [{'eth_accounts': {},}]});
	//str = JSON.stringify(permissions);//str = JSON.stringify(permissions, null, 4); // (Optional) beautiful indented output.
	//console.log(str[0].parentCapability); // Logs output to dev tools console.alert(str); // Displays output using window.alert()
	//NOTE: IF USER REJECTS WE WONT REACH HERE SINCE THERE IS NO FALL BACK ON OUR REQUEST (ethereum.send() was depracated and shows this callback error now)

	if (permissions[0].parentCapability == 'eth_accounts'){ //alert(permissions[0].parentCapability);
		MyLibrary.disconnected = 0;//1 is true, 0 is false
		walletCheck(MyLibrary.disconnected);//switch buttons and fecth balances
		return true;
	}else{alert(permissions.code);
		if (permissions.code == 4001) {
			// EIP-1193 userRejectedRequest error
			console.log('Permissions needed to continue.');
			swal({
				  title: "",
				  text: "Permissions needed on dashboard..",
				  type: "info",  //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
				  html: false,
							dangerMode: false,
							confirmButtonText: "try again",
							cancelButtonText: "cancel",
				  showConfirmButton: true,
				  showCancelButton: true,
				  timer: 4000,
				  animation: "slide-from-top"
				  
			},function(){//on confirm click
				console.log('fetch retry...');
				reqConnect();
			});//inner swal close
			
		  } else {
			console.log('error: '+error);
		  }
		return false;
	}
	
}
*/