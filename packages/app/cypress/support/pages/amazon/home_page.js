class HomePage {
    clickSignInButton() {
      cy.get('#nav-signin-tooltip')
        .find('span')
        .should('be.visible')
        .as('signInButton')
        .click({ force: true });
    }
  }
  
  export default new HomePage();
  