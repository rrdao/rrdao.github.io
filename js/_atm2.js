// JavaScript Document
MyLibrary.tokenAamount = 0;
MyLibrary.tokenBamount = 0;
MyLibrary.ethBalance = 0;
MyLibrary.gunBalance = 0;
MyLibrary.delegatedBal = 0;
MyLibrary.sellRate = 0;
MyLibrary.buyRate = 0;
MyLibrary.claimsource = 1;//wallet source default
MyLibrary.SL_lessor = "0x00";

//CALLS
$(document).ready(async function(){
	//proceed
	var unlockState = await unlockedWallet();
	if (unlockState === true){
		//repeat, with async and promise so it dont overspill
		const setatmIntervalAsync = (fn, ms) => {
			fn().then(() => {
				setTimeout(() => setatmIntervalAsync(fn, ms), ms);
			});
		};
		setatmIntervalAsync(async () => {
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

	//Update Rate First, we are in portfolio
	MyLibrary.sellRate = await tokenInst.methods._sellRate().call();
	MyLibrary.buyRate = await tokenInst.methods._buyRate().call();

	//Claims card
	claimCardsRefresh();

	//Benefactors
	benefactorsCard();

	//Tax Status
	try{
		tokenInst.methods.isTaxExcluded(MyLibrary.wallet).call().then(function (result,error) {
			if(result == true){
				$('#sect_tax').empty().append('true');
			}else{
				$('#sect_tax').empty().append('false');
			}
		});
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

//STAKE FUNCTION IS SWAP.JS ********

//Unstake tokens
async function unstakeTokens(inputAmnt){
	//to Big Number inputs
	var tokens = web3.utils.toWei(String(inputAmnt), 'ether'); 
	var stakeAmnt = web3.utils.toBN(tokens);

	//estimate gasLimit
	var encodedData = tokenInst.methods.unstake(stakeAmnt).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();

	//Send
	tokenInst.methods.unstake(stakeAmnt).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: parseInt(estimateGas)})
	.on('receipt', function(receipt){//listen
        if(receipt.status == true){//1 also matches true
            console.log('Mined', receipt);
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
tokenInst.events.Unstaked()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event); 
		
		var tokens = event.returnValues[1];
		var sixerstatus = event.returnValues[2];//returns true/false - see getStakeData result
		if(sixerstatus == true){
			var sixerNotify = '<p class="markgreen">10% Sell Tax applies for your wallet on RR Day.</p>'
		}else{
			var sixerNotify = '';
		}
		var tx_hash = event.transactionHash;
		var stakedTokens = (tokens / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'unStaked Successfully';
		var nonTxAction = Number(stakedTokens).toLocaleString()+' GUN. '+sixerNotify;
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

//Reward Claims Cards Data
async function claimCardsRefresh(){
	if(window.atmChecks){	clearInterval(window.atmChecks);	}

	if(MyLibrary.claimsource ==1){//wallet
		//Holdings
		$('#sect_claims_w').empty().append(MyLibrary.gunBalance+' GUN');
		//Claims To Date
		try{
			tokenInst.methods._netEthRewardedWallet(MyLibrary.wallet).call().then(function (result,error) {
				var rewarded_eth = fromWeiToFixed8(result);
				$('#sect_claimed_w').empty().append(rewarded_eth + ' ETH');
			});
		}catch(error) {
			console.log(error); 
		}
		//Rewards Due
		try{var address = MyLibrary.wallet;
			if (address.length >= 40 && web3.utils.isAddress(address) == true) {
				tokenInst.methods.currentRewardForWallet(address).call().then(function (result,error) {
					var reward_due = fromWeiToFixed8(result);
					$('#sect_due_w').empty().append(reward_due + ' ETH');
				});
			}
		}catch(error) {
			console.log(error); 
		}
	}
	if(MyLibrary.claimsource ==2){//share lease
		
		var leaseDetails = await tokenInst.methods._checkOccupiedLease().call({from: MyLibrary.wallet});
		var lessor = MyLibrary.SL_lessor = leaseDetails[0];
		//Holdings
		var leaseAmount = (leaseDetails[1] / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		$('#sect_claims_w').empty().append(leaseAmount+' GUN');
		if(leaseAmount == 0){return;}else{
			//Claims To Date
			try{
				tokenInst.methods._totalEthReflectedSL(MyLibrary.wallet).call().then(function (result,error) {
					var rewarded_eth = fromWeiToFixed8(result);
					$('#sect_claimed_w').empty().append(rewarded_eth + ' ETH');
				});
			}catch(error) {
				console.log(error); 
			}
			//Rewards Due check using Lessor address
			try{console.log(lessor)
				tokenInst.methods._checkShareReflection(lessor).call({from: MyLibrary.wallet}).then(function (result,error) {
					var reward_due = fromWeiToFixed8(result);
					$('#sect_due_w').empty().append(reward_due + ' ETH');
				});
			}catch(error) {
				console.log(error); 
			}
		}
	}
	if(MyLibrary.claimsource ==3){//staked
		
		var stakeDetails = await tokenInst.methods.getStakeData(MyLibrary.wallet).call();
		var stakedTokens = stakeDetails[0];
		
		//Holdings
		var holdings = (stakedTokens / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		$('#sect_claims_w').empty().append(holdings+' GUN');

		if(holdings == 0){return;}else{
			//Claims To Date
			try{
				tokenInst.methods._totalEthReflectedST(MyLibrary.wallet).call().then(function (result,error) {
					var rewarded_eth = fromWeiToFixed8(result);
					$('#sect_claimed_w').empty().append(rewarded_eth + ' ETH');
				});
			}catch(error) {
				console.log(error); 
			}
			//Rewards Due
			try{
				tokenInst.methods._checkStakeReflection().call({from: MyLibrary.wallet}).then(function (result,error) {
					var reward_due = fromWeiToFixed8(result);
					$('#sect_due_w').empty().append(reward_due + ' ETH');
				});
			}catch(error) {
				console.log(error); 
			}
		}
	}
}

async function benefactorsCard(){
	try{//collected checked on beneficiary wallet
		var donorRewards = await tokenInst.methods.currentDonorRewards(MyLibrary.wallet).call();
		var donors_count = parseFloat(donorRewards[0]);
		var reward_due = fromWeiToFixed8(donorRewards[1]);
		if(donors_count > 0){
			//display
			$('#claim_fmb').css('display', 'block');
			$('#bene_count').empty().append(donors_count + ' wallets');
			$('#bene_value').empty().append(reward_due + ' ETH');
		}else if(donors_count == 0){//no donors
			$('#claim_fmb').css('display', 'none');
			$('#bene_count').empty().append(donors_count + ' wallets');
			$('#bene_value').empty().append('0 ETH');
		}
	}catch(error) {
		console.log(error); 
	}
}

async function claimRewardsMultiSource(claimCallOrigin){
	
	var gasPrice = await web3.eth.getGasPrice(); // estimate the gas price 
	if(claimCallOrigin == 1){
		if(MyLibrary.claimsource ==1){//wallet tokens claim Tx
			//estimate gasLimit
			var encodedData = tokenInst.methods.claimReflection().encodeABI();
			var estimateGas = await web3.eth.estimateGas({data: encodedData,from: MyLibrary.wallet,to: MyLibrary.tokenAddress});
			//construct Tx
			var ClaimFunction = tokenInst.methods.claimReflection().send({from: MyLibrary.wallet,gasPrice: gasPrice,gasLimit: estimateGas,})
		}
		if(MyLibrary.claimsource ==2){//sharelease claim Tx
			var leaseDetails = await tokenInst.methods._checkOccupiedLease().call({from: MyLibrary.wallet});
			var address = MyLibrary.SL_lessor = leaseDetails[0];

			if (address.length >= 40 && web3.utils.isAddress(address) == true) {}else{console.log("Invalid Lessor Wallet"); swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Invalid Lessor Wallet"}); return;}
			//estimate gasLimit
			var encodedData = tokenInst.methods.claimShareReflection(address).encodeABI();
			var estimateGas = await web3.eth.estimateGas({data: encodedData,from: MyLibrary.wallet,to: MyLibrary.tokenAddress});
			//construct Tx
			var ClaimFunction = tokenInst.methods.claimShareReflection(address).send({from: MyLibrary.wallet,gasPrice: gasPrice,gasLimit: estimateGas,})
		}
		if(MyLibrary.claimsource ==3){//staked tokens claim Tx
			//estimate gasLimit
			var encodedData = tokenInst.methods.claimStakeReflection().encodeABI();
			var estimateGas = await web3.eth.estimateGas({data: encodedData,from: MyLibrary.wallet,to: MyLibrary.tokenAddress});
			//construct Tx
			var ClaimFunction = tokenInst.methods.claimStakeReflection().send({from: MyLibrary.wallet,gasPrice: gasPrice,gasLimit: estimateGas,})
		}
	}

	//transaction package
	ClaimFunction
	.on('receipt', function(receipt){//listen
		if(receipt.status == true){//1 also matches true
			console.log('Claim Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash);
		}else{
			console.log('Transaction Failed Receipt status: '+receipt.status);
			swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
		}
	})
	.on('confirmation', function(confirmationNumber, receipt){//listen
		
	})
	.on('error', function (error) {//listen
		var text = error.message; 
		swal({
			title: "Rewards Claiming Failed.",
			type: "error",
			text: text,
			html: false,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
		console.log(error);
	});
}
//TRANSACTION NOTIFICATION
tokenInst.events.ClaimReflectionLease()
	.on('data', async function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var reward = event.returnValues[2];
		var lessor = event.returnValues[1];
			var first = lessor.substring(0, 6);//get first chars
			var last = lessor.slice(lessor.length - 3);//get last chars
			var privatize = first+'..'+last;

		var tx_hash = event.transactionHash;
		var receivedETH = fromWeiToFixed8(reward);//show crumbs
		var leaseTokens = 0;
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Rewards Claimed From Lease';
		var nonTxAction = receivedETH+' eth, from: '+privatize;
		popupSuccess(type,outputCurrency,tx_hash,message,receivedETH,leaseTokens,wallet,nonTxAction);

		//refresh cards, lease card + claimcards in case
		port_leaseTaken();
		claimCardsRefresh();//refresh - Top Claim Card Left
		
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//TRANSACTION NOTIFICATION
tokenInst.events.ClaimReflectionStake()
	.on('data', async function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var reward = event.returnValues[2];
		var tx_hash = event.transactionHash;
		var receivedETH = fromWeiToFixed8(reward);//show crumbs
		var stakeTokens = 0;
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Rewards Claimed From Stake';
		var nonTxAction = receivedETH+' eth';
		popupSuccess(type,outputCurrency,tx_hash,message,receivedETH,stakeTokens,wallet,nonTxAction);

		//refresh cards, lease card + claimcards in case
		port_tokensStaked();
		claimCardsRefresh();//refresh - Top Claim Card Left
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//TRANSACTION NOTIFICATION
tokenInst.events.ClaimReflection()
	.on('data', async function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var reward = event.returnValues[1];
		var owner = event.returnValues[0];

			var first = owner.substring(0, 6);//get first chars
			var last = owner.slice(owner.length - 3);//get last chars
			var privatize = first+'..'+last;

		var tx_hash = event.transactionHash;
		var receivedETH = fromWeiToFixed8(reward);//show crumbs
		var stakeTokens = 0;
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';

		if(owner != MyLibrary.wallet){//beneficiary claimed
			var message = 'Beneficiary Rewards Claimed';
			var nonTxAction = receivedETH+' eth, from benefactor: '+privatize;
			port_beneficiary(owner);//refresh - Top Claim Card Right
		}else{//owner claimed
			var message = 'Rewards Claimed';
			var nonTxAction = receivedETH+' eth, into wallet: '+privatize;
			claimCardsRefresh();//refresh - Top Claim Card Left
		}
		popupSuccess(type,outputCurrency,tx_hash,message,receivedETH,stakeTokens,wallet,nonTxAction);
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//Beneficiary Wallet Set
function setBeneficiaryWallet(wallet){
	if (wallet.length >= 40 && web3.utils.isAddress(wallet) == true) {}else{console.log("Invalid address provided"); return;}
	
	//transaction
	tokenInst.methods.addBeneficiary(wallet).send({
		from: MyLibrary.wallet
	})
	.on('receipt', function(receipt){
		if(receipt.status == true){//1 also matches true
			console.log('Mined', receipt);
		}
		else{
			console.log('Transaction Failed Receipt status: '+receipt.status);
			swal({title: "Failed.",type: "error",confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
		}
	 })
	.on('confirmation', function(confirmationNumber, receipt){//listen
		var receipt = receipt;
		var tx_hash = receipt.transactionHash;
		var first = wallet.substring(0, 10);//get first chars
		var last = wallet.slice(wallet.length - 5);//get last chars
		var nonTxAction = first+'..'+last;

		 if (confirmationNumber === 2) {
			 var type = 'success';//or error
			 var outputCurrency = '';
			 popupSuccess(type,outputCurrency,tx_hash,'Beneficiary Wallet Set',0,0,'',nonTxAction);
			 $('#beneficiaryWallet').empty().append(wallet);
			 swal.close();
		}
	})
	.on('error', function (error) {//listen
		var text = error.message;  
		swal({
			title: "Failed to add Beneficiary.",
			type: "error",
			text: text,
			html: false,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	});
}
//Beneficiary Wallet Set
function beneficiarySetting(){
	var privatize = '<div class="shl_inputshold delegate_inputshold setBeneField"><input id="submitwallet" class="shldi benown" aria-invalid="false" autocomplete="off" title="once an address is set it will be able to claim your ETH rewards. to remove beneficiary, simply click remove"><br><div class="beneCurrent"><span>Beneficiary: </span><span id="beneficiaryWallet"></span><span id="removeWallet" title="remove beneficiary">x</span></div></div>';
	swal({
			title: "Set/Unset Beneficiary Wallet",
			text: privatize,
			type: "prompt",  //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
			html: true,
					dangerMode: true,
					confirmButtonText: "Set Wallet",
					confirmButtonColor: "#8e523c", //cowboy brown
					cancelButtonText: "Close",
					closeOnConfirm: false,
					showLoaderOnConfirm: true,
			showConfirmButton: true,
			showCancelButton: true,
			timer: 4000,
			animation: "slide-from-top"
	},function(){//on confirm click
		var address = $('#submitwallet').val();
		setBeneficiaryWallet(address);
	});//confirm swal close
	
	//show current beneficiary
	document.getElementById("submitwallet").placeholder = "set wallet address as beneficiary..";
	atmChecks = setTimeout( function() {
		var address = MyLibrary.wallet;
		try{
			tokenInst.methods._claimBeneficiary(address).call().then(function (result,error) {
				if(web3.utils.toBN(result).isZero()){//zero address check 0x00
					var result = MyLibrary.wallet;
				}
				$('#beneficiaryWallet').empty().append(result);
			});
		}catch(error) {
			console.log(error); 
		}
	}, 1000);
}
//Remove Beneficiary Wallet
async function removeBeneficiary(){
	var beneficiary = await tokenInst.methods._claimBeneficiary(MyLibrary.wallet).call();
	//transaction
	tokenInst.methods.removeBeneficiary(beneficiary).send({from: MyLibrary.wallet})
	.on('receipt', function(receipt){
		if(receipt.status == true){//1 also matches true
			console.log('Mined', receipt);
		}
		else{
			console.log('Transaction Failed Receipt status: '+receipt.status);
			swal({title: "Failed.",type: "error",confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
		}
	 })
	.on('confirmation', function(confirmationNumber, receipt){//listen
		var wallet = beneficiary;
		var first = wallet.substring(0, 10);//get first chars
		var last = wallet.slice(wallet.length - 5);//get last chars
		var nonTxAction = first+'..'+last;

		 if (confirmationNumber === 2) {
			 var type = 'success';//or error
			 var outputCurrency = '';
			 popupSuccess(type,outputCurrency,'','Beneficiary Wallet Removed',0,0,'',nonTxAction);
			 swal.close();
		}
	})
	.on('error', function (error) {//listen
		var text = error.message;  
		swal({
			title: "Failed to remove Beneficiary.",
			type: "error",
			text: text,
			html: false,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	});
}
function resetClaimFields(){
	$('#sect_claims_w').empty().append('---');
	$('#sect_claimed_w').empty().append('---');
	$('#sect_due_w').empty().append('---');
}
//claims history
function rewardsClaimed(){
	return new Promise(function(resolve, reject) {// Creating a XHR object
		const xhr = new XMLHttpRequest();
		const url = MyLibrary.AlchemyURL;
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var parsed = JSON.parse(this.responseText);
				if(parsed.hasOwnProperty('error')){//click or call again after a min timeout
					//var stringified = JSON.stringify(parsed);
					console.log('retry in progress, error on last fetch: '+result.error);//if it returns objects, just log stringified
					rewardsClaimed();
				}else{
					process_claims_todate(parsed);
				}
			}
		};		
		//converting JSON data to string
		var abi = MyLibrary.contractABI;
		var fromBlockHEX = '0x'+(30111000).toString(16);//to_hex.. from_hex = parseInt(hexString, 16);
		var address_encoded = web3.eth.abi.encodeParameter('address', MyLibrary.wallet);
		//event signature
		if(MyLibrary.claimsource == 1 || MyLibrary.claimsource == 4){var eventSignature = "0xedfd1f5aaee60f4be9ef12702ca2d1016ebce9d8fd3f0e11d7080fd43d12cc84";}
		if(MyLibrary.claimsource == 2){var eventSignature = "0x10d7dba82e80cd40ab7be3edd8a086dfbd9de77bfd704b3c92fad61107984906";}
		if(MyLibrary.claimsource == 3){var eventSignature = "0xb9d645858ab727bc03340723bceed2cb8b1b6ff2cbb0045673f446905c98bddc";}
		if(MyLibrary.claimsource == 4){//just address now, signature set already
			var address = $('#claimfromwallet').val();
			if (address.length >= 40 && web3.utils.isAddress(address) == true) {
				var address_encoded = web3.eth.abi.encodeParameter('address', address);	
			}else{
				swal({title: "Invalid Address Provided.",type: "error",text: "check benefactor wallet address above..",html: false,allowOutsideClick: true,confirmButtonColor: "#8e523c"});
			}
		}
		//construct
		var data = JSON.stringify({"jsonrpc": "2.0","id": 0,"method": "eth_getLogs","params": [{
						  "fromBlock": fromBlockHEX,
						  "address": MyLibrary.tokenAddress,
						  "topics": [eventSignature,address_encoded] //use: https://emn178.github.io/online-tools/keccak_256.html
						}]
					});
		//sending data with the request
		xhr.send(data);
		xhr.onerror = reject;
	});
}

function process_claims_todate(parsed){
	//console.log(parsed);
	//console.log(parsed.id);
	//console.log(parsed.result[0].data);// value claimed
	var claims_ = parsed.result;
	var number_of_claims = MyLibrary.number_of_claims = parsed.result.length;
	var receiver = MyLibrary.wallet;
	var list_tree = '';
	window.total_claims = 0;
	if(number_of_claims > 0){
		for (var i = 0; i < number_of_claims; i++) {
			var claimerfromHex  = parseInt(claims_[i].topics[2], 16);//2nd topic is claimer
			var ethReward = fromWeiToFixed8(claims_[i].data);//pass hex			
			var ethReward = parseFloat(ethReward);//float so we can add the values not append
			if(ethReward > 0 && claimerfromHex == receiver){ 
				var tx_hash = claims_[i].transactionHash.slice(0, 12);//trim to max 10
				var transfer = '<li class="claimtx"><span class="claim_tag">Claimed: </span><span class="reward_tag">'+ ethReward + ' ETH, </span><span class="tx_tag"><a href="'+MyLibrary.etherScan+'/tx/'+claims_[i].transactionHash+'" target="_blank">TxHash: ' + tx_hash + '...</a></span></li>';
				window.total_claims += ethReward;
				var list_tree = list_tree + transfer;
				
				if(i == number_of_claims-1){//last item, since we loop from 0 not 1
					var chd = '<div class="claimsum">'+window.total_claims+' ETH</div><div class="clms_case">'+list_tree+'</div>';
					swal({
						title: "Claims History",
						text: chd,
						html: true,
						showCancelButton: false,
						dangerMode: true,
						confirmButtonText: "Cool",
						confirmButtonColor: "#8e523c",
						closeOnConfirm: true
					});
				}
			}
		}//close for
	}else{//no claims yet popup
		console.log('No claims yet...');
		$('#sect_claimed').empty().append(number_of_claims+' claims');
		var privatize = '<div class="clms_case">No rewards claimed yet...</div>';
		swal({
			  title: "0 Claims",
			  text: privatize,
			  type: "info",  //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
			  html: true,
						dangerMode: true,
						confirmButtonText: "Okay",
						confirmButtonColor: "#8e523c", //cowboy brown
			  showConfirmButton: true,
			  showCancelButton: false,
			  timer: 4000,
			  animation: "slide-from-top"
		},function(){//on confirm click
		
		});//confirm swal close
	}
}

//portfolio refresh
async function portfolioRefresh(){
	//my beneficiary - who im donating to
	port_myBeneficiary().then(() => {
		//bonfire
		port_bonfireWallet();
	}).then(() => {
		//share lease issued
		port_leaseIssued();
	}).then(() => {
		//share lease taken
		port_leaseTaken();
	}).then(() => {
		//staked
		port_tokensStaked();
	}).then(() => {
		port_staticView();
	}).then(() => {
		
	})
}
async function port_myBeneficiary(){
	try{
		var beneficiary = await tokenInst.methods._claimBeneficiary(MyLibrary.wallet).call();
		if(web3.utils.toBN(beneficiary).isZero() || beneficiary == MyLibrary.wallet){//zero address check 0x00 or if you removed a beneficary and reset to self
			var beneficiary = 'no beneficiary set';
			//display beneficiary wallet
			$('#pbCard_bene').empty().append(beneficiary);
		}else{
			//display beneficiary wallet
			$('#pbCard_bene').empty().append(beneficiary);
			//fetch rewards claimed
			try{
				var rewarded_eth = await tokenInst.methods._netRewardsTomyBE(MyLibrary.wallet).call();
				var fixedETH = fromWeiToFixed8(rewarded_eth);
				$('#pbCard_total').empty().append(fixedETH + ' ETH');
			}catch(error) {
				console.log(error); 
			}
			//convert to USD value
			var USDvalue = fixedETH * await ETHUSDprice(); 
			var USDvalue = parseFloat(USDvalue);
			var fixed = 6;//6 is good for all esp RBW
			var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
			var USDvalue = USDvalue.toString().match(re)[0];

			$('#pbCard_value').empty().append('$ '+USDvalue );
		}
	}catch(error) {
		console.log(error); 
	}
	
	
}
async function port_leaseIssued(){
	$("#dot_lsrD").hide();
	try{
		var leaseIssued = await tokenInst.methods.getShareLease(MyLibrary.wallet).call({from: MyLibrary.wallet});
		var amount = (leaseIssued[0] / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var ETHasked = fromWeiToFixed8_unrounded(leaseIssued[1]);
		var ETHclaimed = fromWeiToFixed8_unrounded(leaseIssued[2]);
		var duration = leaseIssued[3];
		
		if(leaseIssued[4] > 0){//taken date
			$("#dot_lsrD").css('display', 'inline-block');
			var start = new Date(leaseIssued[4] * 1000).toLocaleString();
			var expiry = new Date(leaseIssued[5] * 1000).toLocaleString();
		}else{
			var start = '0/0/0000';
			var expiry = '0/0/0000';
		}
		var subscriber = leaseIssued[6];
		if (typeof subscriber == 'undefined'){var subscriber = "0x0000000000000000000000000000000000000000";}
		//add values
		$('#_lsrD_taker').empty().append(subscriber);
		$('#_lsrD_tokens').empty().append(amount);
		$('#_lsrD_ask').empty().append(ETHasked + ' ETH');
		$('#_lsrD_claims').empty().append(ETHclaimed + ' ETH');
		$('#_lsrD_start').empty().append(start); 
		$('#_lsrD_expire').empty().append(expiry + ' (duration ' + duration + ' days)'); //add duration in brackets
		leaseDelegatedBal();
		//check for taken lease and show correct indicators/buttons
		if(web3.utils.toBN(subscriber).isZero()){
			$("#dot_lsrD, #_portBtnConclude").hide();
		}else{
			$("#_portBtnConclude").css('display', 'inline-flex');
			var timestamp = parseInt(Date.now()/1000);//divide by 1000 ms to get 10 digit Unix like from solidity
			if(leaseIssued[5] < timestamp){//expired
				$('#_lsrD_expire').css('color', '#ff4747');//red
			}else{
				$('#_lsrD_expire').css('color', '#04C86C');//green
			}
		}
	}catch(error) {
		console.log(error); 
	}
	return;
}
async function port_leaseTaken(){
	$("#dot_lsrT").hide();
	try{
		var leaseTaken = await tokenInst.methods._checkOccupiedLease().call({from:MyLibrary.wallet});
		//check for taken lease and show green dot
		if(leaseTaken[3] == 0){
			return;
		}else{
			$("#dot_lsrT").css('display', 'inline-block');
			$(".dot").css({'background-color': '#27AE60'});
			var timestamp = parseInt(Date.now()/1000);//divide by 1000 ms to get 10 digit Unix like from solidity
			if(leaseTaken[4] < timestamp){//expired
				$('#_lsrD_expire').css('color', '#ff4747');//red
				$("#_portBtnClaim").hide();
			}else{
				$('#_lsrD_expire').css('color', '#04C86C');//green
				$("#_portBtnClaim").css('display', 'inline-flex');
			}
		}
		var lessor = leaseTaken[0];
		var amount = (leaseTaken[1] / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var ETHasked = fromWeiToFixed8_unrounded(leaseTaken[2]);
		var ETHclaimed = await tokenInst.methods._totalEthReflectedSL(MyLibrary.wallet).call();
		var ETHclaimed = fromWeiToFixed8_unrounded(ETHclaimed);
		if(leaseTaken[4] > 0){
			var start = new Date(leaseTaken[3] * 1000).toLocaleString();
			var expiry = new Date(leaseTaken[4] * 1000).toLocaleString();
		}else{
			var start = '0/0/0000';
			var expiry = '0/0/0000';
		}
		//add values
		$('#_lsrT_lessor').empty().append(lessor);
		$('#_lsrT_tokens').empty().append(amount);
		$('#_lsrT_ask').empty().append(ETHasked + ' ETH');
		$('#_lsrT_claims').empty().append(ETHclaimed + ' ETH');
		$('#_lsrT_start').empty().append(start); 
		$('#_lsrT_expiry').empty().append(expiry);
	}catch(error) {
		console.log(error); 
	}
	return;
}
async function port_tokensStaked(){
	$("#dot_lsrStk").hide();
	try{
		var stakeData = await tokenInst.methods.getStakeData(MyLibrary.wallet).call();
		//check for staked tokens & show indicators
		if(stakeData[0] == 0){//nothing staked
			return;
		}else{
			$("#dot_lsrStk").css('display', 'inline-block');
			var timestamp = parseInt(Date.now()/1000);//divide by 1000 ms to get 10 digit Unix like from solidity
			if(stakeData[2] < timestamp){//expired - show unstake button
				$('#_stk_expiry').css('color', '#ff4747');//red
				$("#shl_unstake").hide();
			}else{
				$('#_stk_expiry').css('color', '#04C86C');//green
				$("#shl_unstake").show();
			}
		}
		
		var amount = (stakeData[0] / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var duration = stakeData[1];
		if(stakeData[2] > 0){
			var expiry = new Date(stakeData[2] * 1000).toLocaleString();
		}else{
			var expiry = '0/0/0000';
		}
		var rrpass = stakeData[3];
		if(rrpass==false){var rrpass='false';}else{var rrpass = 'true';}
		//claims
		var claims = await tokenInst.methods._totalEthReflectedST(MyLibrary.wallet).call();
		var claims = fromWeiToFixed8_unrounded(claims);
		//add values
		$('#_stk_tokens').empty().append(amount);
		$('#_stk_duration').empty().append(duration); 
		$('#_stk_claims').empty().append(claims);
		$('#_stk_expiry').empty().append(expiry);
		$('#_stk_rrpass').empty().append(rrpass);
	}catch(error) {
		console.log(error); 
	}
	return;
}


//STATIC CALLS SECTION
async function port_staticView(){
	//wallet balance
	var walletbalance = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
	var walletbalance = (walletbalance / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	var walletbalance = parseFloat(walletbalance);//float so we can add the values not concate

	//acpt 
	try{
		var acpt = await averageCost();//parsed human readable return
		$('#mbcard_acpt').empty().append(acpt + ' avg-cost-per-token');
	}catch(error) {
		console.log(error); 
	}

	//average gains vs acpt fromWeiToFixed8
	try{
		var price = await tokenETHprice();//parsed human readable return
		var gainlossRaw = (walletbalance * price) - (walletbalance *acpt);
		var gainloss = gainlossRaw.toFixed(8);
		if (Math.sign(gainloss) === -1) {//if -ve
			var gainloss = '<p class="markred">'+gainloss+' eth loss</p>';
		}else{
			var gainloss = '<p class="markgreen">'+gainloss+' eth gain</p>';
		}
		$('#mbcard_avgain').empty().append(gainloss);
	}catch(error) {
		console.log(error); 
	}

	//Russian Roulette Tax Status
	try{
		var eligibility = await tokenInst.methods.isTaxExcluded(MyLibrary.wallet).call();
		var scheduledValue = await rbw_tokenInst.methods.getReserveRequire().call();
		//remember scheduledValue is inflated by 1 * 1e18 in contract (to calc prices properly), so double unwei
		var scheduledValue = web3.utils.fromWei(scheduledValue, "ether"); 
		var scheduledValue = parseInt(scheduledValue).toFixed(0);
		var scheduledValue = web3.utils.toBN(scheduledValue);
		var scheduledValue = fromWeiToFixed8(String(scheduledValue));
		var scheduledValue = parseFloat(scheduledValue);
		//get tokens count
		var arrayWinners = await tokenInst.methods.ScheduledSells().call();
		var number_of = arrayWinners.length;
		MyLibrary.winnersTokens = 0;

		//add value of tokens they hold
		if(number_of > 0){
			let array = arrayWinners;
			for (const lease of array){
				var balance = await tokenInst.methods.balanceOf(lease).call();
				var balance = (balance / Math.pow(10, MyLibrary.decimals)).toFixed(4);
				MyLibrary.winnersTokens += parseFloat(balance);//float so we can add
			}
		}
		//add value of tokens they hold
		if(scheduledValue > 0){
			$('#mbcard_rrdayBatch').empty().append(number_of + ' Winners This Month \n'+(MyLibrary.winnersTokens).toFixed(2)+' tokens | ' + scheduledValue + ' eth');
		}else if(number_of == 0){//no claims yet popup
			$('#mbcard_rrdayBatch').empty().append('0 Winners Scheduled');
		}
	}catch(error) {
		console.log(error); 
	}
	//bokkypoobah 1-monday, 6 - saturday, 7-sunday
	var today = new Date();
	var todaytheday = today.getDay();
	
	//output
	if(eligibility == true && todaytheday == 6){//JS 6 - Saturday, Sunday 0, Monday 1...
		$('#mbcard_taxstatus').empty().append('<p class="markgreen">10% Sell Tax Today</p>');
	}else if(eligibility == true && todaytheday != 2){
		$('#mbcard_taxstatus').empty().append('<p class="markgreen">10% Sell Tax Saturday</p>');
	}else if(eligibility == false){
		$('#mbcard_taxstatus').empty().append('<p class="markred">90% Sell Tax Today</p>');
	}

	//Blacklist Status / Bot Status
	try{
		var isBot = await tokenInst.methods.isBot(MyLibrary.wallet).call();
		//if added as bot
		if(isBot == true){
			$('#mbcard_blacklisted').empty().append('<p class="markred">Bot Account</p>');
			$('#mbcard_blacklistRights').empty().append('Your tokens are restricted: Sell, Transfer, ShareLeasing, Staking, Claiming Rewards.');
		}else if(isBot == false){
			$('#mbcard_blacklisted').empty().append('<p class="markgreen">Clean Account</p>');
			$('#mbcard_blacklistRights').empty().append('You can: Sell, Transfer, ShareLease, Stake, Claim Rewards.');
		}
	}catch(error) {
		console.log(error); 
	}
	
	//NET WORTH 
	try{
		//-wallet
		var walletbalance = walletbalance;
		//-staked
		var stakeData = await tokenInst.methods.getStakeData(MyLibrary.wallet).call();
		var stakedTokens = 0;
		if(stakeData[0] > 0){//nothing staked
			var stakedTokens = (stakeData[0] / Math.pow(10, MyLibrary.decimals)).toFixed(0);
			var stakedTokens = parseFloat(stakedTokens);
		}
		//-leased
		var leaseIssued = await tokenInst.methods.getShareLease(MyLibrary.wallet).call({from: MyLibrary.wallet});
		var leasedTokens = 0;
		if(leaseIssued[0] > 0){//nothing leased
			var leasedTokens = (leaseIssued[0] / Math.pow(10, MyLibrary.decimals)).toFixed(0);
			var leasedTokens = parseFloat(leasedTokens);
		}
		//-delegated ShareLease
		var delegatedLease = await tokenInst.methods._shareDelegation(MyLibrary.wallet).call();
		var delegatedTokens = 0;
		if(delegatedLease[0] > 0){//nothing delegated
			var delegatedTokens = (delegatedLease[0] / Math.pow(10, MyLibrary.decimals)).toFixed(0);
			var delegatedTokens = parseFloat(delegatedTokens);
		}
		//-delegated Sell
		var delegatedSell = await tokenInst.methods._sellDelegation(MyLibrary.wallet).call();
		var delegatedTokens_s = 0;
		if(delegatedSell[0] > 0){//nothing delegated
			var delegatedTokens_s = (delegatedSell[0] / Math.pow(10, MyLibrary.decimals)).toFixed(0);
			var delegatedTokens_s = parseFloat(delegatedTokens_s);
		}
		//-nET Assets Combined
		var netAssetBasket = walletbalance + stakedTokens + leasedTokens + delegatedTokens + delegatedTokens_s;
		var netAssetBasketDisplay = Number(netAssetBasket).toFixed(2)
		//-nET Worth
		var netWorth = (netAssetBasket * price).toFixed(8);
		//breakdown
		var walletPerce = (walletbalance / netAssetBasket * 100).toFixed(1);
		var stakedPerce = (stakedTokens / netAssetBasket * 100).toFixed(1);
		var leasedPerce = (leasedTokens / netAssetBasket * 100).toFixed(1);
		var delLeasePerce = (delegatedTokens / netAssetBasket * 100).toFixed(1);
		var delSellPerce = (delegatedTokens_s / netAssetBasket * 100).toFixed(1);
		//-isZero
		if(netAssetBasket == 0){
			$('#mbcard_netassets').empty().append(0 + ' GUN (wallet,staked,leased,delegated)');
			$('#mbcard_netassetsValue').empty().append(0 + ' eth NetWorth');
		}else{
			$('#mbcard_netassets').empty().append(netAssetBasketDisplay + ' GUN {wal '+walletPerce+'%, staked '+stakedPerce+'%, leased '+leasedPerce+'%, dLease '+delLeasePerce+'%, dSell '+delSellPerce+'%}');
			$('#mbcard_netassetsValue').empty().append('<p class="markgreen">'+netWorth+' eth NetWorth</p>');
		}
	}catch(error) {
		console.log(error); 
	}

	//NET REWARDS CLAIMED
	try{
		var rewarded_ethW = 0; var rewarded_ethB = 0; var rewarded_ethS = 0; var rewarded_ethSL = 0;
		//-rewards wallet
		var rewardsDataW = await tokenInst.methods._netEthRewardedWallet(MyLibrary.wallet).call();
		var rewarded_ethW = fromWeiToFixed8_unrounded(String(rewardsDataW));//string result of toFixed
		var rewarded_ethW = parseFloat(rewarded_ethW);
		//-rewards beneficiary
		var rewardsDataB = await tokenInst.methods._netRewardsmyDonors(MyLibrary.wallet).call();
		var rewarded_ethB = fromWeiToFixed8_unrounded(rewardsDataB);//string result of toFixed
		var rewarded_ethB = parseFloat(rewarded_ethB);
		//-rewards staked
		var rewardsDataS = await tokenInst.methods._totalEthReflectedST(MyLibrary.wallet).call();
		var rewarded_ethS = fromWeiToFixed8_unrounded(rewardsDataS);
		var rewarded_ethS = parseFloat(rewarded_ethS);
		//-rewards sharelease
		var rewardsDataSL = await tokenInst.methods._totalEthReflectedSL(MyLibrary.wallet).call(); 
		var rewarded_ethSL = fromWeiToFixed8_unrounded(rewardsDataSL);
		var rewarded_ethSL = parseFloat(rewarded_ethSL);
		//NET
		var netRewardsClaimed = Number(rewarded_ethW + rewarded_ethB + rewarded_ethS + rewarded_ethSL);//here to fixed turns it to human readable. not parseFloat. try it
		//display
		if(netRewardsClaimed == 0){
			$('#mbcard_netrewards').empty().append(0 + ' eth');
			$('#mbcard_netrewardsBreakdown').empty().append('{wallet: '+0+', donors: '+0+', staked: '+0+', leases: '+0+'}');
		}else{
			$('#mbcard_netrewards').empty().append('<p class="markgreen">'+netRewardsClaimed+' eth</p>');
			$('#mbcard_netrewardsBreakdown').empty().append('{wallet: '+rewarded_ethW+'eth, donors: '+rewarded_ethB+'eth, staked: '+rewarded_ethS+'eth, leases: '+rewarded_ethSL+'eth}');
		}
	}catch(error) {
		console.log(error); 
	}
	//NET REWARDS UNCLAIMED
	try{
		var reward_ethWD = 0; var reward_ethBD = 0; var reward_ethSD = 0; var reward_ethSLD = 0;
		//-rewards wallet
		var rewardsDataWD = await tokenInst.methods.currentRewardForWallet(MyLibrary.wallet).call();
		var reward_ethWD = fromWeiToFixed12(rewardsDataWD);//string result of toFixed
		var reward_ethWD = Number(reward_ethWD);//parsed to enable math
		//-rewards donors
		var benefactorsArray = await tokenInst.methods.viewBenefactors().call({from: MyLibrary.wallet});
		var number_of = benefactorsArray.length;
		//console.log('number of: '+number_of)
		MyLibrary.reward_ethBD = 0;
		if(number_of > 0){
			let array = benefactorsArray;
			for (const donor of array){
				var rewardDue = await tokenInst.methods.currentRewardForWallet(donor).call();
				var reward_due = fromWeiToFixed8(rewardDue);
				MyLibrary.reward_ethBD += Number(reward_due);//so we can add
			}
		}
		var reward_ethBD = MyLibrary.reward_ethBD;
		//-rewards staked
		var rewardsDataSD = await tokenInst.methods._checkStakeReflection().call({from: MyLibrary.wallet});
		var reward_ethSD = fromWeiToFixed12(rewardsDataSD);
		var reward_ethSD = parseFloat(reward_ethSD);//parsed to enable math
		//-rewards sharelease
		var leaseItem = await tokenInst.methods._checkOccupiedLease().call({from:MyLibrary.wallet});
		if(web3.utils.toBN(leaseItem[0]).isZero()){//zero address check 0x00
			var reward_ethSLD = 0;
		}else{
			var rewardsDataSLD = await tokenInst.methods._checkShareReflection(leaseItem[0]).call({from: MyLibrary.wallet});
			var reward_ethSLD = fromWeiToFixed12(rewardsDataSLD);
			var reward_ethSLD = parseFloat(reward_ethSLD);//parsed to enable math
		}
		//TOTAL
		var netRewardsDue = Number(reward_ethWD + reward_ethBD + reward_ethSD + reward_ethSLD);//here to fixed turns it to human readable. not parseFloat. try it
		//breakdown
		var walletPerce = (reward_ethWD / netRewardsDue * 100).toFixed(1);
		var donorPerce = (reward_ethBD / netRewardsDue * 100).toFixed(1);
		var stakedPerce = (reward_ethSD / netRewardsDue * 100).toFixed(1);
		var leasePerce = (reward_ethSLD / netRewardsDue * 100).toFixed(1);
		//display
		if(netRewardsDue == 0){
			$('#mbcard_netrewardsD').empty().append(0 + ' eth');
			$('#mbcard_netrewardsDBreakdown').empty().append('{wal '+0+'%, donors '+0+'%, staked '+0+'%, lease '+0+'% }');
		}else{
			$('#mbcard_netrewardsD').empty().append('<p class="markgreen">'+netRewardsDue+' eth</p>');
			$('#mbcard_netrewardsDBreakdown').empty().append('{wal '+walletPerce+'%, donors '+donorPerce+'%, staked '+stakedPerce+'%, lease '+leasePerce+'% }');
		}
	}catch(error) {
		console.log(error); 
	}
	//TOTAL POLLS PARTICIPATED IN
	try{
		//-total polls 
		var pollHistoryArray = await rbw_tokenInst.methods.getPollHistory(MyLibrary.wallet).call();
		var number_ofPolls = pollHistoryArray.length;
		var lastVote = 0;
		MyLibrary.bbVotes = 0;
		MyLibrary.trVotes = 0;

		//add value of tokens they hold
		if(number_ofPolls > 0){
			$('#sl_leases').empty();
			const pollsCount = number_ofPolls;
			let array = pollHistoryArray;
			for (const pollID of array){
				var pollIDBN = web3.utils.toBN(parseInt(pollID));
				var voteData = await rbw_tokenInst.methods.getPollInfoForVoter(pollIDBN, MyLibrary.wallet).call();
				if(voteData[0] == true){//true or 1 == BUYBACKS in RBW
					MyLibrary.bbVotes += 1;
				}
				if(voteData[0] == false){//false or 0 == TREASURY in RBW
					MyLibrary.trVotes += 1;
				}
				if(!-- number_ofPolls){//last item, get last vote timestamp
					var lastVote = voteData[2];
				}
			}
			
			//prepare last vote time
			var lastVote = new Date(lastVote * 1000).toLocaleString([],{month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false});
			//display
			$('#mbcard_totalPollsVoted').empty().append(pollsCount +' Polls <span class="rbbLsmall">(last: '+lastVote+')</span>');
			$('#mbcard_voteStats').empty().append(MyLibrary.bbVotes  + ' BuyBack Votes | ' + MyLibrary.trVotes + ' Treasury Votes');
		}else{//no claims yet popup
			$('#mbcard_totalPollsVoted').empty().append('0 Polls');
			$('#mbcard_voteStats').empty().append('0 BuyBack Votes ~ 0 Treasury Votes');
		}
	}catch(error) {
		console.log(error); 
	}
	//SIXERS SPOTS
	try{
		var sixers = await tokenInst.methods._sixersSlot().call();
		var sixersLimit = await tokenInst.methods._sixersLimit().call();
		var sixersCount = parseFloat(sixers);//float to enable math
		var sixersLimit = parseFloat(sixersLimit);//float to enable math
		var sixersLeft = sixersLimit - sixersCount;
		if(sixersLeft > 0){
			//display
			$('#mbcard_sixersSpotsLeft').empty().append(sixersLeft +' Spots left this month');
		}else{//none
			$('#mbcard_sixersSpotsLeft').empty().append(0 +' Spots left this month');
		}
	}catch(error) {
		console.log(error); 
	}
	//myPlays
	try{
		var lastPlay = await tokenInst.methods._lastPlay(MyLibrary.wallet).call();
		var lastPlayTime = parseFloat(lastPlay);
		
		if(lastPlayTime > 0){
			var lastPlayTime = new Date(lastPlayTime * 1000).toLocaleString([],{month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false});
			//display
			$('#mbcard_lastPlay').empty().append('Last Play: ' + lastPlayTime);
		}else{//none
			$('#mbcard_lastPlay').empty().append('Last Play: 00:00/00/00');
		}
	}catch(error) {
		console.log(error); 
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
//========================================================================
//CLICK INITIATED CALLS
//HANDLE ALL EVENTS HERE
//change claim source
$(document).on('click', '#cs_1', function(e){
	MyLibrary.claimsource = 1;//wallet
	document.getElementById("claimfrom").innerHTML = "from Wallet";
	resetClaimFields();
	claimCardsRefresh();
});
$(document).on('click', '#cs_2', function(e){
	MyLibrary.claimsource = 2;//share lease
	document.getElementById("claimfrom").innerHTML = "from Lease";
	resetClaimFields();
	claimCardsRefresh();
});
$(document).on('click', '#cs_3', function(e){
	MyLibrary.claimsource = 3;//staked
	document.getElementById("claimfrom").innerHTML = "from Staked";
	resetClaimFields();
	claimCardsRefresh();
});
//claim rewards: from HypeCards section & claim cards
// - just point where you want to claim from
$(document).on('click', '#_portBtnClaim', function(e){
	var claimCallOrigin = 1;//Top Claim Card Left
	MyLibrary.claimsource = 2;// 1 - wallet, 2 - sharelease, 3 - staked
	claimRewardsMultiSource(claimCallOrigin);
});
$(document).on('click', '#_portBtnClaimSTK', function(e){
	var claimCallOrigin = 1;//Top Claim Card Left
	MyLibrary.claimsource = 3;// 1 - wallet, 2 - sharelease, 3 - staked
	claimRewardsMultiSource(claimCallOrigin);
});
//- claim cards, dont point, the claimsource is already set in dropdown clicks
$(document).on('click', '#claim_fmw', function(e){
	var claimCallOrigin = 1;//Top Claim Card Left
	claimRewardsMultiSource(claimCallOrigin);
});
//claim from donors put separately for clarity only, othersie covered in from wallet
$(document).on('click', '#claim_fmb', function(e){
	var claimCallOrigin = 1;
	MyLibrary.claimsource = 1;
	claimRewardsMultiSource(claimCallOrigin);
});
//claims history
$(document).on('click', '#show_claims_w', function(e){
	console.log('fetching claims...');	
	rewardsClaimed();
});
//Benefactors list
$(document).on('click', '#show_benefactors', async function(e){
	console.log('fetching benefactors...');
	var benefactorsArray = await tokenInst.methods.viewBenefactors().call({from: MyLibrary.wallet});
	var number_of = benefactorsArray.length;
	
	MyLibrary.donorlist = '';
	//fetch their value
	if(number_of > 0){
		let array = benefactorsArray;
		for (const donor of array){
			console.log(donor)
			var rewardDue = await tokenInst.methods.currentRewardForWallet(donor).call();
			var reward_due = fromWeiToFixed8(rewardDue);
			//make donor list entry
			var first = donor.substring(0, 8);//get first 5 chars
			var last = donor.slice(donor.length - 5);//get last 5
			var trancatedAdd = first+'...'+last;
			var donorEntry = '<li class="beneLi"><span class="bene_tag">'+ trancatedAdd +'</span><span class="reward_tag">'+ reward_due + ' eth</span></li>';
			MyLibrary.donorlist += donorEntry;
			//display
			var chd = '<div class="benesum">'+number_of+' Benefactors</div><div class="donor_case">'+MyLibrary.donorlist+'</div>';
			swal({
				title: "Benefactors List",
				text: chd,
				html: true,
				showCancelButton: false,
				dangerMode: false,
				confirmButtonText: "Thanks!",
				confirmButtonColor: "#8e523c",
				closeOnConfirm: true
			});
		}
	}else if(number_of == 0){//no donors
		MyLibrary.donorlist = '<li class="claimtx"><span class="claim_tag">No benefactors found for your wallet..</span></li>';
		//display
		var chd = '<div class="claimsum">No benefactors</div><div class="clms_case">'+MyLibrary.donorlist+'</div>';
		swal({
			title: "Benefactors List",
			text: chd,
			html: true,
			showCancelButton: false,
			dangerMode: false,
			confirmButtonText: "Thanks!",
			confirmButtonColor: "#8e523c",
			closeOnConfirm: true
		});
	}
});
//Remove Beneficiary
$(document).on('click', '#removeWallet', function(e){
	removeBeneficiary();
});


/* future us, event binding to hidden element now visible
$(document).on('click', '#commentField', function(e){   
	$('#commentField').bind("blur focus keydown keypress keyup", function(){recount();});
	$('input.commentsubmitButton').attr('disabled','disabled');
	
});
*/

//Stake Tokens
$(document).on('click', '#stkmax', async function(e){
	var amount = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
	document.getElementById("stake_amnt").value = fromWeiToFixed2_unrounded(amount);
});
$(document).on('click', '#unstkmax', async function(e){
	var amount = await tokenInst.methods.getStakeData(MyLibrary.wallet).call();
	var amount = amount[0];
	document.getElementById("unstake_amnt").value = fromWeiToFixed2_unrounded(amount);
});
$(document).on('click', '#stake', function(e){
	var inputAmnt = $('#stake_amnt').val();
	var duration = $('#stake_duration').val();
	stakeTokens(duration, inputAmnt);
});
$(document).on('click', '#unstake', function(e){
	var inputAmnt = $('#unstake_amnt').val();
	unstakeTokens(inputAmnt);
});
//Beneficiary
$(document).on('click', '#benef_settings', function(e){
	beneficiarySetting();
});
//Expand portfolio sharelease card
$(document).on('click', '#shlc_exp', function(e){
	if($('#shlcBody').css('height')=='0px'){
		$('#shlcBody').css({'display' : 'block'});
		$('#shlcBody').animate({height: "100px"}, 400, "swing", function(){});
	}else{
		$('#shlcBody').animate({height: "0px"}, 300, "swing", function(){});
	}
});
//Expand portfolio staked card
$(document).on('click', '#stk_exp', function(e){
	if($('#stkBody').css('height')=='0px'){
		$('#stkBody').css({'display' : 'block'});
		$('#stkBody').animate({height: "100px"}, 400, "swing", function(){});
	}else{
		$('#stkBody').animate({height: "0px"}, 300, "swing", function(){});
	}
});
//Scroll depended calls
$(document).ready(function () {
	portfolioActive = false;//flag to call once
	//defaults
	var scrollTop     = $(window).scrollTop();
	var elementOffset = $('.portfolioSect').offset().top;
	var distanceToTop      = (elementOffset - scrollTop);

	$(window).scroll(function (event) {
		var scrollTop     = $(window).scrollTop();
		var elementOffset = $('.portfolioSect').offset().top;
		var distanceToTop      = (elementOffset - scrollTop);
		//console.log(distanceToTop);
		if (distanceToTop < 250) {
			$('.jumpTop').show();
			$('.jumpBottom').hide();
			//console.log('portfolio in view')
		} else {
			$('.jumpTop').hide();
			$('.jumpBottom').show();
			//console.log('portfolio far')
		}
		//separated to give specific range for call
		if (distanceToTop < 300 && distanceToTop > 0 && portfolioActive == false) {
			const setPortIntervalAsync = (fn, ms) => {
				fn().then(() => {
					window.portTimeout = setTimeout(() => setPortIntervalAsync(fn, ms), ms);
				});
			};
			setPortIntervalAsync(async () => {
				//alert('refreshing...')
				portfolioActive = true;
				portfolioRefresh();
			}, 60000);
		}
		//eventCard hidden when we get to the Hype cards
		if (distanceToTop < 550) {
			$('.eventsNotice').hide();
		} else {
			$('.eventsNotice').show();
		}
		//Preload some stuff
		if (distanceToTop < 750) {
			$('#donateSection').css('background-image','url(img/love.gif)');
		}

		//if we go to top stop refreshes at bottom
		if (distanceToTop > 570 && portfolioActive == true) {
			if(window.portTimeout){
				clearTimeout(portTimeout);
				portfolioActive = false;//flag to call once
			}
		}
	});
	//defaults
	//eventCard hidden when we get to the Hype cards
	if (distanceToTop < 550) {
		$('.eventsNotice').hide();
	} else {
		$('.eventsNotice').show();
	}
	//eventCard hidden when we get to the Hype cards
	if (distanceToTop < 550) {
		$('.eventsNotice').hide();
	} else {
		$('.eventsNotice').show();
	}
	//Preload some stuff
	if (distanceToTop < 500) {
		$('#donateSection').css('background-image','url(img/love.gif)');
	}
});



//WORKSHOP
/*
$(document).ready(function(e) {
	//event listeners have to wait for the doc to be ready
	document.getElementById("bonfireInput").onkeydown =  event => { 
		calcBonfire();
	};
});

//Get transaction 
var transaction = '0x99df4297764852e555e8fbe412c8e0e4cc83774dc53c49f9e1c047f1ac8faae6';
	try{
		web3.eth.getTransaction(transaction, function(error, result) {
			let tx_data = result.input;
			let input_data = '0x' + tx_data.slice(10);  // get only data without function selector

			let params = web3.eth.abi.decodeParameters(['bytes32', 'string', 'string', 'string'], input_data);
			console.log(params);
		});
	}catch(error) {
		console.log(error); 
	}
	*/