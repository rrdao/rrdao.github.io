// Calls
$(document).ready(async function(){
	//proceed
	var unlockState = await unlockedWallet();
	if (unlockState === true){
		maincontract();
		//repeat, with async and promise so it dont overspill
		const setsaloonIntervalAsync = (fn, ms) => {
			fn().then(() => {
				setTimeout(() => setsaloonIntervalAsync(fn, ms), ms);
			});
		};
		setsaloonIntervalAsync(async () => {
			//if any that needs repeating in future
			//call page tries
		}, 30000);
		
	}else{
		reqConnect();
	}	
});

async function maincontract(){
	try{
		//1. Name and symbol
		var name = await tokenInst.methods.name().call();
		var symbol = await tokenInst.methods.symbol().call();
		//update table
		$('#mapN_loadstat').hide();
		var maprowN = document.getElementById("mapN").insertCell(1);
		maprowN.innerHTML = '<td class="mapvalue">'+name+' ('+symbol+')</td>';

		//2. Total & circ supply
		var totalsupply = await tokenInst.methods.totalSupply().call();
		var totalsupply = parseFloat(totalsupply / Math.pow(10, MyLibrary.decimals));
		var circsupply = await tokenInst.methods._circSupply().call();
		var circsupply = parseFloat(circsupply / Math.pow(10, MyLibrary.decimals));
		//update total
		$('#mapTS_loadstat').hide();
		var maprowTS = document.getElementById("mapTS").insertCell(1);
		maprowTS.innerHTML = '<td class="mapvalue">'+parseFloat(totalsupply).toLocaleString()+' GUN</td>';
		//update circ
		$('#mapCS_loadstat').hide();
		var maprowTS = document.getElementById("mapCS").insertCell(1);
		maprowTS.innerHTML = '<td class="mapvalue">'+parseFloat(circsupply).toLocaleString()+' GUN</td>';

		//3. Holders
		var holders = await tokenInst.methods._holders().call();
		//update
		$('#mapH_loadstat').hide();
		var maprowH = document.getElementById("mapH").insertCell(1);
		maprowH.innerHTML = '<td class="mapvalue">'+parseFloat(holders).toLocaleString()+'</td>';

		//4. Fees cashed
		var totalliquidated = await tokenInst.methods._totalFeeLiquidated().call();
		var totalliquidated = parseFloat(totalliquidated / Math.pow(10, MyLibrary.decimals));
		var earnedFromBuyProxy = await tokenInst.methods._totalEthRebalanced().call()
		var earnedFromBuyProxy = fromWeiToFixed5(earnedFromBuyProxy);
		//update
		$('#mapFC_loadstat').hide();
		var maprowH = document.getElementById("mapFC").insertCell(1);
		maprowH.innerHTML = '<td class="mapvalue">'+totalliquidated.toLocaleString()+' GUN ('+earnedFromBuyProxy+' eth)</td>';

		//5. Rebalanced to date
		var totalBBS = await rbw_tokenInst.methods._totalRBW_buybacks().call();
		var totalBBS = parseFloat(totalBBS);
		var totalTRE = await rbw_tokenInst.methods._totalRBW_buybacks().call();
		var totalTRE = parseFloat(totalTRE);
		var totalrebalanced = String(totalTRE + totalBBS);
		var totalrebalanced = fromWeiToFixed8(totalrebalanced);
		var rebalancingevents = await rbw_tokenInst.methods._totalAutoRebalancingChecks().call();
		var rebalancingevents = parseFloat(rebalancingevents);
		//update
		$('#mapRB_loadstat').hide();
		var maprowH = document.getElementById("mapRB").insertCell(1);
		maprowH.innerHTML = '<td class="mapvalue">'+totalrebalanced+' eth ('+rebalancingevents+' events)</td>';

		//6. Rewarded to date
		var totalrewardsissued = await tokenInst.methods._ethRewardBasis().call();
		var totalrewardsissued = fromWeiToFixed8(totalrewardsissued);

		var totalclaimed = await tokenInst.methods._netRewardClaims().call();
		var totalclaimed = fromWeiToFixed8(totalclaimed);
		//update
		$('#mapR_loadstat').hide();
		var maprowH = document.getElementById("mapR").insertCell(1);
		maprowH.innerHTML = '<td class="mapvalue">'+totalrewardsissued+' eth ('+totalclaimed+'eth claimed)</td>';

		//7. Treasury
		var totalrebalancedTr = await rbw_tokenInst.methods._totalRBW_treasury().call();
		var totalrebalancedTr = fromWeiToFixed5(totalrebalancedTr);

		var totalwithdrawalsTr = await tre_tokenInst.methods._totalRBW_withdrawals().call();
		var totalwithdrawalsTr = fromWeiToFixed5(totalwithdrawalsTr);
		//update
		$('#mapTW_loadstat').hide();
		var maprowH = document.getElementById("mapTW").insertCell(1);
		maprowH.innerHTML = '<td class="mapvalue">'+totalrebalancedTr+' eth ('+totalwithdrawalsTr+'eth withdrawn)</td>';

	}catch(error) {
		console.log(error);
	}
}



//Copy Contract Addy
function CopyToClipboard(id){
    var r = document.createRange();
    r.selectNode(document.getElementById(id));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    try {
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        console.log('Address copied! ' + r);
    } catch (err) {
        console.log('Unable to copy!');
    }
}

