Feature: View Incorporations Program

	Background: Given user has opened SelfKey wallet
	And the user has opened the Incorporations Marketplace Screen
	And the user has opened a specific Incorporations Program

	Scenario: KYC requirements visual indication
		When incorporations detailed program screen is opened
		Then a list will be displayed at the bottom with all the required KYC documents and attributes for that program
		And visually indicate which ones are missing

	Scenario: Browse detailed program description
		Given Given incorporations detailed program screen is opened
		When "Description" tab is clicked
		Then it should display the program text description

	Scenario: Browse detailed program taxes
		Given Given incorporations detailed program screen is opened
		When "Taxes" tab is clicked
		Then it should display the program detailed tax table

	Scenario: Browse detailed program legal
		Given Given incorporations detailed program screen is opened
		When "Legal" tab is clicked
		Then it should display the program legal information

	Scenario: Browse detailed program country details
		Given Given incorporations detailed program screen is opened
		When "Country Details" tab is clicked
		Then it should display the program country general information

	Scenario: Browse detailed program tax treaties
		Given Given incorporations detailed program screen is opened
		When "Tax Treaties" tab is clicked
		Then it should display a list of tax treaties with the select program country
		And it should display a world map with those tax treaties highlighted

	Scenario: Browse detailed program services
		Given incorporations detailed program screen is opened
		When "Services" tab is clicked
		Then it should display the services provided as part of package sold
