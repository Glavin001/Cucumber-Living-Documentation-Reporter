import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import homePage from '../pages/amazon/home_page';
import signInPage from '../pages/amazon/signIn_page';

Given(/^open the ([^"]*) page$/, (page) => {
  cy.visit('/');
  cy.title().should('include', page);
});

When(/^click on sign in button$/, () => {
  homePage.clickSignInButton();

  cy.location().should((loc) => {
    expect(loc.pathname).contains('signin');
  });
});

When(/^click on continue button$/, () => {
  signInPage.clickContinueButton();
});

Then(/^The alert message should be given to user as ([^"]*)$/, (message) => {
  signInPage.getAlertMessage();
  cy.get('@alertMessage').should(($el) => expect($el.text().trim()).to.equal(message));
});

When(/^type any email address$/, () => {
  signInPage.typeRandomEmailAddress();
});

Then(/^The error message should be given to user as ([^"]*)$/, (message) => {
  signInPage.getErrorMessage();
  cy.get('@errorMessage').should(($el) => expect($el.text().trim()).to.equal(message));
});
