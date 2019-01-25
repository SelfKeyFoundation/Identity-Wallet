Feature: Detailed Program Feature

	Background: Given user opened a specific passport Program

	Scenario:

	Scenario: Missing KYC required document
		Given the passport program requires a document not available in the wallet
		Then user sees a missing icon for that document in the KYC requirements section

	Scenario: Missing KYC required task
		Given the passport program requires a KYC task not yet completed
		Then user sees a missing icon for that step in the KYC requirements section
		And a link to complete the task

	Scenario: KYC required document available but not submitted

	Scenario: KYC required document submitted but not yet approved

	Scenario: KYC required document submitted but rejected

	Scenario: KYC required document

	Scenario: User applies to the program

	Scenario: KYC is pending

	Scenario: Payment is pending

	Scenario

	Scenario: Filter programs by Type
		Given passports data has loaded
		When user clicks the a specific "Type" label in "Type" column
		Then Passports list is updated showing only programs with that specific type
		And a message is displayed to indicate the active filter

	Scenario: Order programs table
		Given passports data has loaded
		When user clicks a column header
		Then the passports program list should order by that column
		And a visual indication is displayed on the column header

	Scenario: Open Program
		Given passports data has loaded
		When user clicks the "Details" button on the last column
		Then the program detailed screen is displayed

	Scenario: Not Enough Tokens to Apply
		Given passports data has loaded
		When user is browsing the Passports Marketplace screen
		And a specific program requires more KEY tokens than available in the wallet
		Then the Details button in the last column is greyed out
		And a warning message is displayed
