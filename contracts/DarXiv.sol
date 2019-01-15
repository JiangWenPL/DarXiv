pragma solidity ^0.4.17;
// pragma experimental ABIEncoderV2;

import "./mortal.sol";

contract DarXiv is mortal {
    /* Struct for the submission */
    struct SubmitStruct {
        string title;
        uint256 datetime;
        string digestUint8Str; // For SHA-256
        string pdfURL;
        string imgURL;
        address submitter;
        string authors;
        string abstract_;
    }

    /* ID of the Next Submission */
    uint256 private nextSubmissionID = 0; 

    /* Number of the submissions (Excluding Deleted) */
    uint256 private submissionNum = 0;

    /* All submissions */
    mapping(uint256 => SubmitStruct) public submissions;


    /* Add a Submission */
    function addSubmission(string _title, string _authors, string _abstract_,string _digestUint8Str, string _pdfURL, string _imgURL)
          public  returns (uint256) {
        submissions[nextSubmissionID].title = _title; 
        submissions[nextSubmissionID].datetime = now; 
        submissions[nextSubmissionID].digestUint8Str = _digestUint8Str;
        submissions[nextSubmissionID].pdfURL = _pdfURL;
        submissions[nextSubmissionID].imgURL = _imgURL;
        submissions[nextSubmissionID].submitter = msg.sender;
        submissions[nextSubmissionID].authors = _authors;
        submissions[nextSubmissionID].abstract_ = _abstract_;

        nextSubmissionID ++; 
        submissionNum ++;
        return nextSubmissionID - 1;
    }

    /* Delete a Submission */
    function deleteSubmission(uint256 _id) public {
        require(submissions[_id].submitter == msg.sender, "You cannot delete it since you are not a submitter");
        delete submissions[_id];

        submissionNum --;
    }

    /* Edit a Submission */
    function editSubmission(uint256 _id, string _pdfURL, string _imgURL)  public {
        require(submissions[_id].submitter == msg.sender, "You cannot edit it since you are not a submitter");
        submissions[_id].pdfURL = _pdfURL;
        submissions[_id].imgURL = _imgURL;
    }

    /* Get Number of the submissions (Including Deleted) */
    function getNumberOfsubmissionsDeleted() public constant returns (uint256) {
        return nextSubmissionID; 
    }

    /* Get Number of the submissions (Excluding Deleted) */
    function getNumberOfsubmissions() public constant returns (uint256) {
        return submissionNum;
    }

}
