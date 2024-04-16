

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
  
    
    // Total Monthly Payments
    let totalMonthlyPayment = generateTotalMonthlyPayments(loanAmount, termAmount, interestRate);

    // Generate a table of all the content needed to build a table and other fields
    let statements = generateLoanInformation(loanAmount, termAmount, interestRate, totalMonthlyPayment);

    // Write the values to html so the user can see
    displayLoanInformation(statements, termAmount);

    
    
} 

// Calculate the fixed monthly payment.
function  generateTotalMonthlyPayments(loanAmount, termAmount, interestRate) {

    // let termExponant = -Math.abs(termAmount);

    // Total Monthly Payment = (loanAmount) * (interestRate / 1200) / ( 1 - (1 + interestRate/1200)^(-termAmount) )
    let results = loanAmount * (interestRate/1200) / (1 - Math.pow((1 + interestRate / 1200), -Math.abs(termAmount)));

    return results;
}

//   Create an array of objects that contains all the collumns of information we need to build the table.
// Each month should be an object, maybe called statement, with a property for each col.
// build an array of bills that can be used to generate a table.
 function generateLoanInformation(loanAmount, termAmount, interestRate, totalMonthlyPayment){
    const payment = totalMonthlyPayment;
    const loanLength = termAmount;

    let remainingBalance = 0;
    let interestPayment = 0;
    let principalPayment = 0;
    
    // create and array and use for loop to build an array
    let loanTable = [];
    
    
    for (let i = 0; i < termAmount.length; i++){
        
        remainingBalance = loanAmount;
        interestPayment = 0;
        principalPayment = payment - interestPayment;

        // assign the values of each table collumn into an object
        const bill = {
            month: i++,
            payment: payment,
            principal: principalPayment,
            interest: interestPayment,
            total_interest: interestPayment + "the interest payment from before" ,
            balance: loanAmount - remainingBalance
        };

        loanTable.push(bill);
        // change the values that change month to month

        // build an array of those objects
    }

    return loanTable;


 }
    
    
function displayLoanInformation(statements, termAmount){

    // FOREACH object in the array, target every property value and assign to var. 
    // use that var to create new html table that has rows = number of objects in the array

    for (let i = 0;i < termAmount.length) {


    }

}
    
  