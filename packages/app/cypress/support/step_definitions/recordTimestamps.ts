import { Before } from "@badeball/cypress-cucumber-preprocessor";

Before(function () {
  // This hook will be executed before all scenarios.
  cy.log("Starting test now", Date.now(), this)
});
