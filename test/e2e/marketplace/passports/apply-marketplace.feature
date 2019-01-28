Feature: Apply to Passports Program

	Background: Given user has opened SelfKey wallet
	And the user has opened the Passports Marketplace Screen
	And the user has opened a specific Passports Program

	Scenario: Initial application without KYC requirements
		Given Passports detailed program screen is opened
		And not all of the KYC requirements are present in the wallet
		When user clicks the "Apply" button
		Then ...

	Scenario: Existing ongoing application process
		Given Passports detailed program screen is opened
		And an existing application process exists for that program
		Then the "Start Passports" button should be deactivated
		And a hyperlink to the kyc-chain on-boarding app should be displayed

	Scenario: Not enough tokens to apply
		Given Passports detailed program screen is opened
		And the user doesn't have enough tokens to cover the program cost
		Then the "Apply" button should be deactivated
		And message indicating the user doesn't have enough tokens should be displayed

	Scenario: Initial application with KYC requirements
		Given Passports detailed program screen is opened
		And all of the KYC required attributes and documents are present in the wallet
		When user clicks the "Apply" button
		Then a confirmation and authorization screen is displayed (s702)

	Scenario: Ask for payment with KEY tokens
		Given Passports detailed program screen is opened
		And user clicked the "Apply" button
		And the Confirmation and Authorization screen is shown (s702)
		When user clicks "Authorize"
		Then a payment confirmation screen should show up

	Scenario: Successful payment for Passports
		Given Passports detailed program screen is opened
		And payment confirmation screen is showing up
		When user clicks "Pay"
		And payment is successful
		Then a visual feedback is displayed
		And And a hyperlink to kyc-chain on-boarding app is displayed

	Scenario: Failed payment for Passports
		Given Passports detailed program screen is opened
		And payment confirmation screen is showing up
		When user clicks "Pay"
		And payment fails
		Then a visual indication is displayed
		And ...

