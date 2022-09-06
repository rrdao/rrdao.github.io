// Calls
$(document).ready(async function(){
	//proceed
	var unlockState = await unlockedWallet();
	if (unlockState === true){
		callPageTries();
		//repeat, with async and promise so it dont overspill
		const setbankIntervalAsync = (fn, ms) => {
			fn().then(() => {
				setTimeout(() => setbankIntervalAsync(fn, ms), ms);
			});
		};
		setbankIntervalAsync(async () => {
			callPageTries();
		}, 30000);
		
	}else{
		reqConnect();
	}	
});

/*
PAGE'S CUSTOM TRIES: each page's callPageTries()
=========================================================================*/
async function callPageTries(){
	
	//market cap: circ supply = total supply - burnt
	try{
		var result = await tokenInst.methods._circSupply().call();
		var circ_supply = parseFloat(result / Math.pow(10, MyLibrary.decimals));
		var price = await tokenETHprice();
		var marketcap = (circ_supply * price * await ETHUSDprice()).toFixed(2);
		$("#mbcard_cap").empty().append('$'+Number(marketcap).toLocaleString()); 
		$("#mbcard_capdet").empty().append(Number(circ_supply).toLocaleString() + ' circ * ' + price + ' eth'); 

	}catch(error) {
		console.log(error);
	}
	
	//Fee Tokens
	try{
		var totalservicefees = await tokenInst.methods._totalServiceFees().call();
		var totalservicefees = parseFloat(totalservicefees / Math.pow(10, MyLibrary.decimals));

		var totalliquidated = await tokenInst.methods._totalFeeLiquidated().call();
		var totalliquidated = parseFloat(totalliquidated / Math.pow(10, MyLibrary.decimals));

		var earnedFromBuyProxy = await tokenInst.methods._totalEthRebalanced().call()
		var earnedFromBuyProxy = fromWeiToFixed5(earnedFromBuyProxy);
		//prep display
		var totalFeeTokens = (totalservicefees + totalliquidated).toFixed(2);
		var totalliquidated = totalliquidated.toFixed(2);

		$('#mbcard_feet').empty().append(Number(totalFeeTokens).toLocaleString() + ' earned (' + totalliquidated + ' cashed in)');
		$('#mbcard_feetdet').empty().append(earnedFromBuyProxy + ' eth proxy-buy earnings');
			
	}catch(error) {
		console.log(error); 
	}

	//Burnt Tokens
	try{
		//balance from zero address
		var totalburnt = await tokenInst.methods.balanceOf("0x000000000000000000000000000000000000dEaD").call();
		var totalburnt = (totalburnt / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var totalburnt = parseFloat(totalburnt);

		var totalburntequiv = await tokenInst.methods._totalBuyBackETH().call();
		var totalburntequiv = fromWeiToFixed8(totalburntequiv);

		var totalbornfires = await tokenInst.methods._totalBonfireCount().call();
		var totalbornfires = parseFloat(totalbornfires);
		//prep display
		$('#mbcard_bf').empty().append(Number(totalburnt).toLocaleString());
		$('#mbcard_bfdet').empty().append(totalburntequiv + ' eth (' + totalbornfires + ' bonfires)');
			
	}catch(error) {
		console.log(error); 
	}

	//Rewards
	try{
		var totalrewardsissued = await tokenInst.methods._ethRewardBasis().call();
		var totalrewardsissued = fromWeiToFixed8(totalrewardsissued);

		var totalclaimed = await tokenInst.methods._netRewardClaims().call();
		var totalclaimed = fromWeiToFixed8(totalclaimed);
		//prep display
		$('#mbcard_rew').empty().append(totalrewardsissued + ' eth issued');
		$('#mbcard_rewdet').empty().append(totalclaimed + ' eth claimed');
			
	}catch(error) {
		console.log(error); 
	}
	
	//Rebalanced
	try{//collected eth
		var totalBBS = await rbw_tokenInst.methods._totalRBW_buybacks().call();
		var totalBBS = parseFloat(totalBBS);
		var totalTRE = await rbw_tokenInst.methods._totalRBW_treasury().call();
		var totalTRE = parseFloat(totalTRE);
		var totalrebalanced = String(totalTRE + totalBBS);
		var totalrebalanced = fromWeiToFixed8(totalrebalanced);
		var rebalancingevents = await rbw_tokenInst.methods._totalAutoRebalancingChecks().call();
		var rebalancingevents = parseFloat(rebalancingevents);

		//eth value rebalanced
		var amountthruPolls = await rbw_tokenInst.methods._amountthruPolls().call(); 
		var amountthruPolls = parseFloat(amountthruPolls);
		var amountthruChecks = await rbw_tokenInst.methods._amountthruChecks().call();
		var amountthruChecks = parseFloat(amountthruChecks);
		var amountthruPolls = String(amountthruPolls);
		var amountthruPolls = fromWeiToFixed5_unrounded(amountthruPolls);
		var amountthruChecks = String(amountthruChecks);
		var amountthruChecks = fromWeiToFixed5_unrounded(amountthruChecks);
		//events count
		var eventsthruAutocheks = await rbw_tokenInst.methods._rebalancedthruChecks().call();
		var thruAutocheks = parseFloat(eventsthruAutocheks);
		var eventsthruPolls = await rbw_tokenInst.methods._rebalancedthruPolls().call();
		var thruPolls = parseFloat(eventsthruPolls);
		//prep display
		$('#mbcard_reb').empty().append(totalrebalanced + ' eth dispersed\n' + amountthruPolls + ' eth polls | ' + amountthruChecks + ' eth auto-checks');
		$('#mbcard_rebdet').empty().append(rebalancingevents + ' events\n' + thruPolls + ' via Polls | ' + thruAutocheks + ' via auto-checks');
	}catch(error) {
		console.log(error); 
	}

	//Treasury
	try{
		var totalrebalancedTr = await rbw_tokenInst.methods._totalRBW_treasury().call();
		var totalrebalancedTr = fromWeiToFixed5(totalrebalancedTr);

		var totalwithdrawalsTr = await tre_tokenInst.methods._totalRBW_withdrawals().call();
		var totalwithdrawalsTr = fromWeiToFixed5(totalwithdrawalsTr);
		//prep display
		$('#mbcard_tre').empty().append(totalrebalancedTr + ' eth collected');
		$('#mbcard_tredet').empty().append(totalwithdrawalsTr + ' eth withdrawn back by RBW');
	}catch(error) {
		console.log(error); 
	}

	//Farmer wallet
	try{
		var farmerWallet = await tre_tokenInst.methods.farmerWallet().call();
		var first = farmerWallet.substring(0, 8);//get first 5 chars
			var last = farmerWallet.slice(farmerWallet.length - 5);//get last 5
			var trancatedAdd = first+'...'+last;
		var totalwithdrawals = await tre_tokenInst.methods._totalFarmerWithdrawals().call();
		var totalwithdrawalsFarmer = fromWeiToFixed5(totalwithdrawals);
		
		var lastwithdrawal = await tre_tokenInst.methods._lastFarmerWithdrawal().call();
		var lastwithdrawal = new Date(lastwithdrawal * 1000).toLocaleString([],{month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false});
		//prep display
		$('#mbcard_farm').empty().append(trancatedAdd);
		$('#mbcard_farmdet').empty().append(totalwithdrawalsFarmer + ' eth withdrawn (last: ' + lastwithdrawal + ')');
	}catch(error) {
		console.log(error); 
	}
	
	//Russian Roulette Winners / scheduled
	try{
		var monthPlayers = await tokenInst.methods._monthPlayers().call();
		var monthPlayers = parseFloat(monthPlayers);

		var arrayWinners = await tokenInst.methods.ScheduledSells().call();
		var number_of = arrayWinners.length;
		MyLibrary.winnersTokens = 0;

		//add value of tokens they hold
		if(number_of > 0){
			let array = arrayWinners;
			for (const lease of array){
				var walletbalance = await tokenInst.methods.balanceOf(lease).call();
				var walletbalance = (walletbalance / Math.pow(10, MyLibrary.decimals)).toFixed(4);
				MyLibrary.winnersTokens += parseFloat(walletbalance);//float so we can add
				//console.log(MyLibrary.winnersTokens)
			}
			var ethTotal = MyLibrary.winnersTokens * price;//price parsed already
			var ethTotal = ethTotal.toFixed(5);
			//display
			$('#mbcard_ruro').empty().append(number_of + ' scheduled this month ('+monthPlayers+' played)');
			$('#mbcard_rurodet').empty().append(ethTotal + ' eth worth of tokens');
		}else if(number_of == 0){
			$('#mbcard_ruro').empty().append(number_of + ' scheduled this month ('+monthPlayers+' played)');
			$('#mbcard_rurodet').empty().append(0 + ' eth worth of tokens');
		}
	}catch(error) {
		console.log(error); 
	}

	//Sixers maturing / scheduled
	try{
		//maturity key is: year 4 digit * month (1-12)
		var currentYear = new Date().getFullYear();
		var currentMonth = new Date().getMonth();
		var maturityKey = currentYear * currentMonth;
		var maturityKey = web3.utils.toBN(maturityKey);

		var monthSixersArray = await tokenInst.methods.getSixersExpiring(maturityKey).call();
		var number_of = monthSixersArray.length;
		MyLibrary.sixersTokens = 0;

		//add value of tokens they hold
		if(number_of > 0){
			let array = monthSixersArray;
			for (const lease of array){
				var walletbalance = await tokenInst.methods.balanceOf(lease).call();
				var walletbalance = (walletbalance / Math.pow(10, MyLibrary.decimals)).toFixed(4);
				MyLibrary.sixersTokens += parseFloat(walletbalance);//float so we can add
				//console.log(MyLibrary.sixersTokens)
			}
			var ethTotal = MyLibrary.sixersTokens * price;//price parsed already
			var ethTotal = ethTotal.toFixed(5);
			//display
			$('#mbcard_sixer').empty().append(number_of + ' sixers maturing this month');
			$('#mbcard_sixerdet').empty().append(ethTotal.toFixed(5) + ' eth worth');
		}else if(number_of == 0){
			$('#mbcard_sixer').empty().append(number_of + ' sixers maturing this month');
			$('#mbcard_sixerdet').empty().append(0 + ' eth worth');
		}
	}catch(error) {
		console.log(error); 
	}

	//Leases
	try{
		var totalleased = await tokenInst.methods._totalLeased().call();
		var totalleased = (totalleased / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var shareleasesArray = await tokenInst.methods.getShareLeases().call();
		var number_of = shareleasesArray.length;
		MyLibrary.leaseTokens = 0;

		//add value of tokens they hold
		if(number_of > 0){
			let array = shareleasesArray;
			for (const lease of array){
				var walletbalance = await tokenInst.methods.balanceOf(lease).call();
				var walletbalance = (walletbalance / Math.pow(10, MyLibrary.decimals)).toFixed(4);
				MyLibrary.leaseTokens += parseFloat(walletbalance);//float so we can add
				//console.log(MyLibrary.leaseTokens)
			}
			var ethTotal = MyLibrary.leaseTokens * price;//price parsed already
			var ethTotal = ethTotal.toFixed(5);
			//display
			$('#mbcard_leased').empty().append(Number(totalleased).toLocaleString() + ' leased tokens ('+number_of+' leases)');
			$('#mbcard_leaseddet').empty().append(ethTotal + ' eth worth');
		}else if(number_of == 0){
			$('#mbcard_leased').empty().append(Number(totalleased).toLocaleString() + ' leased tokens ('+number_of+' leases)');
			$('#mbcard_leaseddet').empty().append(0 + ' eth worth');
		}
		
	}catch(error) {
		console.log(error);
	}

	//Staked
	try{
		var totalstaked = await tokenInst.methods._totalStaked().call();
		var totalstaked = (totalstaked / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var ethTotal = parseFloat(totalstaked) * price;
		//prep display
		$('#mbcard_sta').empty().append(Number(totalstaked).toLocaleString() + ' staked tokens');
		$('#mbcard_stadet').empty().append(ethTotal.toFixed(5) + ' eth worth');
	}catch(error) {
		console.log(error); 
	}

	//Beneficiaries volume
	try{
		var totalAssignments = await tokenInst.methods._totalBeneficiaryAssigns().call();
		var totalAssignments = parseFloat(totalAssignments);

		var totalclaimed = await tokenInst.methods._beneficiaryReward().call();
		var totalclaimed = fromWeiToFixed5(totalclaimed);
		//prep display
		$('#mbcard_ben').empty().append(totalAssignments + ' beneficiary assignments');
		$('#mbcard_bendet').empty().append(totalclaimed + ' eth claimed');
	}catch(error) {
		console.log(error); 
	}

	//Donations volume
	try{
		var totalDonations = await tokenInst.methods._totalDonated().call();
		var totalDonations = fromWeiToFixed5(totalDonations);

		var donationscount = await tokenInst.methods._totalRewardCount().call();
		var donationscount = parseFloat(donationscount);
		//prep display
		$('#mbcard_dona').empty().append(totalDonations + ' eth donated');
		$('#mbcard_donadet').empty().append(donationscount + ' donations');
	}catch(error) {
		console.log(error); 
	}
	
}

async function tokenETHprice(){
	try {
		var price = await tokenInst.methods.price().call();
		var pricein_eth = fromWeiToFixed12(price);
		return pricein_eth;
	}catch(error){
		return 0;
	}
}
async function ETHUSDprice(){
	/*
	//PS no Kovan ETHUSDC LP it was closed, will point to one in Mainnet
	//Manual addresses for now, using MyLibrary gives error somehow
	const UNISWAP_FACTORY_ADDR = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
	const USDC = MyLibrary.usdcContractAdd;
	const WETH = MyLibrary.wethAddress;
	var uniswapAbi = [{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]; // get the abi from https://etherscan.io/address/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc#code
	var factoryABI = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
	var factory = new web3.eth.Contract(factoryABI, UNISWAP_FACTORY_ADDR);
  	var pairAddress = await factory.methods.getPair(WETH, USDC).call();
	  //alert(pairAddress) //should return valid address not 0x00
	var pair = new web3.eth.Contract(uniswapAbi, pairAddress);
	var reserves = await pair.methods.getReserves().call();
	console.log(pairAddress);
	console.log(reserves);
	console.log(reserves[1] / (reserves[0] * 1e12));
	*/
	return 1100;//for now
	
}
