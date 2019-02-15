Feature: Browse Incorporations Marketplace

	Background: Given user has opened SelfKey wallet
	And the user has opened the Incorporations Marketplace Screen

	Scenario: Incorporations data is loading
		Given incorporations data has not loaded
		Then user sees a loading animation

	Scenario: Filter programs by Type
		Given incorporations data has loaded
		When user clicks the a specific "Type" label in "Type" column
		Then incorporations list is updated showing only programs with that specific type
		And a message is displayed to indicate the active filter

	Scenario: Remove filter
		Given incorporations data has loaded
		And a filter is active
		When user clicks "Clear Filter" button
		Then filter is removed and incorporations program list is updated
		And the filter message is removed

	Scenario: Ordering programs table
		Given incorporations data has loaded
		When user clicks a column header
		Then the incorporations program list should order by that column
		And a visual indication is displayed on the column header

	Scenario: Not Enough Tokens to Apply
		Given incorporations data has loaded
		When user is browsing the incorporations Marketplace screen
		And a specific program requires more KEY tokens than available in the wallet
		Then a warning message is displayed

	Scenario: Open Specific Program Screen
		Given incorporations data has loaded
		When user clicks the "Details" button on the last column
		Then the program detailed screen is displayed






