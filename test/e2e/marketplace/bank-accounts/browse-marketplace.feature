Feature: Browse Bank Accounts Marketplace

Background: Given the user has created a SelfKey wallet
	
	Scenario: Bank accounts data is loading
		Given user has opened the Marketplace Screen
		When user clicks on Bank Accounts button
    And bank accounts data has not loaded
		Then user sees a loading animation

	Scenario: Bank accounts data has loaded
		Given user has opened the Marketplace Screen
		When user clicks on Bank Accounts button
		And bank accounts data has loaded
		Then user sees a table with information on each jurisdiction (Type, Interest, Min Deposit, Fiat, Remote, Fee)

	Scenario: Open Specific Jurisdiction Screen
		Given user has opened the Marketplace Screen
		When user clicks on Bank Accounts button
		And bank accounts data has loaded
		And user clicks the Antigua and Barbuda Details button
		Then the jurisdiction detailed screen is displayed

	Scenario: Filter programs by Type
		Given user has opened the Marketplace Screen
		When user clicks on Bank Accounts button
		And bank accounts data has loaded
		And user clicks one of the top tab options (Personal, Corporate, Private)
		Then bank accounts list is updated showing only offers for that specific type
