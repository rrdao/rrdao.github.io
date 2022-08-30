MyLibrary.noleaseshow =  false;
//calls
function shareLeaseStuff(){
    //fetch delegated balance
    leaseDelegatedBal();

    //fetch leases
    const shareleaseIntAsync = (fn, ms) => {
        fn().then(() => {
            setTimeout(() => shareleaseIntAsync(fn, ms), ms);
        });
    };
    shareleaseIntAsync(async () => {
		console.log('refesh timeout')
        processLeases(); 
    }, 40000);
}
//fetch vacant share leases
async function processLeases(){
	var shareLeasesArray = await tokenInst.methods.getShareLeases().call();
    
    $('#sl_leases').empty().append('<span id="sl_refreshing" class="sl_refresh">updating...</span>');
    var number_of = shareLeasesArray.length;
	if(number_of > 0){
		$('#sl_leases').empty();
		let array = shareLeasesArray;
		for (const lease of array){
			fetchShareLease(lease);
		}
	}else if(number_of == 0){//no claims yet popup
		console.log('No leases yet...');
		$('#sl_leases').empty().append('<span id="sl_refreshing" class="sl_refresh">no leases available...</span>');

		if(MyLibrary.noleaseshow == true){return;}else{MyLibrary.noleaseshow = true; }//swal once
		//proceed to swal
		var privatize = '<div class="clms_case">No Share Leases yet...</div>';
		swal({
			  title: "Leases Not Found",
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
async function fetchShareLease(address){
    var takeFucntion = 'takeShareLease("'+address+'")';
    try{
		var leaseItem = await tokenInst.methods.getShareLease(address).call();
		//check for expiry to see if taken
        var action_btn = '<span style="min-width:2vw;margin-right:0.2vw;"></span>';
		if(parseInt(leaseItem[5]) == 0){
			//not taken
            var status_dot = '<span id="" class="status_dot status_dot_open" style="background-color: rgb(255,255,255), display: inline-block;"></span>';//white
            var action_btn = "<span id='_leaseTakeBtn' class='portfolioBtn' style='display: inline-block;' onclick='"+takeFucntion+"'>Take</span>";
		}else{
            //taken 
			var timestamp = parseInt(Date.now()/1000);//divide by 1000 ms to get 10 digit Unix like from solidity
			if(leaseItem[5] < timestamp){//expired
                var status_dot = '<span id="" class="status_dot status_dot_expired" style="background-color: rgb(255,71,71), display: inline-block;"></span>';//red
				$("#_leaseTakeBtn").hide();//take lease hide
			}else{//running
				var status_dot = '<span id="" class="status_dot status_dot_taken" style="background-color: rgb(4,200,108), display: inline-block;"></span>';//green
			}
		}
        //dates
        if(leaseItem[5] > 0){
			var expiry = new Date(leaseItem[5] * 1000).toLocaleString();
            var start = new Date(leaseItem[4] * 1000).toLocaleString();
		}else{
			var expiry = '0/0/0000, 00:00:00';
            var start = '0/0/0000, 00:00:00';
		}
        //duration
        var duration = leaseItem[3];
        //amount leased
        var amount = (leaseItem[0] / Math.pow(10, MyLibrary.decimals)).toFixed(2);
        var ethAsk = fromWeiToFixed5_unrounded(leaseItem[1]);
        //lessor wallet
        var lessor = address;
        var first = lessor.substring(0, 6);//get first 5 chars
        var last = lessor.slice(lessor.length - 3);//get last 5
        var trancatedAdd = first+'...'+last;
		//add values
        //lessor, amount, ethASK, duration, taker, expiry
        var leaseEntry = '<li class="leaseItem"><span class="lease_tag">'+trancatedAdd+'</span><span class="lease_tag">'+ Number(amount).toLocaleString() + ' gun</span><span class="lease_tag">'+ ethAsk + ' eth</span><span class="lease_tag sl_duration_tag">'+ duration + ' days</span><span class="lease_tag sl_taker_tag">'+ start +'</span><span class="lease_tag sl_expiry_tag">'+ expiry + '</span>'+ status_dot + action_btn +'</li>';
        $("#sl_refreshing").hide();
        $('#sl_leases').append(leaseEntry);
	}catch(error) {
		console.log(error);
	}
}
//Create ShareLease
$(document).on('click', '#delLease', function(e){
	var tokens = $('#delegate_amnt').val();
	delegateShareLease(tokens);
});
$(document).on('click', '#shlDmax', async function(e){
	var mybalance = await tokenInst.methods.balanceOf(MyLibrary.wallet).call();
	document.getElementById("delegate_amnt").value = fromWeiToFixed2_unrounded(mybalance);
});
$(document).on('click', '#shlCmax', async function(e){
	var amount = await tokenInst.methods._shareDelegation(MyLibrary.wallet).call();
	document.getElementById("create_amnt").value = fromWeiToFixed2_unrounded(amount);
});
$(document).on('click', '#createLease', function(e){
	var inputAmnt = $('#create_amnt').val();
	var ethAsk = $('#create_ethamnt').val();
	var duration = $('#create_duration').val();
	createShareLease(inputAmnt, ethAsk, duration);
});
$(document).on('click', '#_portBtnConclude', function(e){
	concludeShareLease();
});
//______________________________________________
//Delegate Share Lease
async function delegateShareLease(inputAmnt){
	var tokens = web3.utils.toWei(String(inputAmnt), 'ether'); 
	var delegateAmnt = web3.utils.toBN(tokens);
	//estimate gasLimit
	var encodedData = tokenInst.methods._delegateShares(delegateAmnt).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();
	//Send
	tokenInst.methods._delegateShares(delegateAmnt).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: parseInt(estimateGas)})
	.on('receipt', function(receipt){
        if(receipt.status == true){//1 also matches true
            console.log('Mined', receipt);console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash);
        }
        else{
            console.log('Transaction Failed Receipt status: '+receipt.status);
            swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
        }
	})
	.on('confirmation', (confirmationNumber, receipt) => {
        
    })
	.on('error', (error) => {
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
tokenInst.events.DelegateLease()
	.on('data', async function(event){
		console.log(event);
		var amount = event.returnValues[2];
		var leaseTokens = (amount / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var tx_hash = event.transactionHash;
		
		var receivedETH = 0;
		var outputCurrency = 'GUN';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Delegated for Share Lease';
		var nonTxAction = '';
		popupSuccess(type,outputCurrency,tx_hash,message,receivedETH,leaseTokens,wallet,nonTxAction);
		leaseDelegatedBal();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//Delegated ShareLease Tokens
async function leaseDelegatedBal(){
	var delegatedLease = await tokenInst.methods._shareDelegation(MyLibrary.wallet).call();
	var tokens = (delegatedLease / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	$('#shlDbal').empty().append(' delegated bal: '+Number(tokens).toLocaleString());
}

//Create Share Lease
async function createShareLease(inputAmnt, ethAsk, duration){
	//To BN
	var tokens = web3.utils.toWei(inputAmnt, 'ether'); 
	var leaseAmnt = web3.utils.toBN(tokens);
	var input_eth = web3.utils.toWei(ethAsk, "ether");
	var input_eth = web3.utils.toBN(input_eth);
	var duration = web3.utils.toBN(duration);
	//estimate gasLimit
	var encodedData = tokenInst.methods.createShareLease(leaseAmnt, input_eth, duration).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();
	//Send
	tokenInst.methods.createShareLease(leaseAmnt, input_eth, duration).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: parseInt(estimateGas)})
	.on('receipt', function(receipt){
        if(receipt.status == true){//1 also matches true
            console.log('Mined', receipt);console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash);
        }
        else{
            console.log('Transaction Failed Receipt status: '+receipt.status);
            swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
        }
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		 
    })
	.on('error', (error) => {
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
tokenInst.events.LeaseList()
	.on('data', function(event){
		if(window.leaseEventAction){clearTimeout(leaseEventAction);}
		window.leaseEventAction = setTimeout(async function() {
			console.log('lease created'+event);
			var amount = event.returnValues[2];
			var lessor = event.returnValues[0];
			var leaseTokens = (amount / Math.pow(10, MyLibrary.decimals)).toFixed(2);
			var tx_hash = event.transactionHash;
			var leaseItem = await tokenInst.methods.getShareLease(lessor).call();
			var ethAsk = fromWeiToFixed5_unrounded(leaseItem[1]);
			var duration = leaseItem[3];    
			
			var receivedETH = 0;
			var outputCurrency = '';//using nonTxBased message with empty currency
			var type = 'success';//or error
			var wallet = '';
			var message = 'Share Lease Created';
			var nonTxAction = 'for ' + Number(leaseTokens).toLocaleString() + ' GUNS over ' + duration + ' days (ask price: ' + ethAsk + 'eth)';
			popupSuccess(type,outputCurrency,tx_hash,message,receivedETH,leaseTokens,wallet,nonTxAction);
			processLeases();
		}, 2500);
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//take up share lease
async function takeShareLease(lessor){
    //get eth ask
    var leaseItem = await tokenInst.methods.getShareLease(lessor).call();
	var input_eth = leaseItem[1];
	//estimate gasLimit
	var encodedData = tokenInst.methods.takeupShareLease(lessor).encodeABI();
	const estimateGas = await web3.eth.estimateGas({
		value: input_eth,
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	//estimate the gasPrice
	const gasPrice = await web3.eth.getGasPrice(); 
	//transaction
	tokenInst.methods.takeupShareLease(lessor).send({
		from: MyLibrary.wallet,
		value: input_eth,
   		gasPrice: gasPrice,
		gasLimit: estimateGas,
	})
	//send
	.on('receipt', function(receipt){
        if(receipt.status == true){//1 also matches true
            console.log('Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash);
        }
        else{
            console.log('Transaction Failed Receipt status: '+receipt.status);
            swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
        }
	})
	.on('confirmation', (confirmationNumber, receipt) => {

    })
	.on('error', (error) => {
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
tokenInst.events.LeaseStart()
.on('data', async function(event){
    console.log(event);
    var amount = event.returnValues[2];
    var lessor = event.returnValues[0];
    var leaseTokens = (amount / Math.pow(10, MyLibrary.decimals)).toFixed(2);
    var tx_hash = event.transactionHash;
    var leaseItem = await tokenInst.methods.getShareLease(lessor).call();
    var ethAsk = fromWeiToFixed5_unrounded(leaseItem[1]);
    var duration = leaseItem[3];
    
    var receivedETH = 0;
    var outputCurrency = '';//using nonTxBased message with empty currency
    var type = 'success';//or error
    var wallet = '';
    var message = 'Lease Taken';
    var nonTxAction = 'for ' + Number(leaseTokens).toLocaleString() + ' GUNS over ' + duration + ' days (cost: ' + ethAsk + 'eth)';
    popupSuccess(type,outputCurrency,tx_hash,message,receivedETH,leaseTokens,wallet,nonTxAction);
})
.on('changed', function(event){
    // remove event from local database
    console.log(event);
})
.on('error', console.error);


//conclude share lease when it expires
async function concludeShareLease(){	
	//estimate gasLimit
	var encodedData = tokenInst.methods.concludeShareLease().encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice();
	//Send
	tokenInst.methods.concludeShareLease().send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: parseInt(estimateGas)})
	.on('receipt', function(receipt){
        if(receipt.status == true){//1 also matches true
            console.log('Mined', receipt);console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash);
        }
        else{
            console.log('Transaction Failed Receipt status: '+receipt.status);
            swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
        }
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		
    })
	.on('error', (error) => {
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
//TRANSACTION NOTIFICATION - LeaseUnlist
tokenInst.events.LeaseUnlist()
	.on('data', async function(event){
		console.log(event);
		var amount = event.returnValues[1];
		var lessor = event.returnValues[0];
		var leaseTokens = (amount / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var tx_hash = event.transactionHash;	
		var receivedETH = 0;
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Delisted Lease Succesfully';
		var nonTxAction = 'received ' + Number(leaseTokens).toLocaleString() + ' GUNS';
		popupSuccess(type,outputCurrency,tx_hash,message,receivedETH,leaseTokens,wallet,nonTxAction);
		processLeases();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//TRANSACTION NOTIFICATION - Conclude
tokenInst.events.LeaseEnd()
	.on('data', async function(event){
		console.log(event);
		var amount = event.returnValues[1];
		var lessor = event.returnValues[0];
		var leaseTokens = (amount / Math.pow(10, MyLibrary.decimals)).toFixed(2);
		var tx_hash = event.transactionHash;
		var receivedETH = 0;
		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Concluded Lease Succesfully';
		var nonTxAction = 'received ' + Number(leaseTokens).toLocaleString() + ' GUNS';
		popupSuccess(type,outputCurrency,tx_hash,message,receivedETH,leaseTokens,wallet,nonTxAction);
		processLeases();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);