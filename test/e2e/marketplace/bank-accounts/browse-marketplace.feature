Feature: Browse Bank Accounts Marketplace

	Background: Given user has opened SelfKey wallet
	And the user has opened the Bank Accounts Marketplace Screen

	Scenario: Bank accounts data is loading
		Given bank accounts data has not loaded
		Then user sees a loading animation

	Scenario: Bank accounts data has loaded
		When bank accounts data has loaded
		Then user sees a table with information on each jurisdiction (Type, Interest, Min Deposit, Fiat, Remote, Fee)

	Scenario: Open Specific Jurisdiction Screen
		Given bank accounts data has loaded
		When user clicks the "Details" button on the last column
		Then the jurisdiction detailed screen is displayed

	Scenario: Filter programs by Type
		Given bank accounts data has loaded
		When user clicks one of the top tab options (Personal, Corporate, Private)
		Then bank accounts list is updated showing only offers for that specific type







