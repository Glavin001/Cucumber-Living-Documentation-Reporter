import { When } from "@badeball/cypress-cucumber-preprocessor";

const url = "https://github.com";

When(`I open GitHub page`, () => {
  cy.visit(url);
});
