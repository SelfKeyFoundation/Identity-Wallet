Feature: View bank accounts jurisdiction

	Background: Given user has opened SelfKey wallet
	And the user has opened the Bank Accounts Marketplace Screen

	Scenario: Open Specific Jurisdiction Screen
		When user clicks the "Details" button on the last column
		Then the jurisdiction detailed screen is displayed
		And information on fees, and banking option is displayed
		And default "Account Types" tab is opened

	Scenario: Browse detailed jurisdiction description
		Given Given jurisdiction detailed screen screen is opened
		When "Account details" tab is clicked
		Then it should display the jurisdiction account details from airtable

	Scenario: Browse detailed jurisdiction description
		Given Given jurisdiction detailed screen screen is opened
		When "Description" tab is clicked
		Then it should display the jurisdiction detailed description from airtable

	Scenario: Browse detailed jurisdiction country details
		Given Given jurisdiction detailed screen screen is opened
		When "Country Details" tab is clicked
		Then it should display the selected country details from airtable

	Scenario: Browse detailed jurisdiction country details
		Given Given jurisdiction detailed screen screen is opened
		When "Services" tab is clicked
		Then it should display the services information from airtable

	Scenario: Browse detailed jurisdiction country details
		Given Given jurisdiction detailed screen screen is opened
		When "Services" tab is clicked
		Then it should display the services information from airtable

	Scenario: Browse bank options
		Given Given jurisdiction detailed screen screen is opened
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
