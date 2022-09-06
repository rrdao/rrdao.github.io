MyLibrary.activePoll = false;

//Create Rebalancing Poll
async function createRBWPoll(){
	//so check active frequency
	MyLibrary.rbFrequency = await rbw_tokenInst.methods._RBfrequency().call();
	
	//estimate gasLimit
	var encodedData = rbw_tokenInst.methods.newPoll().encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.rbwallet
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice(); 
	//create new poll
	rbw_tokenInst.methods.newPoll().send({
		from: MyLibrary.wallet,
   		gasPrice: gasPrice,
		gasLimit: estimateGas
	})
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
//Conclude Poll
async function concludePoll(){
	//check active poll
	var currentPoll = await rbw_tokenInst.methods._pollCount().call();
	var pollID = web3.utils.toBN(currentPoll);
	//estimate gasLimit
	var encodedData = rbw_tokenInst.methods.endPoll(pollID).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.rbwallet
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice(); 
	//conclude poll
	rbw_tokenInst.methods.endPoll(pollID).send({
		from: MyLibrary.wallet,
   		gasPrice: gasPrice,
		gasLimit: estimateGas
	})
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
//TRANSACTION NOTIFICATION - POLL END
rbw_tokenInst.events.pollEnded()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var tx_hash = event.transactionHash;
		var treasuryVotes = event.returnValues[1];
		var buybackVotes = event.returnValues[2];	
		var treasuryVotes = parseFloat(treasuryVotes);	
		var buybackVotes = parseFloat(buybackVotes);

		//message
		var message = 'Poll Concluded Successfully';
		var nonTxAction = 'Treasury votes: '+treasuryVotes+', BuyBack votes: '+buybackVotes;
		var outputCurrency = '';//or GUN - currency focus is outcome of Tx
		var type = 'success';//or error
		var wallet = '';
		//wait for the rebalance notification: MyLibrary.popuptimer = 20;
		setTimeout( function() {
			//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
			popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		}, 1000);
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//TRANSACTION NOTIFICATION - POLL END RB BUYBACK
rbw_tokenInst.events.rbBUYBACK()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var tx_hash = event.transactionHash;
		var ethDeployed = event.returnValues[1];
		var ethDeployed = fromWeiToFixed8(ethDeployed);
		var tokensBought = event.returnValues[2];
		var tokensBought = (tokensBought / Math.pow(10, MyLibrary.decimals)).toFixed(2);

		//message
		var message = 'Rebalance Event';
		var nonTxAction = ethDeployed+' eth deployed ('+tokensBought+' GUN Burnt)';
		var outputCurrency = '';//or GUN - currency focus is outcome of Tx
		var type = 'success';//or error
		var wallet = '';
		//wait for the rebalance notification: MyLibrary.popuptimer = 20;
		setTimeout( function() {
			//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
			popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		}, 22000);
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//TRANSACTION NOTIFICATION - POLL END RB TREASURY
rbw_tokenInst.events.rbTREASURY()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var tx_hash = event.transactionHash;
		var ethDeployed = event.returnValues[0];
		var ethDeployed = fromWeiToFixed8(ethDeployed);

		//message
		var message = 'Rebalance Event';
		var nonTxAction = ethDeployed+' eth deployed';
		var outputCurrency = '';//or GUN - currency focus is outcome of Tx
		var type = 'success';//or error
		var wallet = '';
		//wait for the rebalance notification: MyLibrary.popuptimer = 20;
		setTimeout( function() {
			//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
			popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		}, 22000);
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//Auto Rebalancing
async function autoRebalance(){
	//check if theres active poll & throw error if yes..will revert with same msg
	var currentPoll = await rbw_tokenInst.methods._pollCount().call();
	var currentPoll = parseFloat(currentPoll);//float to enable math
	//estimate gasLimit
	var encodedData = rbw_tokenInst.methods.autoRebalancingCheck().encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.rbwallet
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice(); 
	//create new poll
	rbw_tokenInst.methods.autoRebalancingCheck().send({
		from: MyLibrary.wallet,
   		gasPrice: gasPrice,
		gasLimit: estimateGas
	})
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
//TRANSACTION NOTIFICATION AUTOREBALANCE: checks verdict if poll, lp, treasury happened
rbw_tokenInst.events.rbCHECK()
	.on('data', async function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		//event emitted carries verdict
		var verdict = event.returnValues[2];//0 - community poll decides, 1 - perfom buyback, 2 - send to treasury
		var verdict = parseInt(verdict);
		//get initialRBB
		var curRBB = event.returnValues[1];
		var curRBB = fromWeiToFixed2_unrounded(String(curRBB));		
		var curRBB = parseFloat(curRBB);
		//get returned amounts from verdict
		var amount = event.returnValues[3];//amount types returned: verdict val 0 - ethDeployed, verdict val 1 - tokens bought, verdict val 2 - ethDeployed
		var tx_hash = event.transactionHash;

		//verdict determines message & amounts
		if(verdict==2){//buybacks limit reached,send to treasury,foregore
			var displayAmount = fromWeiToFixed8(amount);
			var message = 'Treasury Auto-Rebalanced';
			var nonTxAction = 'out-of-range, rbb was: '+curRBB+' \n(Treasury given: '+displayAmount+' eth)';
		}
		if(verdict==1){//beyond allowed (1.5) limit, perfom buyback
			var amount = (amount / Math.pow(10, MyLibrary.decimals));
			var displayAmount = amount.toFixed(2);
			var message = 'BuyBack Auto-Rebalanced';
			var nonTxAction = 'out-of-range, rbb was: '+curRBB+' \n(Bonfire of: '+displayAmount+' gun)';
		}
		if(verdict==0){//within allowed range 1 -- 1.5
			var currentPoll = await rbw_tokenInst.methods._pollCount().call();
			var currentPoll = parseFloat(currentPoll);//float to enable math

			var gotPoll = await rbw_tokenInst.methods.getPoll(currentPoll).call();
			var expiryRaw = parseFloat(gotPoll[5]);//float to enable math
			var expiry = new Date(expiryRaw * 1000).toLocaleString([],{month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false});
			var message = 'Rebalancing Poll#'+currentPoll+' Created';
			var nonTxAction = 'Expiry: '+expiry+' (poll-frequency: '+MyLibrary.rbFrequency+' /hr)';
		}

		var outputCurrency = '';//or GUN - currency focus is outcome of Tx
		var type = 'success';//or error
		var wallet = '';
		
		//async wont wait	//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
		port_RBWallet();
		withdrawalRequestPoll();
		popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//TRANSACTION NOTIFICATION WITHDRAWAL REQUEST
tre_tokenInst.events.request()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event);
		var tx_hash = event.transactionHash;
		var requestNo = event.returnValues[0];
		var ethRequested = event.returnValues[1];
		var ethRequested = fromWeiToFixed8(String(ethRequested));		
		var ethRequested = parseFloat(ethRequested);
		var ethAvailable = event.returnValues[2];
		var ethAvailable = fromWeiToFixed8(String(ethAvailable));		
		var ethAvailable = parseFloat(ethAvailable);

		//message
		var lastRequest = event.returnValues[3];
		var lastRequestFloat = parseFloat(lastRequest);
		var lastRequest = new Date(lastRequestFloat * 1000).toLocaleString([],{month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false});
		var message = 'Treasury Withdrawal Request #'+requestNo+'';
		var nonTxAction = 'RBB still out of range after BuyBack. \nRequested: '+ethRequested+' eth, Available: '+ethAvailable+' eth, Expires: 12 hours';
		var outputCurrency = '';//or GUN - currency focus is outcome of Tx
		var type = 'success';//or error
		var wallet = '';
		//wait for the rebalance notification: MyLibrary.popuptimer = 20;
		setTimeout( function() {
			//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
			popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		}, 22000);
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//RBW card refresh
async function port_RBWallet(){

	var rbwallet = MyLibrary.rbwallet;
	var first = rbwallet.substring(0, 8);//get first 5 chars
	var last = rbwallet.slice(rbwallet.length - 5);//get last 5
	var trancatedAdd = first+'...'+last;
	$('#rbwWallet').empty().append('<a href="'+MyLibrary.etherScan+'/address/'+rbwallet+'" target="_blank" title="view on EtherScan..">'+trancatedAdd+'</a><img src="img/external.svg" />');
	//net outflows
	var netTreasury = await rbw_tokenInst.methods._totalRBW_treasury().call();
		var netTreasury = parseFloat(netTreasury);//float so we can add the values not append
	var netBuyBacks = await rbw_tokenInst.methods._totalRBW_buybacks().call();
		var netBuyBacks = parseFloat(netBuyBacks);//float so we can add the values not append
	var ETHbalance = await web3.eth.getBalance(MyLibrary.rbwallet);
	var displayEth = fromWeiToFixed5_unrounded(ETHbalance);

	$('#dot_Pol').css('display', 'inline-block');

	
	var netETHDispersed = String(netTreasury + netBuyBacks);
	var netETHfixed = fromWeiToFixed8_unrounded(netETHDispersed);
	
	if(netETHDispersed == 0){
		var netTrePercent = 0;
		var netBbPercent = 0;
	}else{
		var netTrePercent = netTreasury / netETHDispersed * 100;//in wei
		var netTrePercent = (netTrePercent).toFixed(1);
		var netBbPercent = netBuyBacks / netETHDispersed * 100;//in wei
		var netBbPercent = (netBbPercent).toFixed(1);
	}
	
	//alert(netTreasury+'---'+netETHDispersed+'---'+netBuyBacks+'---'+netTrePercent)
	//display outflows
	$('#dispGS_tr').empty().append(netTrePercent+' %');
	$('#dispGS_bb').empty().append(netBbPercent+' %');
	$('#dispeAmount').empty().append(netETHfixed+' eth');
	$('#RBWbB').empty().append(displayEth+' eth');
	//NVL calculation
	//fetch from main contract
	var totalBuyBackETHOG = await tokenInst.methods._totalBuyBackETH().call();
		var totalBuyBackETH = parseFloat(totalBuyBackETHOG);//float to enable math
	var totalNVL_proxysell = await tokenInst.methods._totalNVL_proxysell().call();
		var totalNVL_proxysell = parseFloat(totalNVL_proxysell);//float to enable math
	var totalNVL_dexsell = await tokenInst.methods._totalNVL_dexsell().call();
		var totalNVL_dexsell = parseFloat(totalNVL_dexsell);//float to enable math
	var currentNVL = totalNVL_proxysell + totalNVL_dexsell;
	var currentNVLdisp = fromWeiToFixed8(String(currentNVL));
	var currentBBSdisp = fromWeiToFixed8(String(totalBuyBackETH));
	if(totalBuyBackETH > 0 && currentNVL > 0){//0 dividedby 0 = infinity in Js
		var RBB_ratio = (currentNVL / totalBuyBackETH);
	}else{
		var RBB_ratio = 0;//no sells, no buy backs
	}

	//display RBB levels
	var fixed = 2;
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    var RBB_ratio = RBB_ratio.toString().match(re)[0];	

	$('#rbbNVL').empty().append('{NVL '+currentNVLdisp+'eth}');
	$('#rbbBBS').empty().append('{BBS '+currentBBSdisp+'eth}');
	$('#rbbLevelF').empty().append(RBB_ratio);
		//Calibration: Set to be as near to 1 as possible, or stay at 1.
		// If value = 1 ~ meter 100%, if value = 1.1 ~ meter 90%
		// 100 - (value * 100 - 100) %
		var length = 100 - (RBB_ratio * 100 - 100);
		if(length < 0){ //we are too far behind, but fix guage at red max only otherwise it disappears behind our card
			var length = 0;
		}else if(length > 100){//200 if rbb is zero(0 sells /0 buybacks)
			var length = 100;
		}
		if(currentNVL > 0 && totalBuyBackETH == 0){//sells perfomed, but no buybacks yet
			var length = 0;
		}
	$('#meter_bar').css({'display': 'block', 'right' : length+'%'});
	//reset
	$('#createPoll, #rebalance').removeAttr('style');
	$('#createPoll, #rebalance').prop('disabled', false);
	//check rbb verdict
	if(RBB_ratio<1 || RBB_ratio>1.5){
		$('#rbbVerdict').empty().append('{auto-rebalancing range}');
		$('#createPoll').css({'background-color':'#373737'});//disable
		$('#createPoll').prop('disabled', true);
	}else if(RBB_ratio>1 && RBB_ratio<1.5){
		$('#rbbVerdict').empty().append('{polling range}');
		$('#rebalance').css({'background-color':'#373737'});//disable
		$('#rebalance').prop('disabled', true);
	}else if(RBB_ratio ==0){
		$('#rbbVerdict').empty().append('{auto-rebalancing range - start Bonfire #1}');
		$('#createPoll').css({'background-color':'#373737'});//disable
		$('#createPoll').prop('disabled', true);
	}
	//LAST POLL STATUS + TIME, AND NEXT POLL COUNT
	//not using check curactivePoll bool approach cz we want all 3 poll stages
	//============================================
	var currentPoll = await rbw_tokenInst.methods._pollCount().call();
	var currentPoll = parseFloat(currentPoll);//float to enable math
	var lastPoll = currentPoll-1;//only if cur in not poll#1
	var lastPollTime = '00:00/00/00';
	if (Math.sign(lastPoll) === -1) {//if -ve
		var lastPollTime = '00:00/00/00';
	}else{
		if(lastPoll > 0){
			var lastPollTime = await rbw_tokenInst.methods.getPollExpirationTime(lastPoll).call();
			var lastPollTime = parseFloat(lastPollTime);
			var lastPollTime = new Date(lastPollTime * 1000).toLocaleString([],{month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false});
			//get its verdict from poll status, returns index where action is defined; in_progress=0, treasury=1, buyback=2
			var lastPollVerdict = await rbw_tokenInst.methods.getPollStatus(lastPoll).call();//last poll status
			var lastPollVerdict = parseFloat(lastPollVerdict);//float to enable math
			if(lastPollVerdict == 0){var lastPollVerdict = 'still in progress';}
			if(lastPollVerdict == 1){var lastPollVerdict = 'passed-Treasury';}
			if(lastPollVerdict == 2){var lastPollVerdict = 'passed-Bonfire';}

			//console.log('poll status: '+lastPollVerdict)
		}else{
			var lastPollTime = '00:00/00/00';
			var lastPollVerdict = 'no previous poll';
		}
		//print last poll verdict
		$('#lastPoll').empty().append('Last Poll: '+lastPollTime +' ~ <b>RBW Verdict:</b> '+lastPollVerdict);
	}
	var nextPoll = currentPoll + 1;
	$('#createPoll').empty().append('Create Poll '+nextPoll);

	//CURRENT POLL STATUS
	//============================
	if(currentPoll == 0){//just avoids the revert on none existant poll struct
		var today = new Date();
		var dayToday = today.getDay();
		//initialise
		$("#pollStandby, #pollVotingCard, #pollConclude").hide();
		//check day
		if(dayToday == MyLibrary.RRDay){//6 is Saturday in getDay(), Sunday 0, Monday 1....
			//RR Day - Saturdays - no voting just auto-rebalancing with buybacks to normal RBB
			$('#createPoll').hide();
			$("#pollStandby").show();
			$('#standByTxt').empty().append('Russian Roulette Day - No Polls - BuyBacks Only (Auto-Rebalance)');
		}
	}else{
		var getpollID = web3.utils.toBN(currentPoll);
		var gotPoll = await rbw_tokenInst.methods.getPoll(getpollID).call();
		var expiryRaw = parseFloat(gotPoll[5]);//float to enable math
		var expiryTime = new Date(expiryRaw * 1000).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: false});
		var expires = parseFloat(gotPoll[5]);//float to enable math
		
		var timestamp = parseInt(Date.now()/1000);//divide by 1000 ms to get 10 digit Unix like from solidity
		var pollstatus = await rbw_tokenInst.methods.getPollStatus(currentPoll).call();//current poll status..returned as Int not string
		var pollstatus = parseFloat(pollstatus);//float to enable math
			if(pollstatus == 0){var curPollVerdict = 'still in progress';}
			if(pollstatus == 1){var curPollVerdict = 'passed-Treasury';}
			if(pollstatus == 2){var curPollVerdict = 'passed-Bonfire';}
		
		//Voters count
		var treasuryVotes = parseFloat(gotPoll[0]);//float to enable math
		var buybackVotes = parseFloat(gotPoll[1]);//float to enable math
		var voters = treasuryVotes + buybackVotes;
		

		$("#pollStandby, #pollVotingCard, #pollConclude").hide();
		var today = new Date();
		var dayToday = parseInt(today.getDay());
		
		if(dayToday == MyLibrary.RRDay){//6 is Saturday in getDay(), Sunday 0, Monday 1....
			//RR Day - Saturdays - no voting just auto-rebalancing with buybacks to normal RBB
			$('#createPoll').hide();
			$("#pollStandby").show();
			$('#standByTxt').empty().append('Russian Roulette Day - No Polls - BuyBacks Only (Auto-Rebalance)');
		}else{
			//console.log(pollstatus+'---'+expires+'---'+timestamp)
			//poll status stored in enum, returns index where action is defined; in_progress=0, treasury=1, buyback=2
			if(pollstatus == 0 && expires > timestamp){//not expired, voting on
				MyLibrary.activePoll = true;
				$("#pollVotingCard").show();
				$('#pollID').empty().append('#'+currentPoll);
				//active poll, you cant create new poll or rebalance
				$('#createPoll, #rebalance').prop('disabled', true);
				$('#createPoll, #rebalance').css({'background-color':'#373737'});//disable color
			}else if(pollstatus == 0 && expires < timestamp){//expired, not concluded
				$('#lastPoll').empty();
				if(voters < 2){//more voting needed
					//console.log('at least 20 votes needed to pass a poll')
					MyLibrary.activePoll = true;
					$("#pollVotingCard").show();
					$('#pollID').empty().append('#'+currentPoll);
				}else{//no more voting required
					//console.log('conclude vote, expired and more than 20 voters')
					$("#pollConclude").show();
					$('#pollEndTime').empty().append('Poll#'+currentPoll+' ended: '+expiryTime+'hrs');
					$('#pollEndVerd').empty().append('~ Verdict: Pending..');
				}
				//unconcluded expired poll, you cant create new poll or rebalance
				$('#createPoll, #rebalance').prop('disabled', true);
				$('#createPoll, #rebalance').css({'background-color':'#373737'});//disable color
			}else if(pollstatus == 1 || pollstatus == 2){//poll concluded
				$("#pollStandby").show();
				$('#lastPoll').empty().append('Last Poll: '+expiryTime +' ~ <b>RBW Verdict:</b> '+curPollVerdict);
			}
		}
		
	}
	
	//Part 2 - current poll, separated from above for readability: active poll details..only if active
	if(MyLibrary.activePoll == true){
		try{
			var rbbAtVoteStart = fromWeiToFixed2_unrounded(gotPoll[2]);
			var ethINQ = fromWeiToFixed8(gotPoll[3]);
			var pollcreator = gotPoll[6];
			var startTime = parseFloat(gotPoll[4]);//float to enable math
			var startTime = new Date(startTime * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
			var expireTime = parseFloat(gotPoll[5]);//passed to timer as unix int
			var nextPollTime = parseFloat(gotPoll[5]) + 600;
			var nextPollTime = new Date(nextPollTime * 1000).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: false});
	
			//fetch a few more: frequency, start time
			var pollFreq = await rbw_tokenInst.methods._RBfrequency().call();
			var pollFreq = parseFloat(pollFreq);//float to enable math
			//display
			$('#_pollETHINQ').empty().append(ethINQ);
			$('#_pollCREATOR').empty().append(pollcreator);
			$('#_pollFREQ').empty().append(pollFreq+' Hour');
			$('#_pollRBB').empty().append(rbbAtVoteStart+' RBB');
			$('#_pollSTART').empty().append(startTime+' hours');
			$('#_pollTIMETONEXT').empty().append(nextPollTime+' hours');
			$('#trVoteCount').empty().append(treasuryVotes);
			$('#bnVoteCount').empty().append(buybackVotes);
			//start countdowns
			pollCountdown(expireTime);
		}catch(error){
			console.log(error)
		}
	}
	return;
}

