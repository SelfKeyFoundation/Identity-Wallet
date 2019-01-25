Feature: View Passport Program

	Background: Given user has opened SelfKey wallet
	And the user has opened the Passport Marketplace Screen
	And the user has opened a specific Passport Program

	Scenario: KYC requirements visual indication
		When Passport detailed program screen is opened
		Then a list will be displayed at the bottom with all the required KYC documents and attributes for that program
		And visually indicate which ones are missing

	Scenario: Browse detailed program description
		Given Given Passport detailed program screen is opened
		When "Description" tab is clicked
		Then it should display the program text description

	Scenario: Browse detailed program visa free map
		Given Given Passport detailed program screen is opened
		When "Visa Free" tab is clicked
		Then it should display a list of visa requirements for each country
		And it should display a world map with visa free countries highlighted

	Scenario: Browse detailed program services
		Given Passport detailed program screen is opened
		When "Services" tab is clicked
		Then it should display the services provided as part of package sold
