Feature: View bank accounts jurisdiction

Background: Given the user has created a SelfKey wallet

	Scenario: Open Specific Jurisdiction Screen
		Given user has opened the Bank Accounts Screen
		When user clicks the Antigua and Barbuda Details button
		Then the jurisdiction detailed screen is displayed
		And information on fees, and banking option is displayed
		And default Account Types tab is opened

	Scenario: Browse detailed jurisdiction account info
		Given user has opened the Jurisdiction Detailed screen
		When user clicks the Account Types tab 
		Then the jurisdiction account types from airtable is displayed

	Scenario: Browse detailed jurisdiction description info
		Given user has opened the Jurisdiction Detailed screen
		When user clicks the Description tab
		Then the jurisdiction detailed description from airtable is displayed

	Scenario: Browse detailed jurisdiction country info
		Given user has opened the Jurisdiction Detailed screen
		When user clicks the Country Details tab
		Then the selected country details from airtable is displayed

	Scenario: Browse detailed jurisdiction services info
		Given user has opened the Jurisdiction Detailed screen
		When user clicks the Services tab
		Then the services information from airtable is displayed

	Scenario: Browse bank options
		Given user has opened the Jurisdiction Detailed screen
		When user clicks each bank option expand box
		Then it should display each option details without the specific bank name
		And should display 2nd stage KYC requirements in text from airtable

	Scenario: KYC requirements display
		Given Given jurisdiction detailed screen screen is opened
		Then a list will be displayed at the bottom with all the required 1st stage KYC documents and attributes
		And visually indicate which ones are missing from the user Selfkey ID

	Scenario: User application to the jurisdiction is in progress
		Given Given jurisdiction detailed screen screen is opened
		And user is authenticated if using a hardware wallet
		And user has an existing application in progress for that jurisdiction
		Then "Open Bank Account" button is disabled
		And an information top level bar indicates an application is in progress and displays a link to Manage Applications screen
		And the selected bank options is highlighted

	Scenario: User application to the jurisdiction was rejected
		Given Given jurisdiction detailed screen screen is opened
		And user is authenticated if using a hardware wallet
		And user has an existing rejected application that jurisdiction
		And an information top level bar indicates a previous application was rejected and displays a link to Manage Applications screen
		And the selected bank options is highlighted

	Scenario: User application to the jurisdiction is in progress
		Given Given jurisdiction detailed screen screen is opened
		And user is authenticated if using a hardware wallet
		And user has an existing application was accepted for that jurisdiction
		Then "Open Bank Account" button is disabled
		And an information top level bar indicates a previous application was accepted and displays a link to Manage Applications screen
		And the selected bank options is highlighted
