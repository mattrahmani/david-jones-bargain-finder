import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  // expect(err.message).to.include('file does not exist');
  return false
})

// Cypress.on('fail', (error, runnable) => {

//   // we now have access to the err instance
//   // and the mocha runnable this failed on
//   expect(error.message).to.include('file exists');
//   runnable.
//   return false;
//   // throw error // throw error to have test still fail
// })