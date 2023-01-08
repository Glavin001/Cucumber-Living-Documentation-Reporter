Feature: Amazon Sign in

  Background: Navigate to the Sign in Page
    Given open the Amazon page
    And click on sign in button

  Scenario: without using any email address
    When click on continue button
    Then The alert message should be given to user as Enter your email or mobile phone number

  Scenario: using an invalid email address
    When type any email address
    And click on continue button
    Then The error message should be given to user as We cannot find an account with that email address
