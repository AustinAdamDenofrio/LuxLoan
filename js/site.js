

// Get the values from the HTML inputs and store them in a var.
function getValues() {
    // store the values
    let loanAmountInput = document.getElementById('loanAmountInput').value;
    let termAmountInput = document.getElementById('termAmountInput').value;    
    let interestRateInput = document.getElementById('interestRateInput').value;   
  
    // change them from a string to a Num
        // Selector needs to be used to remove special chars and spaces
    loanAmount = Number(loanAmountInput);
    termAmount = Number(termAmountInput);
    interestRate = Number(interestRateInput);
  
    
    // validate the num is within the defined values else error
    if (isNaN(loanAmountInput) || isNaN(termAmountInput) || isNaN(interestRateInput)) {
        // validate if its a NaN than error for inputting a number
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Please enter numbers only for Loan Amount Term Length to work properly.`
          });
      
          // Loan Amount number isnt between 0-1000
        } else if (loanAmountInput < 0 || loanAmountInput > 1000) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Please ensure Loan Amount is between 0-1000 for Loan Amount Term Length to work properly.`
          });
      
          // Term Length isnt between 0-1000
        } else if (termAmountInput < 0 || termAmountInput > 1000) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Please ensure Term Length is between 0-1000 for Loan Amount Term Length to work properly.`
          });
      
            // End Number isnt between 0-1000
        } else if (interestRateInput < 0 || interestRateInput > 1000) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Please ensure End Number is between 0-1000 for Loan Amount Term Length to work properly.`
          });
      
          // End number is greater than both Loan Amount and Term Length Numbers
        } else if (interestRateInput < loanAmountInput || interestRateInput < termAmountInput) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Please ensure End Number is greater than the value of Loan Amount and Term Length number for Loan Amount Term Length to work properly.`
          });
      
          // if Loan Amount is greater than Term Length, but is still valid numebers
        } else {
            
            // Total Monthly Payments
            let totalMonthlyPayment = generateTotalMonthlyPayments(loanAmount, termAmount, interestRate);
        
            // Generate a table of all the content needed to build a table and other fields
            let statements = generateLoanInformation(loanAmount, termAmount, interestRate, totalMonthlyPayment);
        
            // Write the values to html so the user can see
            displayLoanInformation(statements);
        }










    
    
} 

// Calculate the fixed monthly payment.
function  generateTotalMonthlyPayments(loanAmount, termAmount, interestRate) {

    // let termExponant = -Math.abs(termAmount);

    // Total Monthly Payment = (loanAmount) * (interestRate / 1200) / ( 1 - (1 + interestRate/1200)^(-termAmount) )
    let results = loanAmount * (interestRate/1200) / (1 - Math.pow((1 + interestRate / 1200), -termAmount));

    return results;
}

//   Create an array of objects that contains all the collumns of information we need to build the table.
// Each month should be an object, maybe called statement, with a property for each col.
// build an array of bills that can be used to generate a table.
 function generateLoanInformation(loanAmount, termAmount, interestRate, totalMonthlyPayment){
     
        // Month
    let loanLength = termAmount;
       // Payment
    const payment = totalMonthlyPayment;
        // Balance (initializes as = lounAmount and will change as person pays)
    let remainingBalance = loanAmount;
        // Total interest (Total paid interest)
    let totalInterestPayment = 0;    
        // Total Principal
    let totalPricipal = 0;
       // create and array and use for loop to build an array
    let loanTable = [];    
    

        // for loop to generate array of objects
    for (let i = 0; i < loanLength; i++){        
            // Interest
        let interest = remainingBalance * interestRate/1200;
        totalInterestPayment += interest
            // Principal    
        let principalPayment = payment - interest;
        remainingBalance -= principalPayment;
            // Total Principal
        totalPricipal += principalPayment; 

        // assign the values of each table column into an object
        loanTable.push({
            month: i + 1,
            payment: payment,
            principal: principalPayment,
            interest: interest,
            total_interest: totalInterestPayment,
            balance: remainingBalance,
            total_principal: totalPricipal
        });

        // change the values that change month to month

        // build an array of those objects
    };

    return loanTable;


 }
    
    
function displayLoanInformation(statements){
    // FOREACH object in the array, target every property value and assign to var. 
    // use that var to create new html table that has rows = number of objects in the array

    // statements.forEach((statement, i) => {

    // })
    let tbody = document.getElementById('table-content');
    let tableHtml = '';



    for (let i = 0; i < statements.length;i++) {

        let statement = statements[i];
        let month = statement.month.toFixed(0);
        let payment = statement.payment.toFixed(2); 
        let principal = statement.principal.toFixed(2);
        let interest = statement.interest.toFixed(2);
        let totalInterest = statement.total_interest.toFixed(2);
        let balance = statement.balance.toFixed(2); 
        let totalPrincipal = statement.total_principal.toFixed(2);
        
        tableHtml += `<tr><td>${month}</td><td>$${payment}</td><td>$${principal}</td><td>$${interest}</td><td>$${totalInterest}</td><td>$${balance}</td></tr>`;

        if (i == (statements.length - 1)){
            // Get the html element, clear and fill with monthly payment amount
            let paymentTotalElement = document.getElementById('payments-total');
            paymentTotalElement.textContent = '';
            paymentTotalElement.textContent = `$${payment}`;

            // Get the html element, clear and fill with total principal amount
            let principalTotalElement = document.getElementById('principal-total');
            principalTotalElement.textContent = '';
            principalTotalElement.textContent = `$${totalPrincipal}`;    
            
            // Total Interest, clear and fill with total principal amount
            let interestTotalElement = document.getElementById('interest-total');
            interestTotalElement.textContent = '';
            interestTotalElement.textContent = `$${totalInterest}`;

            // Total Cost, clear and fill with total principal amount
            let costTotalElement = document.getElementById('cost-total');
            let cumulativeCost =  Number(totalPrincipal) + Number(totalInterest);
            costTotalElement.textContent = '';
            costTotalElement.textContent = `$${cumulativeCost}`;
        }
    }

    tbody.innerHTML = tableHtml;
}


    
  