//ON LOCK ACCOUNT CLICK
async function LockUp(){
	console.log(accounts.length);
	accounts = [];//remove all accounts from dom. wait for reinitialise
	console.log(accounts.length);
	MyLibrary.disconnected = 1;
	
	//fire wallet check to flash out address in elements
	var disconnected = MyLibrary.disconnected;
	walletCheck(disconnected);
}//async function close

async function isMetaMaskConnected() {
	const {ethereum} = window;
	const accounts = await ethereum.request({method: 'eth_accounts'});
	return accounts && accounts.length > 0;
}


// TOGGLE MAIN WINDOWS
$(document).on('click','#sal_main',function(){
	$('.windows_shift').css('display', 'none'); //reset window
	$('#maincontract_win').css('display', 'block');
	$('#sal_main').css('box-shadow', 'inset 0 0.4px 3px 0 #FFF');
	$('#sal_deriv').css('box-shadow', 'none');
	//toggle contract navs
	$('#sal_ul_main').slideDown(300);
	$('#sal_ul_sal').slideUp(150);
	$('#rrofficial').click();
});
// TOGGLE SALOON WINDOWS
$(document).on('click','#sal_deriv',function(){
	$('.windows_shift').css('display', 'none'); //reset window
	$('#saloon_win').css('display', 'block');
	$('#sal_deriv').css('box-shadow', 'inset 0 0.4px 3px 0 #FFF');
	$('#sal_main').css('box-shadow', 'none');
	//hide all contract pages
	$('.screvealer').css('display', 'none');
	//toggle contract navs
	$('#sal_ul_main').slideUp(150);
	$('#sal_ul_sal').slideDown(300)
	//click first saloon contrct page
	$('#suddendeath').click();
});
// TOGGLE SALOON CONTRACTS - one by one
$(document).on('click','#rrofficial',function(){
	$('#rrofficial').css('border-left-color', '#683c2c');
	$('#suddendeath').css('border-left-color', '#363636');
	$('#chainreaction').css('border-left-color', '#363636');
	$('#topholder').css('border-left-color', '#363636');
});
$(document).on('click','#suddendeath',function(){
	$('.screvealer').css('display', 'none');
	$('#screvealer1').css('display', 'block');
	$('#suddendeath').css('border-left-color', '#683c2c');
	$('#chainreaction').css('border-left-color', '#363636');
	$('#topholder').css('border-left-color', '#363636');
});
$(document).on('click','#topholder',function(){
	$('.screvealer').css('display', 'none');
	$('#screvealer2').css('display', 'block');
	$('#topholder').css('border-left-color', '#683c2c');
	$('#suddendeath').css('border-left-color', '#363636');
	$('#chainreaction').css('border-left-color', '#363636');
});
$(document).on('click','#chainreaction',function(){
	$('.screvealer').css('display', 'none');
	$('#screvealer3').css('display', 'block');
	$('#chainreaction').css('border-left-color', '#683c2c');
	$('#topholder').css('border-left-color', '#363636');
	$('#suddendeath').css('border-left-color', '#363636');
});

//	SALOON MENU FUNCTIONS
//	LETS USE SIMPLER STYLING METHOD FOR THE SALOON FUNCTIONS
$(document).on('click', '.sn_contracts', function(e){
	$('.windows_shift').css('display', 'none'); //reset window
	$('#saloon_win').css('display', 'block');//show saloon window
	
	$('#sal_ul_main').slideUp(150);$('#sal_main').css('box-shadow', 'none');//reset
	$('#sal_ul_sal').slideUp(150);$('#sal_deriv').css('box-shadow', 'none');
	
	$('.sn_contracts').removeAttr('style'); //reset styles, TRY $(this).
	$(this).css({'box-shadow' : 'inset 0 0.3px 2.3px 0 #FFF'});//set stylebox-shadow: 
});
//Saloon Features
//1.saloon contract
$(document).on('click', '#sn_c_rr', function(e){//click on first menu
	$('.windows_shift').css('display', 'none'); 
	$('#ruro_win').css('display', 'block');
});
//2.share lease
$(document).on('click', '#sn_c_sl', async function(e){	
	$('.windows_shift').css('display', 'none');
	$('#sharelease_win').css('display', 'block');
	shareLeaseStuff();
});
//3.share bid
$(document).on('click', '#sn_c_sb', function(e){	
	$('.windows_shift').css('display', 'none');
	$('#sharebid_win').css('display', 'block');
});
//4.charity
$(document).on('click', '#sn_c_c', function(e){
	$('.windows_shift').css('display', 'none');
	$('#charity_win').css('display', 'block');
});
//5.charity
$(document).on('click', '#sn_c_gs', function(e){
	$('.windows_shift').css('display', 'none');
});
//6.charity
$(document).on('click', '#sn_c_af', function(e){
	$('.windows_shift').css('display', 'none');
});
//7.comic
$(document).on('click', '#sn_c_m', function(e){
	$('.windows_shift').css('display', 'none');
});
//instructions share lease
//events binded to elemnts
$(document).ready(function() {
	$("#openInstruct").bind("click", function() {
		if($("#sl_instructions" ).hasClass( "fadeInTop" )){
			$("#sl_instructions").css({'display' : 'none'});
			$("#sl_instructions").removeClass('fadeInTop');
		}else{
			$("#sl_instructions").css({'display' : 'block'});
			$("#sl_instructions").addClass('fadeInTop');
		}
	});
});