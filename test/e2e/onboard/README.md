#IMPROVED ONBOARDING
https://kyc-chain.atlassian.net/wiki/spaces/IDWAL/pages/36896796/Test+Plan+-+Improve+On-boarding+Flow

##TC01: Navigating to Selfkey Basic ID screen

* Open ID Wallet Application
* Click CREATE NEW WALLET button
* Click Create Selfkey Basic ID
* User should be able to see the Selfkey Basic ID screen with the following fields:
*   * First Name
*   * Last Name
*   * Middle Name
*   * Country of Residency

##TC02: Verifying required fields in the Selfkey Basic ID screen
###Prerequisite: TC01

* Click Selfkey Basic ID button
* Click each field without populating
* Create Selfkey Basic ID button is disabled
* All fields except Middle Name have:
* 2.1 A red asterisk \* shown beside field label when clicking the field
* 2.2 Error message "This field is required. Please enter <Field Label>" displayed when user moves to the other field without populating the it.

##TC03: Populating and submitting Selfkey Basic ID form
###Prerequisite: TC01

* Populate First Name
* Populate Last Name
* Populate Middle Name
* Select <Country> in the Country of Residency
* Click Selfkey Basic ID button
* No error is encountered when populating all fields
* Country of Residency only displays supported countries in the drop down
* Create Selfkey Basic ID button is now enabled
* Details are saved and redirects user to Password Warning screen

##TC04: Create and Confirm Password
###Prerequisite: TC03

* Click "I understand, There is no way to recover the password" button in the Password Warning screen
* Click Next button without populating the password field.
* Enter "Password" in the password field
* Enter "MyTest01!" in the password field
* Click Next button
* Click Back button
* Enter "MyTest01" in the password field.
* Click Next button
* Enter "MyTest01" in the password field and click Next
* Enter "MyTest01!" in the password field
* Click Next button
* Create Password screen is displayed.
* Warning message "password is required" is displayed.
* "Password" - shows 1 bar and "Weak"
* "MyTest01!" - shows 4 bars and "Strong"
* Confirm Password screen is displayed
* User is redirected back to the previous screen with blank password field
* Confirm Password screen is displayed
* Confirm Password screen is displayed
* "wrong confirmation password" is displayed.
* "MyTest01!" - shows 4 bars and "Strong"
* "Save Your Keystone File" screen is displayed

##TC05: Saving Keystore File
###Prerequisite: TC04

* Click "Backup Your Keystore File (UTC / JSON)" button
* Save file to local
* Click "I Understand, Continue"
* Keystore File is saved in the local
* "Save Your Private Key" screen is displayed where Private Key is masked by default

##TC06: Saving Private Key
###Prerequisite: TC05

* Click (question) icon beside the Private key field
* Click (question) icon again
* Click "Print Paper Wallet" button and print
* Click Continue
* Private key is unmasked after clicking (question) for the first time.
* Private key is masked after clicking (question) for the second time.
* System only prints the Private key section
* Wallet Setup Complete screen is displayed and automatically redirects user to ID Wallet Checklist screen.

##TC07.01: Adding National ID and Selfie with ID Document
###Prerequisite: TC06

* Click "Add More Details" button
* Click "Your National ID" widget and upload a file (in png, jpg/jpeg, pdf formats, file size: up to 50MB)
* Click Next button
* Click "Selfie With National ID" widget and upload a file (in png, jpg/jpeg, pdf formats, file size: up to 50MB)
* Click Next button
* ID Wallet Checklist screen is displayed. The following has been marked as:
* 1.1 Completed (with check mark):
* Full Legal Name,
* Country of Residency
* 1.2 Incomplete (no check mark):
* National ID
* Selfie with National ID
* Upload Your National ID screen is displayed.
* While uploading "National ID" File, "Connecting your National ID" is displayed.
* If successful, "Step 3 has been successfully connected
* " is displayed and "Your National ID" is marked as completed in the checklist.
* If failed, "Error. Can't connect. Try again" is displayed. "National ID" is marked as RED in the checklist. Redo step 3.
* "Upload Selfie With ID" screen is displayed.
* While uploading "Selfie With National ID" File, "Connecting your Selfie With National ID" is displayed.
* If successful, "Step 4 has been successfully connected" is displayed and "Selfie With National ID" is marked as completed in the checklist.
* If failed, "Error. Can't connect. Try again" is displayed. "Selfie With National ID" is marked as RED in the checklist. Redo step 4.
* User is redirected to Selfkey Identity Wallet where:
* Completed attributes have yellow mark
* Incomplete attributes have red mark with Action Required text beside it.

##TC07.02: Skipping ID and Selfie Upload
###Prerequisite: TC06

* Click "I'm not ready" link
* User is redirected to the Selfkey Identity Wallet where National ID and Selfie with National ID attributes are marked RED with Action Required text beside.
