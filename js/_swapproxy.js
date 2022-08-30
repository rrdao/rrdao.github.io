//Initialize variables
MyLibrary.Swap_state = "buy";

function shuffleAmounts(){
	var tokenAAamount = $("#tokenAamount").val();//eth at top default is buy
	var tokenBBamount = $("#tokenBamount").val();//token at bottom 
	
	var aaaBalance = document.getElementById("aaa_balance").innerHTML;
	var bbbBalance = document.getElementById("bbb_balance").innerHTML;
	
	var aaa_name = document.getElementById("token_aaa").innerHTML;
	var bbb_name = document.getElementById("token_bbb").innerHTML;
	
	//swap values
	document.getElementById("tokenAamount").value = tokenBBamount;//input
	document.getElementById("tokenBamount").value = tokenAAamount;
		
	document.getElementById("aaa_balance").textContent = bbbBalance;//heading-value
	document.getElementById("bbb_balance").textContent = aaaBalance;
	
	document.getElementById("token_aaa").innerHTML = bbb_name;//heading-tokenname
	document.getElementById("token_bbb").innerHTML = aaa_name;
}
async function sellInfoState(){
	MyLibrary.Swap_state = "sell";
	$("#switch").attr('class', 'switchsell');
	$('.buyNstake').css('display', 'none');
	//change icons
	$('#tokenAicon').css({"background-image":"url(img/logo.png)", "background-size":"cover"});
	$('#tokenBicon').css({"background-image":"url(img/eth.png)", "background-size":"32px"});

	//run tax and limits checks and warnings on what will happen / be lost
	var sellTax = await tokenInst.methods._sellRate().call();
	var winnerTax = await tokenInst.methods._rrwinnerRate().call();
	var eligibility = await tokenInst.methods.isTaxExcluded(MyLibrary.wallet).call();
	var RRday = await tokenInst.methods._RRDay().call();
	var delegatedBal = await tokenInst.methods._sellDelegation(MyLibrary.wallet).call();
	var delegatedBal = fromWeiToFixed2_unrounded(delegatedBal);

	var price = await tokenETHprice();//parsed return
	var acpt = await averageCost();//parsed return
	var RRday = parseInt(RRday);

	var acpt_gainmark = 'markgreen';
	if(price < acpt){
		acpt_gainmark = 'markred';
	}
	if(RRday == 1){var Tax = winnerTax; var Tax_residue = 100 - sellTax;}else{ var Tax = sellTax; var Tax_residue = 100 - sellTax;}
	//OUTPUT
	var delegated = '<span class="status status_pre"><p>Sell Delegated: \n'+delegatedBal+' GUN</p></span>';
	var currentACPT = '<span class="status status_pre '+acpt_gainmark+'"><p>ACPT: '+acpt+'</p></span>';
	var message = '<span class="status"><p>Consider Share Leasing, DCFs or Russian Roulette instead.<br><br>Selling at high tax is costly: You leave <span class="markred TaxInfo">'+Tax_residue+'%</span> of your Eth in the LP, lose voting rights, lose future rewards, etc..</p></span>';
	
	if(eligibility == true){
		var date = getFirstDayOfNextMonth();
		var winner = '<span class="status markgreen"><p><b>Scheduled 10% Sell!</b></p></span>';
		var winnerText = '<span class="status"><p>Scheduled for <b>'+winnerTax+'% Tax on Saturday,</b> usable in <b>1 Sell Transaction</p></span>';
		var message = '<span class="status"><p>Consider Share Leasing or DCFs. By selling you leave <span class="markred TaxInfo">'+Tax_residue+'%</span> of your Eth in the LP, lose voting rights, lose future rewards, etc..</p></span>';
		var currentTax = '<span class="status markred"><p><b>Sell Tax:</b> '+Tax+'%</p></span>';
		$('#swapInfo_body').empty().prepend(winner+winnerText+delegated+currentTax+currentACPT+message);
	}else{
		var currentTax = '<span class="status markred"><p><b>Sell Tax:</b> '+Tax+'% incl</p></span>';
		$('#swapInfo').animate({height: "auto"}, 1000, "swing", function(){});
		$('#swapInfo_body').empty().prepend(delegated+currentTax+currentACPT+message);
	}
}
async function buyInfoState(){
	MyLibrary.Swap_state = "buy";
	$("#switch").attr('class', 'switchbuy');
	$('.buyNstake').css('display', 'block');
	//change icons
	$('#tokenBicon').css({"background-image":"url(img/logo.png)", "background-size":"cover"});
	$('#tokenAicon').css({"background-image":"url(img/eth.png)", "background-size":"32px"});

	//run tax and limits checks and congratulations on what will be gained
	var buyTax = MyLibrary.buyRate = await tokenInst.methods._buyRate().call();
	var maxHoldings = await tokenInst.methods._maxHoldings().call();
	var maxHoldings = (maxHoldings / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	var serviceTokens = await tokenInst.methods._totalServiceFees().call();
	var totalServiceFees = (serviceTokens / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	
	var price = await tokenETHprice();//parsed return
	var acpt = await averageCost();//parsed return
	
	var acpt_gainmark = 'markgreen';
	if(price > acpt){
		acpt_gainmark = 'markred';
	}
	
	//OUTPUT
	var bonusInfor = '';
	if(totalServiceFees > 0){
		var bonusInfor = '<div id="bonusSitu" class="status markgreen"><span><b>Fees Pool:</b> '+totalServiceFees+'</span></div>';
		$('#shareLSitu').hide();
	}
	var maxHoldings = '<span class="status status_pre"><p><b>Max Holdings:\n</b>'+maxHoldings+' GUN</p></span>';
	var currentACPT = '<span class="status status_pre '+acpt_gainmark+'"><p><b>ACPT:</b> '+acpt+'</p></span>';
	var message = '<span id="shareLSitu" class="status"><p>Try Share Leasing your tokens and get more out of them.</p><p id="buynstakeSuggestion">Buy and stake for 6 months to automatically Schedule Low Tax Sell <span class="markgreen TaxInfo">10%</span> sell tax.</p></span>';
	var currentTax = '<span class="status markgreen"><p><b>Buy Tax:</b> '+buyTax+'% incl</p></span>';
	$('#swapInfo').animate({height: "auto"}, 1000, "swing", function(){});
	$('#swapInfo_body').empty().prepend(currentTax+bonusInfor+message+maxHoldings+currentACPT);
}
async function averageCost(){
	var balance = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
	var balance = (balance / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	var balance = parseFloat(balance);//float so we can add the values not append
	if(balance > 0){//hate seeing the revert error so only if the user bought some(not perfect)
		try{
			var acpt = await tokenInst.methods.acpt(MyLibrary.wallet).call();
			var acpt = web3.utils.fromWei(acpt, "ether");
			var acpt = Number(acpt).toFixed(12);
			return acpt;	
		}catch (error) {
			//console.log(error.data);
			return 0;
		}
	}else{
		return 0;
	}
	
}
//Swap card balances
async function balances(){	
	if(!unlockedWallet()){reqConnect();return false;}else{//force request
		//if we disconnected, freeze data updates
		if (MyLibrary.disconnected === 0) {
			var balance = await web3.eth.getBalance(MyLibrary.wallet);
			var displayEth = MyLibrary.ethBalance = fromWeiToFixed8(balance);
			
			var gunBalance = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
			var displayGun = (gunBalance / Math.pow(10, MyLibrary.decimals)).toFixed(2);
			//call function to place balances
			placeBalanaces(displayEth, displayGun);
			//update swap informer sidetab
			if(MyLibrary.Swap_state == "buy"){buyInfoState();}else{sellInfoState();}
		}else{//give zero balances
			console.log("atm waiting for wallet permissions...");
		}
	}
}
//place Swap card balances
function placeBalanaces(displayEth, displayGun){
	if(MyLibrary.Swap_state == "buy"){
		//set eth balances to tokenAamount
		document.getElementById("aaa_balance").innerHTML = displayEth;
		document.getElementById("bbb_balance").innerHTML = displayGun;
	}else if(MyLibrary.Swap_state == "sell"){
		//set eth balances to tokenBamount
		document.getElementById("aaa_balance").innerHTML = displayGun;
		document.getElementById("bbb_balance").innerHTML = displayEth;
	}
}
function placeDelBalanaces(delegatedBal, walletBal){
	document.getElementById("d_balance").innerHTML = delegatedBal;
	document.getElementById("dw_balance").innerHTML = walletBal;
}
function getFirstDayOfNextMonth() {
	var rawdate = new Date();
	var date = new Date(rawdate.getFullYear(), rawdate.getMonth() + 1, 1);//first of next month
	var nextrrday = date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
	return nextrrday;
}
//Buy&Stake informer
function stakeInformer(){
	var checkbox = document.getElementById("stake180"); 
	var rawdate = new Date();
	var unstakeDate = new Date(rawdate.setMonth(rawdate.getMonth() + 6)); //6months later
	var unstakeDate = unstakeDate.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}); 

	if(checkbox.checked){
		var message = '<span class="buynstakeConfirm status">Tokens will be staked 180 days, you will automatically Schedule 10% Sell Tax upon unstaking: '+unstakeDate+'.</span>';
		$('#buynstakeSuggestion').css('display', 'none');
		$('#swapInfo_body').append(message);
	}else{
		if($('.buynstakeConfirm').length >0){
			$('.buynstakeConfirm').css('display', 'none');
		}
		$('#buynstakeSuggestion').css('display', 'inline-block');
	}	
}
function equatefromkeyDownA(){
	
	if(window.equateTokensFromA){clearTimeout(equateTokensFromA);}
	if ($('#tokenAamount').val().length > 0){
		$('#metrics_loader').css('display', 'block');
		window.equateTokensFromA = setTimeout(async function() {
				if(MyLibrary.Swap_state == "buy"){
					var input_eth = $('#tokenAamount').val();
					if(input_eth == 0){return;}

					//toWei & Big Number inputs
					var input_eth = web3.utils.toWei(String(input_eth), 'ether'); 
					var input_eth = web3.utils.toBN(input_eth);

					var outputTokens = await tokenInst.methods.fetchSwapAmounts(input_eth, 1).call();
					/* - taxes excluded from Calc coz of Math Precision Issues in KeyDownB (below) - reverse amount calc
					var taxedOutput = outputTokens * ((100 - MyLibrary.buyRate)/100);
					*/
					var tokens = (outputTokens / Math.pow(10, MyLibrary.decimals));
					document.getElementById("tokenBamount").value = parseInt(tokens);//tokens equiv
					checkBuyState(tokens);//pass output tokens to be checked for swap verdict

				}else if(MyLibrary.Swap_state == "sell"){
					var input_tokens = $('#tokenAamount').val();
					if(input_tokens == 0){return;}

					//toWei & Big Number inputs
					var input_tokens = web3.utils.toWei(String(input_tokens), 'ether'); 
					var input_tokens = web3.utils.toBN(input_tokens);

					var output_eth = await tokenInst.methods.fetchSwapAmounts(input_tokens, 0).call();
					/* - taxes excluded from Calc coz of Math Precision Issues in KeyDownB (below) - reverse amount calc
					var taxedOutput = output_eth * ((100 - MyLibrary.sellRate)/100);
					*/
					var output_eth = web3.utils.fromWei(output_eth, "ether");
					document.getElementById("tokenBamount").value = parseFloat(output_eth).toFixed(8);//eth equiv
					checkSellState();
				}
				$('#metrics_loader').css('display', 'none');
		}, 2500);
	}else{
		$('#tokenBamount').val('');
		//reset button
		$('#swapButton').removeAttr('style');
		if(MyLibrary.Swap_state == "buy"){checkBuyState(); buyInfoState();}else{checkSellState(); sellInfoState();}
		$('#metrics_loader').css('display', 'none');
		$('#swapmetrics').empty().append('');
	}
}
function equatefromkeyDownB(){
	
	if(window.equateTokensFromB){clearTimeout(equateTokensFromB);}//so it searches when done typing
	if ($('#tokenBamount').val().length > 0){
		$('#metrics_loader').css('display', 'block');
		window.equateTokensFromB = setTimeout(async function() {
			if(MyLibrary.Swap_state == "buy"){//How much ETH we need to buy the exact amount of tokens entered in tokenBamount
				var input_gun = $('#tokenBamount').val();
				if(input_gun == 0){return;}

				var amountIn = await getAmountsIn_TOK(String(input_gun));
				var eth_equiv = web3.utils.fromWei(amountIn, "ether");
				/* - taxes excluded from Calc coz of Math Precision Issues
				//remember: feeding this eth into Input_A, factors buy tax. restore the tax to get to original amount b4 tax::
				//if netAmount = 85% * gross; gross = netAmount/85*100; Or simply netAmount * 100/(100-taxRate)
				var taxApply = 100 / (100 - parseInt(MyLibrary.buyRate));
				var taxedOutput = eth_equiv * taxApply * 1.001451343; //Buy rate offset by: 1.001451343  //long is 1.0014513429287474298506582849324
				//***WITHOUT TAXES - final values are accurate, add taxes and we have a 0.145% offset coz of JS  Math precision issues */

				document.getElementById("tokenAamount").value = parseFloat(eth_equiv).toFixed(8);//eth equiv
				checkBuyState(input_gun);
			}else{//How many tokens we need to sell to get this exact amount of ETH
				var input_eth = $('#tokenBamount').val();
				if(input_eth == 0){return;}

				var amountIn = await getAmountsIn_ETH(String(input_eth));
				var tokens_equiv = web3.utils.fromWei(amountIn, "ether");
				/* - taxes excluded from Calc coz of Math Precision Issues
				//remember: feeding this number of Tokens into Input_A it shows a sell taxed ETH output, restore the tax to get to original amount b4 tax:
				//if netAmount = 80% * gross; gross = netAmount/80*100; Or simply netAmount * 100/(100-taxRate)
				var taxApply = 100 / (100 - parseInt(MyLibrary.sellRate));
				var taxedOutput = tokens_equiv * taxApply * 1.0021; //1.0021 is sellRate offset to counter Math precision issues in JS
				//***WITHOUT TAXES - final values are accurate, add taxes and we have a 0.1% offset */
				
				document.getElementById("tokenAamount").value = parseFloat(tokens_equiv).toFixed(2);//tokens equiv
				checkSellState();
			}
			$('#metrics_loader').css('display', 'none');			
		}, 2500);
	}else{
		$('#tokenAamount').val('');
		//reset button
		$('#swapButton').removeAttr('style');
		if(MyLibrary.Swap_state == "sell"){checkSellState(); sellInfoState();}else{checkBuyState(); buyInfoState();}
		$('#metrics_loader').css('display', 'none');
		$('#swapmetrics').empty().append('');
		
	}
}
//Takes in ETH, tells you how many tokens need to be sold to receive that ETH
async function getAmountsIn_ETH(ethIN){//receives String() input
	var input_eth = web3.utils.toWei(ethIN, "ether");
	var inputAmount = web3.utils.toBN(input_eth);
	//console.log(input_eth);
	//we dont know path whether its token/weth or weth/token, so...
	const lpoolABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
	var pairAddress = MyLibrary.liquidity_pool_addy;
	var liquiditypoolInst = new web3.eth.Contract(lpoolABI, pairAddress);
	var reserves = await liquiditypoolInst.methods.getReserves().call();
	//console.log("Pair Reserves: ", reserves);
	//construct path based on reserves
	//PS might not matter the order
	//current order works (on contract https://kovan.etherscan.io/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D#readContract) 
	//...with: weth/token pair, employs else path
	//but here it reverts with evm error.. yet the fucntion below it; getAmountsIn_TOK() - getAmountsIn works for tokens-to-eth estimate
	if(reserves[0] < reserves[1]){//token/weth
		var path = [MyLibrary.wethAddress,MyLibrary.tokenAddress];
	}else{//weth/token
		var path = [MyLibrary.tokenAddress,MyLibrary.wethAddress];
	}

	//use path to getAmountsIn
	const contractAbi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
	//console.log(inputAmount +'----'+path)	
	const routerContract = new web3.eth.Contract(contractAbi, MyLibrary.uniswapV2router); 
	let result = await routerContract.methods.getAmountsIn(input_eth, path).call();
	//console.log(result);
	return result[0];
	
}
//Takes in Tokens, tells you how much ETH needed to receive those
async function getAmountsIn_TOK(tokIN){//receives String() input
	
	var input_ = web3.utils.toWei(tokIN, "ether");
	var inputAmount = web3.utils.toBN(input_);
	var path = [MyLibrary.wethAddress, MyLibrary.tokenAddress];
	const contractAbi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
	//console.log(inputAmount +'----'+path)	
	const routerContract = new web3.eth.Contract(contractAbi, MyLibrary.uniswapV2router); 
	let result = await routerContract.methods.getAmountsIn(inputAmount, path).call();
    //console.log(result)
	return result[0];
}
//checks max holdings limit
//max transfer limit
//discount tokens available to you
//this is the only checkState that updates swap infor card, checkSellState doesnt have much infor that over spill to swap infor card
async function checkBuyState(outputAmount){

	var buyRate = MyLibrary.buyRate;
	var feeTokens = await tokenInst.methods._totalServiceFees().call();
	var feeTokens = (feeTokens / Math.pow(10, MyLibrary.decimals)).toFixed(2);

	var maxHoldings = await tokenInst.methods._maxHoldings().call();
	var maxHoldings = (maxHoldings / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	
	var discountRate = await tokenInst.methods._discountRate().call();
	// ADD TAX > var requiredTokens = outputAmount;//actual required after Tax
	var requiredTokens = outputAmount;
	var bonusedAmount = requiredTokens * (100 + parseInt(discountRate)) / 100;//after given bonus

	var netExpected = parseInt(outputAmount);
	var feeTokens = parseInt(feeTokens);
	var maxHoldings = parseInt(maxHoldings);
	var bonusedAmount = parseInt(bonusedAmount);

	//implement smart contract liquidation mechanism: if theres something, take it all
	//balance needed to meet net swap output is then bought off Uniswap lp
	var tokensTransfer = 0;
	var balancePending = 0;
	var bonus = 0;
	if(feeTokens > 0){
		if(feeTokens > bonusedAmount){//contract can match full ask incl bonus
			var tokensTransfer = bonusedAmount;
			var bonus = bonusedAmount - requiredTokens;
		}else if(feeTokens > requiredTokens && feeTokens < bonusedAmount){
			var tokensTransfer = requiredTokens;//100 sorry you cant 102..now give 5% discount on tokens given
			var discounted = requiredTokens * (100-discountRate)/100;
			var bonus = tokensTransfer - discounted;
			var balancePending = requiredTokens - discounted;
		}else if(feeTokens < requiredTokens){//user should check if its worth it
			var tokensTransfer = feeTokens;
			var discounted = feeTokens * (100-discountRate)/100;
			var bonus = tokensTransfer - discounted;
			var balancePending = requiredTokens - discounted;
		}
	}else{//straight LP buy, bonus not available
		var balancePending = requiredTokens;
	}
	//Output:
	//balanePending - bought on Uniswap
	//tokenTransfer - tokens liquidated
	//bonus - bonus discounted from feeTokens
	if(feeTokens > 0){
		//bonus available sign & amount
		var metric = '<span class="metric markgreen">Transaction Bonus Due: '+bonus.toFixed(2)+'</span>';
		$('#swapmetrics').empty().append(metric);
		//buy swap infor card
		$('#shareLSitu').hide();
		var feeTotalCard = '<span class="status_pre"><b>Fee Pool Size:\n</b>'+Number(feeTokens).toFixed(2)+'</span><br><br>'; //total fees available
		var feeAcquiredCard = '<span><b>Bought via Fees:</b> '+Number(tokensTransfer).toFixed(2)+' <br>[incl '+Number(bonus).toFixed(2)+' bonus]</span><br><br>';//bought from fees
		var dexAcquiredCard = '<span><b>Bought via LP:</b> '+Number(balancePending).toFixed(2)+'</span><br>';
		$('#bonusSitu').empty().prepend(feeTotalCard+feeAcquiredCard+dexAcquiredCard);
	}else{
		$('#shareLSitu').show();
		var feeTotalCard = '<span class="status_pre"><b>Fee Pool Size:\n</b>'+Number(feeTokens).toFixed(2)+'</span>';
		$('#bonusSitu').empty().prepend(feeTotalCard);
	}
	
	//switching from sell state & delegate button
	if($('#delButton').is(':visible')) {
		$("#delButton" ).css('display', 'none');
		$("#swapButton" ).css('display', 'block');//show swap button
	}
	//reset button
	$('#swapButton').removeAttr('style');
	//prep elements
	if($("#swapButton" ).hasClass( "swapDiscouraged" )){
		$("#swapButton" ).removeClass('swapDiscouraged');
	}
	//max holdings check
	var gunBalance = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
	var holdings = (gunBalance / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	var netOutcome = Number(holdings) + netExpected;//gun balance not parsed 
	//console.log(holdings+'----'+netExpected)
	//console.log(netOutcome+'----'+maxHoldings)

	if(netOutcome >= maxHoldings){ 
		//max limit hit disable swap
		var metric = '<span class="metric markred status_pre"><b>Max Holdings:\n</b>'+maxHoldings.toFixed(2)+'</span>';
		$('#swapmetrics').empty().append(metric);
		$('#swapButton').attr('class', 'swapDisabled');
	}else if(netExpected < maxHoldings){
		//reset button
		$('#swapButton').removeAttr('style');
	}
}
async function checkSellState(){
	var input_gun = $('#tokenAamount').val();
	var sellTax = await tokenInst.methods._sellRate().call();
	var winnerTax = await tokenInst.methods._rrwinnerRate().call();
	
	var eligibility = await tokenInst.methods.isTaxExcluded(MyLibrary.wallet).call();
	var RRday = await tokenInst.methods._RRDay().call();
	var RRday = parseInt(RRday);
	//bokkypoobah 1-monday, 6 - saturday, 7-sunday
	//JS 6 - Saturday, Sunday 0, Monday 1...
	var today = new Date();
	var todaytheday = today.getDay();
	
	//prep elements
	if($("#swapButton" ).hasClass( "swapDiscouraged" )){
		$("#swapButton" ).removeClass('swapDiscouraged');
	}
	//output
	if(eligibility == true && RRday == todaytheday){
		var metric = '<span class="metric markgreen">Active RR Winner Tax ('+winnerTax+'%)</span>';
		$('#swapmetrics').empty().append(metric);
	}else if(eligibility == true && RRday != todaytheday){
		var metric = '<span class="metric markred">Pending 10% Tax on RR Day(do not sell now)</span>';
		$('#swapmetrics').empty().append(metric);
	}
	if(eligibility == false){
		var metric = '<span class="metric markred"><b>WARNING - Bandit Tax Applies:</b> '+sellTax+'%</span>';
		$('#swapmetrics').empty().append(metric);
		$('#swapButton').attr('class', 'swapDiscouraged');
	}
	//check balances
	var delegatedBal = await tokenInst.methods._sellDelegation(MyLibrary.wallet).call();
	var delegatedAmnt = (delegatedBal / Math.pow(10, MyLibrary.decimals)).toFixed(2);

	//if insufficient, add delegate
	if(input_gun > delegatedAmnt){
		$("#swapButton" ).css('display', 'none');
		$("#delButton" ).css('display', 'block');
	}else{
		$("#swapButton" ).css('display', 'block');
		$("#delButton" ).css('display', 'none');
	}
}
async function pullDelegateBalances(){
	var xxx = await unlockedWallet();//only works as await as unlockedWallet is async function
	if(xxx ==false){
		reqConnect();
		var delegatedBal = '---unlock---';
		placeDelBalanaces(delegatedBal, delegatedBal);
	}else{//if we disconnected, freeze data updates
		if (MyLibrary.disconnected === 0) {
			var delegatedBal = await tokenInst.methods._sellDelegation(MyLibrary.wallet).call();
			var delegatedBal = (delegatedBal / Math.pow(10, MyLibrary.decimals)).toFixed(2);
			var walletBal = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
			var walletBal = (walletBal / Math.pow(10, MyLibrary.decimals)).toFixed(2); 
			//call function to place balances
			placeDelBalanaces(delegatedBal, walletBal);
		}else{//give zero balances
			var delegatedBal = '---unlock---';
			placeDelBalanaces(delegatedBal, delegatedBal);
			console.log("atm waiting for wallet permissions...");
		}
	}
}
async function delegateTokens(inputAmnt, source){
	//Source 1 - main swap page, 2 - delegate tokens page
	var delegated = await tokenInst.methods._sellDelegation(MyLibrary.wallet).call();
	var delegatedBal = (delegated / Math.pow(10, MyLibrary.decimals)).toFixed(2);

	//Delegate the difference not whole amount in input, user wants to swap amount entered only
	if(source == 1 && delegatedBal < inputAmnt){//amount delagated versus amount user wants to sell, delegate Button shows up if less...
		var inputAmnt = inputAmnt - delegatedBal;//...but it only delegates difference
	}
	//to Big Number inputs
	var value = web3.utils.toWei(String(inputAmnt), 'ether'); 
	var delegateAmnt = web3.utils.toBN(value);
	//estimate gasLimit
	var encodedData = tokenInst.methods._delegateSell(delegateAmnt).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();
	//Send
	tokenInst.methods._delegateSell(delegateAmnt).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: parseInt(estimateGas)})
	.on('receipt', function(receipt){//listen
        if(receipt.status == true){//1 also matches true
            console.log('Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash);
        }
        else{
            console.log('Transaction Failed Receipt status: '+receipt.status);
            swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
        }
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		 var receipt = receipt;
		 var tx_hash = receipt.transactionHash;
		 if (confirmationNumber === 2) {
			 
		}
    })
	.on('error', (error) => {//listen
		var text = error.message;
		swal({
			title: "Cancelled.",
			type: "error",
			allowOutsideClick: true,
			text: text,
			html: false,
			confirmButtonColor: "#8e523c"
		});
	});
}
//DELEGATE NOTIFICATION
tokenInst.events.DelegateSell()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var delegateAmnt = event.returnValues[2];
		var tx_hash = event.transactionHash;
		
		var delegatedTokens = (delegateAmnt / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var outputCurrency = 'GUN';//or GUN - currency focus is outcome of Tx
		var type = 'success';//or error
		var wallet = '';
		popupSuccess(type,outputCurrency,tx_hash,'Delegated tokens for sell',0,delegatedTokens,wallet,'');
		pullDelegateBalances();//async
		checkSellState();//async
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//Withdraw Sell Delegated Tokens
async function withdrawTokens(amountBN){
	//WARNING: everything inside each .on() keeps firing as its an event listener.. TAKE NOTE ON USAGE.. POSSIBLE MEMORY ISSUES HERE
	//estimate gasLimit
	var encodedData = tokenInst.methods._undelegateSell(amountBN).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();

	//Send
	tokenInst.methods._undelegateSell(amountBN).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: parseInt(estimateGas)})
	.on('receipt', function(receipt){//listen
		if(receipt.status == true){//1 also matches true
			console.log('Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash) ;
		}
		else{
			console.log('Transaction Failed Receipt status: '+receipt.status);
			swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
		}
	 })
	.on('confirmation', function(confirmationNumber, receipt){//listen
		var receipt = receipt;
		var tx_hash = receipt.transactionHash;
		 if (confirmationNumber === 2) {
			 var delegatedTokens = (amountBN / Math.pow(10, MyLibrary.decimals)).toFixed(2);
			 var outputCurrency = 'GUN';//or GUN - currency focus is outcome of Tx
			 var type = 'success';//or error
			 var wallet = '';
			 popupSuccess(type,outputCurrency,tx_hash,'Withdrawal Delegated Tokens',0,delegatedTokens,wallet,'');//async wont wait	//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
			 pullDelegateBalances();//async 
		}
	})
	.on('error', function (error) {//listen
		var text = error.message;  
		swal({
			title: "Cancelled.",
			type: "error",
			allowOutsideClick: true,
			text: text,
			html: false,
			confirmButtonColor: "#8e523c"
		});
	});
}

function swapTokens(){
	if(MyLibrary.Swap_state == "buy"){
		swapETHforGUN();
	}else{//sell
		swapGUNforETH();
	}
}
//Buy Swap
async function swapETHforGUN(){
	window.unfired = true;//hack to remove tripple calls to the Stake function
	if($("#swapButton" ).hasClass( "swapDisabled" )){return;}
	//check if 2nd transaction is coming and tell user
	var checkbox = document.getElementById("stake180");
	if(checkbox.checked){
		var text = "Second popup pending to sign Staking transaction as requested for 180 days.\n You will automatically qualify for 10% sell tax on unstaking after maturity.";
		swal({
			title: "Staking Required, another transaction pending..",
			type: "success",
			text: text,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	}
	MyLibrary.frontendEth = $('#tokenAamount').val();//event notification
	var input_eth = web3.utils.toWei(MyLibrary.frontendEth, "ether");
	var input_eth = web3.utils.toBN(input_eth);
	var deadline = web3.utils.toBN(300);
	var stakedays = web3.utils.toBN(180);
	
	//estimate gasLimit
	var encodedData = tokenInst.methods._buyGuns(deadline).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		value: input_eth,
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();
	//transaction
	tokenInst.methods._buyGuns(deadline).send({
		from: MyLibrary.wallet,
		value: input_eth,
   		gasPrice: gasPrice,
		gasLimit: estimateGas,
	})
	.on('receipt', async function(receipt){//listen
		if(receipt.status == true){//1 also matches true
			console.log('Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash) ;
		}
		else{
			console.log('Transaction Failed Receipt status: '+receipt.status);
			swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
		}
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		//This references actual Transfer, but problematic when the buy is split as our Proxy does
		//console.log('tokens bought: '+receipt.events.Transfer[1].returnValues.value);
	})
	.on('error', function (error) {//listen
		console.log(error)
		var text = error.message;
		swal({
			title: "Swap Failed.",
			type: "error",
			text: text,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	});
	
}
//BUY TRANSACTION NOTIFICATION - BUYft Event Listening
tokenInst.events.BUYft()
.on('data', function(event){
	//if(event.from != MyLibrary.wallet){return;}
	console.log(event); 
	var tokens = event.returnValues[2];
	var tx_hash = event.transactionHash;
	var receivedTokens = (tokens / Math.pow(10, MyLibrary.decimals));
	var displayTokens = receivedTokens.toFixed(2);
	var outputCurrency = 'GUN';//or GUN - currency focus is outcome of Tx
	var type = 'success';//or error
	var wallet = '';
	popupSuccess(type,outputCurrency,tx_hash,'Swapped '+MyLibrary.frontendEth+' ETH For',0,displayTokens,wallet,'');//async wont wait	//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
	balances();
	$('#tokenAamount').val('');
	$('#tokenBamount').val('');
	$('#swapButton').removeAttr('style');
	$('#swapmetrics').empty();
	//check stake, is required launch stake transaction to user
	var checkbox = document.getElementById("stake180");
	if(checkbox.checked && unfired == true){
		unfired = false;
		stakeTokens(180, receivedTokens);
	}
})
.on('changed', function(event){
	// remove event from local database
	console.log(event);
})
.on('error', console.error);

//Sell Swap
async function swapGUNforETH(){
	if($("#swapButton" ).hasClass( "swapDisabled" )){return;}
	MyLibrary.frontendTokens = $('#tokenAamount').val();//event notification
	var input_amnt = web3.utils.toWei(MyLibrary.frontendTokens, "ether");
	var input_amnt = web3.utils.toBN(input_amnt);
	var deadline = web3.utils.toBN(300);
	
	//estimate gasLimit
	var encodedData = tokenInst.methods._sellGuns(deadline).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();
	//transaction
	tokenInst.methods._sellGuns(deadline).send({
		from: MyLibrary.wallet,
		gasPrice: gasPrice,
		gasLimit: estimateGas //actual cost est is falling short, by about 1.5
	})
	.on('receipt', (receipt) => {
		if(receipt.status == true){//1 also matches true
			console.log('Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash) ;
		}
		else{
			console.log('Transaction Failed Receipt status: '+receipt.status);
			swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
		}
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		console.log('tokens sold: '+receipt.events.Transfer[1].returnValues.value);
	})
	.on('error', function (error) {//listen
		console.log(error)
		var text = error.message;
		swal({
			title: "Swap Failed.",
			type: "error",
			text: text,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	});
}
//TRANSACTION NOTIFICATION
tokenInst.events.BanditSell()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var receivedETH = event.returnValues[2];
		var tx_hash = event.transactionHash;
		
		var receivedETH = fromWeiToFixed8(receivedETH);
		var outputCurrency = 'ETH';//or GUN - currency focus is outcome of Tx
		var type = 'success';//or error
		var wallet = '';
		var outputTokens = MyLibrary.frontendTokens;
		popupSuccess(type,outputCurrency,tx_hash,'Swapped '+Number(outputTokens).toLocaleString()+' GUN For',receivedETH,0,wallet,'');
		balances();
		$('#tokenAamount').val('');
		$('#tokenBamount').val('');
		$('#swapButton').removeAttr('style');
		$('#swapmetrics').empty();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);


//Stake tokens
async function stakeTokens(duration, tokens){
	//check for existing stake already
	//if exists then show swal with warning about overwriting duration
	var text = "If you already have an existing Stake, only amount will be updated, duration and expiry will not be affected.";
		swal({
			title: "Staking",
			type: "info", //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
			text: text,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	//prepare values
	var tokens = web3.utils.toWei(String(tokens), 'ether');
	var stakeAmnt = web3.utils.toBN(tokens);//received in wei
	var duration = web3.utils.toBN(duration);
	
	//estimate gasLimit
	var encodedData = tokenInst.methods._stakeTokens(duration, stakeAmnt).encodeABI();
	var estimateGas = await web3.eth.estimateGas({//gas estimation error can occur because indeed its overpricing even the local network test Tx such that its > bal
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice(); 
	//transaction
	tokenInst.methods._stakeTokens(duration, stakeAmnt).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: estimateGas})
	.on('receipt', function(receipt){//listen
		console.log('Mined', receipt);
        if(receipt.status == true){//1 also matches true
			
        }
        else{
            console.log('Transaction Failed Receipt status: '+receipt.status);
            swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
        }
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		
    })
	.on('error', (error) => {//listen
		var text = error.message;
		console.log(error);
		swal({
			title: "Cancelled.",
			type: "error",
			allowOutsideClick: true,
			text: text,
			html: false,
			confirmButtonColor: "#8e523c"
		});
	});
}
//TRANSACTION NOTIFICATION
tokenInst.events.Staked()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event); 
		var tokens = event.returnValues[2];
		var expiry = event.returnValues[1];
		var expires = new Date(expiry * 1000).toLocaleString();
		var tx_hash = event.transactionHash;
		var stakedTokens = (tokens / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Staked Successfully';
		var nonTxAction = Number(stakedTokens).toLocaleString()+' GUN, Expires: '+expires;
		popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		stakedBal();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//Stake balance 
async function stakedBal(){
	var amount = await tokenInst.methods.getStakeData(MyLibrary.wallet).call();
	var tokens = (amount[0] / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	$('#stakedBal').empty().append(' bal: '+tokens);
}
//============================================================================
//CLICK INITIATED CALLS
//HANDLE ALL EVENTS HERE
//swaps
$(document).on('click', '#maxTokenA', async function(e){
	//var tokenAamount = document.getElementById("aaa_balance").innerHTML;
	if(MyLibrary.Swap_state == "buy"){
		var balanceETH = await web3.eth.getBalance(MyLibrary.wallet);
		var balanceETH = MyLibrary.ethBalance = fromWeiToFixed8(balanceETH);
		var balance = parseFloat(balanceETH);
	}else{
		var mybalance = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
		var balance = fromWeiToFixed2_unrounded(mybalance);
	}
	//output values
	document.getElementById("tokenAamount").value = balance;
	equatefromkeyDownA();
});
$(document).on('click', '#maxTokenB', async function(e){

	//var tokenBamount = document.getElementById("bbb_balance").innerHTML;
	if(MyLibrary.Swap_state == "buy"){
		var mybalance = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
		var balance = fromWeiToFixed2_unrounded(mybalance);
	}else{
		var balanceETH = await web3.eth.getBalance(MyLibrary.wallet);
		var balanceETH = MyLibrary.ethBalance = fromWeiToFixed8(balanceETH);
		var balance = parseFloat(balanceETH);
	}
	//output values
	document.getElementById("tokenBamount").value = balance;
	equatefromkeyDownB();
});
//token delegation scripts
$(document).on('click', '#delegate_expand', function(e){
	if($('.delegate_form').css('height')=='0px'){
		$('.swapcard').animate({height: "420px"}, 100, "swing", function(){});
		$('.delegate_form').css({'display' : 'block'});
		$('.delegate_form').animate({height: "370px"}, 600, "swing", function(){});
		//fetch delegate balances, copy wallet balance from local though
		pullDelegateBalances();
	}else{
		$('.delegate_form').animate({height: "0px"}, 300, "swing", function(){});
		$('.delegate_form').css({'display' : 'none'});
		$('.swapcard').animate({height: "370px"}, 100, "swing", function(){});
		if(window.delegateBalTimer){clearTimeout( window.delegateBalTimer); }else{}
	}
});
//delegate from toggle page 
$(document).on('click', '#submit_delegate_t', function(e){
	var raw_delegate = document.getElementById("d_delegate").value;
	//submit
	delegateTokens(raw_delegate, 2);
});
//delegate from front page
$(document).on('click', '#delButton', function(e){
	var raw_delegate = document.getElementById("tokenAamount").value;
	//submit
	delegateTokens(raw_delegate, 1);
});
$(document).on('click', '#submit_withdraw_t', function(e){
	
	var raw_delegate = document.getElementById("d_withdraw").value;
	var value = web3.utils.toWei(raw_delegate, 'ether');
	var amount = web3.utils.toBN(value);
	var truefalse = web3.utils.isBN(amount);
	//submit
	withdrawTokens(amount);
});
//swap tokens
$(document).on('click', '#swapButton', function(e){
	swapTokens();
});
//switch states
$(document).on('click', '#switch', function(e){
	
	if(MyLibrary.Swap_state == "buy"){
		//RUN READIBILITY - once a switch is done run swap check by imitating keydown
		if ($('#tokenAamount').val().length > 0){	equatefromkeyDownA();}
		sellInfoState();//we're now going into sell state
	}else{
		//RUN READIBILITY - once a switch is done run swap check by imitating keydown
		if ($('#tokenBamount').val().length > 0){	equatefromkeyDownB();}
		buyInfoState();//we're now going into buy state
	}
	shuffleAmounts();
});
