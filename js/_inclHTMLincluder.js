async function includeHypecards() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("hypecards-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                /* Remove the attribute, and call this function once more: */
                elmnt.removeAttribute("hypecards-include-html");
                includeHypecards();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
    //LOAD HYPECARDS STUFF
    $('#donateSection').css('background-image','url(img/love.gif)');
    //load ATM jump to:hidden by default for the ATM page but visible on Bank page (detects banksec)
    if($('.banksec').length){
        var ATMcard = '<div id="atmSection" class="actionHype" title="enter the ATM"><div class="subtleInputHold kreep" id="openATMhold"><a href="atm.html" target="_blank" id="openATM" class="shl_stake_submit"><span>enter ATM</span></a></div></div>';
	    $('#actionHypeHold').append(ATMcard);
    }
    //START REFRESHING BALANCES
    var unlockState = await unlockedWallet();
    if (unlockState === true){
        port_bonfireWallet();
        port_rewardsAvail();
        //repeat, with async and promise so it dont overspill
        const sethypeIntervalAsync = (fn, ms) => {
            fn().then(() => {
                setTimeout(() => sethypeIntervalAsync(fn, ms), ms);
            });
        };
        sethypeIntervalAsync(async () => {
            port_bonfireWallet();
            port_rewardsAvail();
        }, 80000);
    }else{
        reqConnect();
    }
    
}

async function includeSwaps() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("swaps-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                /* Remove the attribute, and call this function once more: */
                elmnt.removeAttribute("swaps-include-html");
                includeSwaps();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
    //LOAD SWAP CARDS STUFF
	if(MyLibrary.Swap_state == "buy"){
		//update swap metrics & infor both
		if ($('#tokenAamount').val().length > 0){	
			var input_gun = $('#tokenBamount').val();
			var input_gun = String(input_gun);
			checkBuyState(input_gun);	

		}else{	buyInfoState();	}//update buy infor only
	}else{
		sellInfoState();
	}

    //START REFRESHING BALANCES
    var unlockState = await unlockedWallet();
    if (unlockState === true){
        balances();
        pullDelegateBalances();
        //repeat, with async and promise so it dont overspill
        const setswapIntervalAsync = (fn, ms) => {
            fn().then(() => {
                setTimeout(() => setswapIntervalAsync(fn, ms), ms);
            });
        };
        setswapIntervalAsync(async () => {
            balances();
            pullDelegateBalances();
        }, 40000);
    }else{
        reqConnect();
    }
}

async function includeRBW() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("rbw-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                    if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("rbw-include-html");
                    includeRBW();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
    //LOAD SWAP CARD STUFF
    //START REFRESHING BALANCES
    var unlockState = await unlockedWallet();
    if (unlockState === true){
        port_RBWallet();
        if($('#hypecard_withdrawpoll').length){
            withdrawalRequestPoll();
        }
        //repeat, with async and promise so it dont overspill
        const setrbwIntervalAsync = (fn, ms) => {
            fn().then(() => {
                setTimeout(() => setrbwIntervalAsync(fn, ms), ms);
            });
        };
        setrbwIntervalAsync(async () => {
            port_RBWallet();
            if($('#hypecard_withdrawpoll').length){
                withdrawalRequestPoll();
            }
        }, 60000);
    }else{
        reqConnect();
    }	
   
}