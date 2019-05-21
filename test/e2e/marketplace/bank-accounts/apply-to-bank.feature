Feature: Apply to Bank Accounts

	Background: Given user has opened SelfKey wallet
	And the user has opened the Bank Accounts Marketplace Screen
	And the user has opened a specific jurisdiction option

	Scenario: Start application
		Given Given jurisdiction detailed screen screen is opened
		And "Open Bank Account" button is not disabled
		When user clicks the "Open Bank Account" button
		Then a confirmation and process information screen is displayed (invision?)
		And cost and network fee is displayed

	Scenario: Confirm application
		Given the user has started an application
		When user clicks the "Pay Fee" button
		Then the payment confirmation modal is displayed

	Scenario: Confirm payment
		Given the user has confirmed the application
		When user clicks the "Pay ..." button
		Then payment is processed and the transaction in progress modal is displayed

	Scenario: Payment transaction has succeeded
		Given the payment transaction for bank accounts has succeeded
		Then the choose bank option screen is displayed (invision?)
		And a list of possible bank options with details and bank names is displayed to the user

	Scenario: Payment transaction has failed
		Given the payment transaction for bank accounts has failed
		Then the payment failed screen is displayed (invision?)

	Scenario: Select bank option
		Given the user has paid for the application
		And the user has selected a preferred bank option
		When user clicks the "Continue" button
		Then the 1st stage KYC requirements screen is displayed (invision 703?)
		And a list of necessary attributes and documents is displayed

	Scenario: 1st stage KYC requirements
		Given the user has selected the bank option
		And all the 1st kyc requirements are available in the wallet
		And user has accepted the terms and services
		When user clicks the "Submit" button
		Then the bank accounts is in progress information modal is displayed
		And a link to the "Manage Applications" screen is displayed

	Scenario: Application was initiated, paid but no preferred bank account was selected
		Given Given jurisdiction detailed screen screen is opened
		And an existing pending application without payment exists
		Then the "Open Bank account" button is replaced with "Continue Application"
		When user clicks the "Continue Application" button
		Then the choose bank option screen is displayed (invision?)
		And a list of possible bank options with details and bank names is displayed to the user

	Scenario: Application was initiated, paid but 1st stage KYC requirements were not fullfilled
		Given Given jurisdiction detailed screen screen is opened
		And an existing pending application without payment exists
		Then the "Open Bank account" button is replaced with "Continue Application"
		When user clicks the "Continue Application" button
		Then the 1st stage KYC requirements screen is displayed (invision 703?)
		And a list of necessary attributes and documents is displayed
