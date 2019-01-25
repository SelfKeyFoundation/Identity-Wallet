Feature: Open Passports Marketplace

	Background: Given the user has created a SelfKey wallet

	Scenario: Open Passports Marketplace
		Given user has opened SelfKey wallet
		And navigated to the Marketplace screen
		When user clicks the "Learn More" button in Passports & Residencies block
		Then Passports list screen is displayed
