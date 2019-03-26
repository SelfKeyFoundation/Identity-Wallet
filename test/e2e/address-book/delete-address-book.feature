Feature: Delete Address

Background: Given the user has added address on Address Book

    Scenario: Delete address
        Given user has opened Address Book screen
        And there is already an address added with label Test
        When user clicks on x icon of an address
        Then user could no longer see address on Address Book table



