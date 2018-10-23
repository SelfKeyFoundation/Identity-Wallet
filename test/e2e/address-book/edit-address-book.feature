Feature: Edit saved label

Background: Given the user has added address on Address Book

    Scenario: Label is already in use
        Given user has opened Address Book screen
        And there is already an address added with label Test 
        When user clicks on pencil icon
        And enters existing label
        Then user can see error message informing that label already exists

    Scenario: Successfully edited label
        Given user has opened Address Book screen
        And there is already an address added with label Test
        When user clicks on pencil icon
        And enters correct new label 
        And clicks Save button
        Then user can see updated label on the Address Book table