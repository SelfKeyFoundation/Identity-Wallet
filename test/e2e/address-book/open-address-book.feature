Feature: Open Address Book

Background: Given the user has created a SelfKey wallet

    Scenario: Opened Address Book successfully
        Given user has opened SelfKey Wallet
        When user clicks on Hamburger icon > Address Book
        Then Address Book screen is displayed



