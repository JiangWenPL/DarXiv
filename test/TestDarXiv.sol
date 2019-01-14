pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DarXiv.sol";

contract TestDarXiv {
    // The address of the adoption contract to be tested
    DarXiv darxiv = DarXiv(DeployedAddresses.DarXiv());

    // The id of the pet that will be used for testing
    uint expectedSubmitID = 0;

    //The expected owner of adopted pet is this contract
    address expectedSubmitter = this;

    function testUserCanSubmit() public {
        uint256 returnedId = darxiv.addSubmission("Titll-mvpose", 
            "149,211,255,239,89,249,223,134,104,131,73,196,145,68,98,174,177,93,158,141,194,1,17,31,28,212,226,110,6,85,182,245",
            "https://jiangwenpl.github.io/files/multi-pose.pdf", "http://www.arxiv-sanity.com/static/thumbs/1901.03690v1.pdf.jpg");
    }

    function testUsercanDelte()public{
        testUserCanSubmit();
        darxiv.deleteSubmission(0);
    }

    function testUsercanEdit()public{
        uint256 returnedId = darxiv.addSubmission("Titll-mvpose", 
            "149,211,255,239,89,249,223,134,104,131,73,196,145,68,98,174,177,93,158,141,194,1,17,31,28,212,226,110,6,85,182,245",
            "https://jiangwenpl.github.io/files/multi-pose.pdf", "http://www.arxiv-sanity.com/static/thumbs/1901.03690v1.pdf.jpg");
        darxiv.editSubmission(returnedId, "Titll-mvpose", 
            "149,211,255,239,89,249,223,134,104,131,73,196,145,68,98,174,177,93,158,141,194,1,17,31,28,212,226,110,6,85,182,245",
            "c", "http://www.arxiv-sanity.com/static/thumbs/1901.03690v1.pdf.jpg");
    }

    function testUsercanNumberDeleted()public{
        darxiv.getNumberOfsubmissionsDeleted();
    }
    function testUsercanNumber()public{
        darxiv.getNumberOfsubmissions();
    }

}