//Poll Countdown To Expiry
function pollCountdown(endUnix){
	
	setIntervalExpiry = (fn, ms) => {
		fn().then(() => {
			setTimeout(() => setIntervalExpiry(fn, ms), ms);
		});
	};
	//Unix 10 digit
	var countDownTo = parseInt(endUnix) * 1000;
	setIntervalExpiry(async function() {
		var now = parseInt(Date.now()); //Unix 10 digit
		var distance = parseInt(countDownTo - now);
		// If the count down is finished
		if (distance < 0) {
			document.getElementById("_pollEXPIRY").innerHTML = "<p class='markred'>EXPIRED</p>";
			return;
		}
		//console.log(distance+'-|--'+countDownTo+'--|--'+now)
		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		//print result
		document.getElementById("_pollEXPIRY").innerHTML = "<p class='markgreen'>"+hours + ":"
		+ minutes + ":" + seconds + "</p>";
		
	}, 1000);
}

//cast a vote
async function castVote(vote){
	var currentPoll = await rbw_tokenInst.methods._pollCount().call();
	var currentPoll = web3.utils.toBN(currentPoll);

	//estimate gasLimit
	var encodedData = rbw_tokenInst.methods.castVote(currentPoll,vote).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.rbwallet
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();

	//Send
	rbw_tokenInst.methods.castVote(currentPoll,vote).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: parseInt(estimateGas)})
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
rbw_tokenInst.events.voteCasted()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event); 

		var poll = event.returnValues[1];
		var vote = event.returnValues[2];
		var tx_hash = event.transactionHash;
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Vote Casted Successfully';
		var nonTxAction = 'voted '+vote+' ~ POLL#'+poll;
		popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		port_RBWallet();
		withdrawalRequestPoll();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);



