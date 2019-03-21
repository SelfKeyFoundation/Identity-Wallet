Feature: Browse Passports Marketplace

	Background: Given user has opened SelfKey wallet
	And the user has opened the Passports Marketplace Screen

	Scenario: Passports data is loading
		Given passports data has not loaded
		Then user sees a loading animation

	Scenario: Filter programs by Type
		Given passports data has loaded
		When user clicks the a specific "Type" label in "Type" column
		Then Passports list is updated showing only programs with that specific type
		And a message is displayed to indicate the active filter

	Scenario: Remove filter
		Given passports data has loaded
		And a filter is active
		When user clicks "Clear Filter" button
		Then filter is removed and passports program list is updated
		And the filter message is removed

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
