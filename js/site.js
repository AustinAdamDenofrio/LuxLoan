

// Get the values from the HTML inputs and store them in a var.
function getValues() {


    // Normalize and store normalized string
    let loanAmountInputRaw = document.getElementById('loanAmountInput').value;
    let loanAmountInput = loanAmountInputRaw.replace(/[^0-9eE\.]/gi, '');

    let termAmountInputRaw = document.getElementById('termAmountInput').value;   
    let termAmountInput = termAmountInputRaw.replace(/[^0-9eE\.]/gi, '');     

    let interestRateInputRaw = document.getElementById('interestRateInput').value;   
    let interestRateInput = interestRateInputRaw.replace(/[^0-9eE\.]/gi, '');   
    
    
  
    // change them from a string to a Num
    loanAmount = Number(loanAmountInput);
    termAmount = Math.ceil(Number(termAmountInput));
    // Rounding the term months to smallest greater int
    // user needs to see value rounded on input
    

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
      
          // Loan Amount number isnt between 0-500,000
        } else if (loanAmountInput < 0 || loanAmountInput > 500000) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Loan Amount needs to between $0-500,000.`
          });
      
          // Term Length isnt between 0-360
        } else if (termAmountInput < 0 || termAmountInput > 360) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Term length must be between 1-360 months(30yrs).`
          });
      
            // End Number isnt between 1-50%
        } else if (interestRateInput < 0 || interestRateInput > 50) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `We don't offer loans above 50%`
          });
      
          // End number is greater than both Loan Amount and Term Length Numbers
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


    
  