/* TREASURY WITHDRAWAL REQUESTS
=============================================================================*/
async function withdrawalRequestPoll(){
	
	var treasurywallet = MyLibrary.treasurywallet;
	var first = treasurywallet.substring(0, 8);//get first 5 chars
	var last = treasurywallet.slice(treasurywallet.length - 5);//get last 5
	var trancatedAdd = first+'...'+last;
	$('#treWallet').empty().append('<a href="'+MyLibrary.etherScan+'/address/'+treasurywallet+'" target="_blank" title="view on EtherScan..">'+trancatedAdd+'</a><img src="img/external.svg" />');
	//net outflows
	var netRBWwithdrawals = await tre_tokenInst.methods._totalRBW_withdrawals().call();
	var netReceived = await tre_tokenInst.methods._totalRBW_receive().call();
	//balance 
	var ETHbalance = await web3.eth.getBalance(MyLibrary.treasurywallet);
	var displayEth = fromWeiToFixed5(ETHbalance);
	//requested amount
	//first check for active request
	var activeRequest = await tre_tokenInst.methods._curActiveRequest().call();
	//get request ID
	var requestIDraw = await tre_tokenInst.methods._requestCount().call();
		var requestID = web3.utils.toBN(requestIDraw);
		var requestIDfloat = parseFloat(requestIDraw);
	if(requestIDfloat == 0){//avoids revert errors
		$('#requestTimes').empty().append('{last request: 0/0/0000}');
	}else{
		var lastRequestTime = await tre_tokenInst.methods._lastRequest().call();
		var lastRequestTime = parseFloat(lastRequestTime);
		var withdrawRequest = await tre_tokenInst.methods.getWithdrawalRequest(requestID).call();
		//amount[2], start[4], expires[5], yey[6], nay[7]
		var requestAmount = fromWeiToFixed5_unrounded(withdrawRequest[2]);
		//start
		var requestStart = parseFloat(withdrawRequest[4]);
		var requestStart = new Date(requestStart * 1000).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: false});
		//expires
		var requestExpires = parseFloat(withdrawRequest[5]);
		var requestExpires = new Date(requestExpires * 1000).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: false});
		//last request time
		var lastRequestTime = new Date(lastRequestTime * 1000).toLocaleString([],{month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false});
		if(requestIDfloat < 1){
			$('#requestTimes').empty().append('{last: 0/0/0000} started: '+requestStart+', expiry: '+requestExpires+'');
		}else{
			$('#requestTimes').empty().append('{last: '+lastRequestTime+'} started: '+requestStart+', expiry: '+requestExpires+'');
		}
		//set marker for continued 
		MyLibrary.notFirst = true;
	}
	if(MyLibrary.notFirst == true){
		var expiry = parseFloat(withdrawRequest[5]);//float to enable math
		var timestamp = parseInt(Date.now()/1000);//divide by 1000 ms to get 10 digit Unix like from solidity
	}else{
		var expiry = 0;
	}
	//checks whether pollcounter is zero or not
	console.log('poll active: '+ activeRequest)
	if(activeRequest == true){
		//display
		$('#requestAmount').empty().append('{'+requestAmount+' eth}');
		$('#withdrawStandby').css('display', 'none');
		$('#dot_withdraw').css('display', 'inline-block');
		var yeyVotes = parseFloat(withdrawRequest[6]);
		var nayVotes = parseFloat(withdrawRequest[7]);
		$('#approveCount').empty().append(yeyVotes);
		$('#declineCount').empty().append(nayVotes);
		//check expiration first
		if(expiry > timestamp){//not expired, voting on
			$('#stampButtons').css('display', 'block');
		}else if(expiry < timestamp){//expired,but not concluded
			$('#stampButtons').css('display', 'none');
			$('#withdrawConclude').css('display', 'block');
			//get verdict
			if(yeyVotes > nayVotes){
				$('#voteEndVerd').empty().append('Request Concluded: Approved');
			}else{
				$('#voteEndVerd').empty().append('Request Concluded: Declined');
			}
		}
	}else{
		//no active request message
		$('#withdrawConclude').css('display', 'none');
		$('#withdrawStandby').css('display', 'block');
	}

	var netETHdeposit = fromWeiToFixed5_unrounded(netReceived);//unrounded cannot work properly sometimes, revert to fromWeiToFixed8
	var netETHwithdrawn = fromWeiToFixed5_unrounded(netRBWwithdrawals);
	
	//display eth in/outflows
	$('#trenetDeposits').empty().append('{net deposited '+netETHdeposit+' eth}');
	$('#trenetWithdraw').empty().append('{net withdrawn '+netETHwithdrawn+' eth}');
	$('#trebB').empty().append(displayEth+' eth');

	return;
}
//stamp withdrawal slip
async function stampSlip(vote){

	//estimate gasLimit
	var encodedData = tre_tokenInst.methods.stampWithdrawal(vote).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.treasurywallet
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();

	//Send
	tre_tokenInst.methods.stampWithdrawal(vote).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: parseInt(estimateGas)})
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
tre_tokenInst.events.wdStamp()
	.on('data', function(event){
		console.log(event); 
		//if(event.from != MyLibrary.wallet){return;}
		
		var vote = event.returnValues[1];//unlike RBW this doesnt return string, just true or false
		if(vote == true){
			var vote = 'Approve';
		}else{
			var vote = 'Decline';
		}
		var poll = event.returnValues[2];
		var tx_hash = event.transactionHash;
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Vote Casted Successfully';
		var nonTxAction = 'stamped '+vote+' on Withdrawal Slip#'+poll;
		popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		withdrawalRequestPoll()
		port_RBWallet();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);
//============================================================================
//CLICK INITIATED CALLS
//HANDLE ALL EVENTS HERE
$(document).on('click', '#voteBuyBack', function(e){
	var vote = 1;//true
	castVote(vote);
});
$(document).on('click', '#voteTreasury', function(e){
	var vote = 0;//false
	castVote(vote);
});
$(document).on('click', '#concludePoll', function(e){
	concludePoll();
});
//Polling
$(document).on('click', '#createPoll', function(e){
	createRBWPoll();
});
//Rebalance
$(document).on('click', '#rebalance', function(e){
	autoRebalance();
});
//withdrawal stamps
$(document).on('click', '#stampApprove', function(e){
	var vote = 1;//true
	stampSlip(vote);
});
$(document).on('click', '#stampDecline', function(e){
	var vote = 0;//false
	stampSlip(vote);
});
$(document).on('click', '#concludeVote', function(e){
	var vote = 1;//true
	stampSlip(vote);
});
