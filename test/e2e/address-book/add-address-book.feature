Feature: Add Address

Background: Given the user has created a SelfKey wallet

    Scenario: Invalid Eth address
        Given user has opened Address Book screen
        When user clicks on Add Address button
        And enters invalid ETH address
        Then user can see error message informing of invalid ETH address entered

    Scenario: Adding current user address
        Given user has opened Address Book screen with a private key
        When user clicks on Add Address button
        And enters current wallet ETH address
        Then user can see error message that current eth address can't be saved

    Scenario: Long label
        Given user has opened Address Book screen
        When user clicks on Add Address button
        And enters more than 25 characters label
        Then user can see error message to enter 25 characters or less for label

    Scenario: Label is already in use
        Given user has opened Address Book screen
        And there is already an address added with label Test 
        When user clicks on Add Address button
        And enters existing label Test
        Then user can see error message informing that label already exists

    Scenario: Eth Address is already added
        Given user has opened Address Book screen
        And there is already an address added with label Test
        When user clicks on Add Address button
        And enters existing eth address
        Then user can see error message informing that eth address already exists

    Scenario: Successfully added address
        Given user has opened Address Book screen
        When user clicks on Add Address button
        And enters correct label and valid ETH address
        And clicks Save button
        Then user can see added address on the Address Book table