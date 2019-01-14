App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        // Load pets.
        // $.getJSON('../pets.json', function (data) {
        //     var petsRow = $('#petsRow');
        //     var petTemplate = $('#petTemplate');
        //
        //     for (i = 0; i < data.length; i++) {
        //         petTemplate.find('.panel-title').text(data[i].name);
        //         petTemplate.find('img').attr('src', data[i].picture);
        //         petTemplate.find('.pet-breed').text(data[i].breed);
        //         petTemplate.find('.pet-age').text(data[i].age);
        //         petTemplate.find('.pet-location').text(data[i].location);
        //         petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        //
        //         petsRow.append(petTemplate.html());
        //     }
        // });

        return await App.initWeb3();
    },

    initWeb3: async function () {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('DarXiv.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var DarXivArtifact = data;
            App.contracts.DarXiv = TruffleContract(DarXivArtifact);

            // Set the provider for our contract
            App.contracts.DarXiv.setProvider(App.web3Provider);

            App.getSubmission(0);
        });
        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-submit', App.submitPaper);
    },
    submitPaper: function (event) {
        console.log("Hohoho");
        let submitTitle = $('#submitTitle').val();
        let pdfURL = $('#pdfURL').val();
        let imgURL = $('#imgURL').val();
        var reader = new FileReader();
        reader.onload = function () {
            window.crypto.subtle.digest('SHA-256', this.result)
                .then(digest => {
                    let digestUint8Str = new Uint8Array(digest).toString();
                    //App.contracts.DarXiv.deployed().then(instance=>console.log(instance.submissions))
                    console.log('Before submit');
                    let submissionId = App.contracts.DarXiv.deployed().then(res => res.addSubmission(submitTitle, digestUint8Str, pdfURL, imgURL));
                    console.log(submissionId + " Submission done")
                }).then(App.getSubmission(0)
            )
            ;
        };
        fetch(pdfURL)
            .then(res => res.blob())
            .then(blob => reader.readAsArrayBuffer(blob))
            .catch(reason => console.log(reason));
    },
//     submissions[nextSubmissionID].title = _title;
// submissions[nextSubmissionID].datetime = now;
// submissions[nextSubmissionID].digestUint8Str = _digestUint8Str;
// submissions[nextSubmissionID].pdfURL = _pdfURL;
// submissions[nextSubmissionID].imgURL = _imgURL;
// submissions[nextSubmissionID].submitter = msg.sender;
    getSubmission: function (submissionId) {
        console.log('HERE');
        App.contracts.DarXiv.deployed().then(res => res.submissions(submissionId).then(submission => {
                console.log('OUT');
                var paperRow = $('#paperRow');
                var paperTemplate = $('#paperTemplate');

                paperTemplate.find('.panel-title').text(submission[0]);
                paperTemplate.find('.paper-datetime').text(submission[1]);
                paperTemplate.find('.paper-pdfURL').text(submission[2]);
                paperTemplate.find('.paper-digestUint8Str').text(submission[3]);
                paperTemplate.find('img').attr('src', submission[4]);
                paperTemplate.find('.paper-submitter').text(submission[5]);

                paperRow.append(paperTemplate.html());
                App.contracts.DarXiv.deployed().then(res => {
                    res.getNumberOfsubmissionsDeleted().then(numberOfSubmissionsDeleted => {
                        if (submissionId < numberOfSubmissionsDeleted - 1) {
                            App.getSubmission(submissionId + 1);
                        } else {
                            $('#loading').hide();
                            $('#posts').show();
                        }
                    }).catch(error => {
                        console.error('Error while getting number of blog posts (including deleted):');
                        console.error(error);
                    })
                });
            }
            )
        )
    }

}
;

$(function () {
    $(window).load(function () {
        App.init();
    });
});
