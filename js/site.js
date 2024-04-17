// Get the values from the HTML inputs and store them in a var.
function getValues() {


    // Target the input values and remove characters that will not be considered.
    let loanAmountInputRaw = document.getElementById('loanAmountInput').value;
    let loanAmountInput = loanAmountInputRaw.replace(/[^0-9eE\.]/gi, '');

    let termAmountInputRaw = document.getElementById('termAmountInput').value;   
    let termAmountInput = termAmountInputRaw.replace(/[^0-9eE\.]/gi, '');     

    let interestRateInputRaw = document.getElementById('interestRateInput').value;   
    let interestRateInput = interestRateInputRaw.replace(/[^0-9eE\.]/gi, '');    
  
    // change change datatype from str to num.
    loanAmount = Number(loanAmountInput);
      //termAmount also needs to be rounded up. Months must be represented by whole numbers
    termAmount = Math.ceil(Number(termAmountInput));
      // display rounded number to the input
                              // termAmount.setAttribute('value', 'termAmountInputRaw');
    interestRate = Number(interestRateInput);
    
    // Define valid and invalid inputs and handle mistypes by displaying error to end user
    if (isNaN(loanAmountInput) || isNaN(termAmountInput) || isNaN(interestRateInput)) {
        // validate if its a NaN than error for inputting a number
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Please enter only numbers`
          });
      
          // Loan Amount: is the number outside of limits 0-500,000
        } else if (loanAmountInput < 0 || loanAmountInput > 500000) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Loan Amount needs to between $0-500,000.`
          });
      
          // Term Length: Is the number outside of limits 0-360
        } else if (termAmountInput < 0 || termAmountInput > 360) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `Term length must be between 1-360 months(30yrs).`
          });
      
            // Interest Rate: Is the number outside of limits of 1-50%
        } else if (interestRateInput < 0 || interestRateInput > 50) {
          swal.fire({
            icon:'error',
            title: 'Oops!',
            backdrop: false,
            text: `We don't offer loans above 50%`
          });
      
          // All numbers: Valid
        } else {
            
            // Generate the monthly payments
            let totalMonthlyPayment = generateTotalMonthlyPayments(loanAmount, termAmount, interestRate);
        
            // Generate a table of all other numbers needed to build a month-by-month statement and return 
            // those values as an array of objects
            let statements = generateLoanInformation(loanAmount, termAmount, interestRate, totalMonthlyPayment);
        
            // Pass the array of objs to function that will iterate through each obj and create a table with
            // monthly statement information.
            displayLoanInformation(statements);
        }
} 

// Calculate the fixed monthly payment.
function  generateTotalMonthlyPayments(loanAmount, termAmount, interestRate) {

  // Total Monthly Payment = (loanAmount) * (interestRate / 1200) / ( 1 - (1 + interestRate/1200)^(-termAmount))
  let results = loanAmount * (interestRate/1200) / (1 - Math.pow((1 + interestRate / 1200), -termAmount));
  
  //Return what will be the monthly payment 
  return results;
}

// Generate an array of objects. The properties of the oject is the cost breakdown of the loan in the 
// table that will eventually be generated.
 function generateLoanInformation(loanAmount, termAmount, interestRate, totalMonthlyPayment){
     
  // Some of the Initial values to be used to build objects
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
  

      // for loop: Generate array of objects
  for (let i = 0; i < loanLength; i++){        
          // Interest
      let interest = remainingBalance * interestRate/1200;
      totalInterestPayment += interest
          // Principal    
      let principalPayment = payment - interest;
      remainingBalance -= principalPayment;
          // Total Principal
      totalPricipal += principalPayment; 

      // Push the object to loanTable array
      loanTable.push({
          month: i + 1,
          payment: payment,
          principal: principalPayment,
          interest: interest,
          total_interest: totalInterestPayment,
          balance: remainingBalance,
          total_principal: totalPricipal
      });
    };
    // Return Array of Objects
    return loanTable;
 }
    
    
function displayLoanInformation(statements){
    // FOREACH object in the array, target every property value and assign to var. 
    // use that var to create new html table that has rows = number of objects in the array

    // Create var for html element that will hold table
    let tbody = document.getElementById('table-content');
    // Create empty table that will hold the string that will be used to change html element
    let tableHtml = '';

    // HTML string contructor that loops through each obj in array and adds their values to empty table str.
    for (let i = 0; i < statements.length;i++) {

      // Assign property values from the ojs passed to variables
      let statement = statements[i];
      let month = statement.month.toFixed(0);
      let payment = statement.payment.toFixed(2); 
      let principal = statement.principal.toFixed(2);
      let interest = statement.interest.toFixed(2);
      let totalInterest = statement.total_interest.toFixed(2);
      let balance = statement.balance.toFixed(2); 
      let totalPrincipal = statement.total_principal.toFixed(2);

      // Remove negative of the final balance when it reaches $0
      if (balance <= 0){
        balance = 0.00;
      }
      
      // 
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
  //Takes str table generated by forloop and sets the html to that new table str. 
  tbody.innerHTML = tableHtml;
}


    
  