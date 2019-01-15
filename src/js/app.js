App = {
    web3Provider: null,
    contracts: {},

    init: async function () {

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
            App.web3Provider.enable();
            App.getSubmission(0);
            App.contracts.DarXiv.deployed()
                .then(res => res.getNumberOfsubmissions())
                .then(res => {
                    if (res < 1) {
                        App.readInitPapers();
                    }
                })
                .catch(reason => console.log(reason));
        });
        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '#btn-submit', App.submitPaper);
        $(document).on('click', '#btn-edit-submit', App.editPaper);
    },

    setEditID: function (submissionID) {
        $("#edit-id").val(submissionID);
        App.contracts.DarXiv.deployed()
            .then(res => res.submissions(submissionID))
            .then(submission => {
                $("#editTitle").val(submission[0]);
                $("#editPdfURL").val(submission[3]);
                $("#editImgURL").val(submission[4]);
                $("#editAuthors").val(submission[6]);
                $("#editAbstract_").val(submission[7]);
            }).catch(reason => console.log(reason));
    },
    editPaper: function () {
        App.contracts.DarXiv.deployed()
            .then(res => {
                res.editSubmission(parseInt($("#edit-id").val()), $("#editTitle").val(), $("#editAuthors").val(),
                    $("#editAbstract_").val(), $("#editPdfURL").val(), $("#editImgURL").val())
            })
            .catch(reason => console.log(reason));
    },

    readInitPapers: function () {
        // Load papers for better visualization if its empty.
        $.getJSON('../papers.json', function (data) {
            data.forEach(v => {
                App.contracts.DarXiv.deployed()
                    .then(res => res.addSubmission(v.title, v.authors, v.abstract_, v.digestUint8Str, v.pdfURL, v.imgURL))
                    .catch(reason => {
                        console.log(reason);
                    });
            })
        });
    },
    getDigestByURL: function (pdfURL) {
        return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.onload = function () {
                    window.crypto.subtle.digest('SHA-256', new Uint8Array(this.result))
                        .then(digest => {
                            digExpr = digest;
                            let digestUint8Str = new Uint8Array(digest).toString();
                            resolve(digestUint8Str);
                            console.log(digestUint8Str, pdfURL);
                        }).catch(reason => reject(reason));
                };
                fetch(new Request(pdfURL))
                    .then(res => res.blob().then(blob => {
                            console.log(blob, pdfURL);
                            reader.readAsArrayBuffer(blob)
                        }
                        )
                    )
                    .catch(reason => {
                        console.log(reason);
                        reject(reason)
                    });

            }
        )
            ;
    },
    submitPaper: function (event) {
        console.log("Hohoho");
        let submitTitle = $('#submitTitle').val();
        let pdfURL = $('#pdfURL').val();
        let imgURL = $('#imgURL').val();
        let authors = $('#authors').val();
        let abstract_ = $('#abstract_').val();

        var reader = new FileReader();
        reader.onload = function () {
            window.crypto.subtle.digest('SHA-256', this.result)
                .then(digest => {
                        let digestUint8Str = new Uint8Array(digest).toString();
                        //App.contracts.DarXiv.deployed().then(instance=>console.log(instance.submissions))
                        console.log('Before submit');
                        web3.eth.getAccounts(function (error, accounts) {
                            if (error) {
                                console.log(error);
                            }
                            var account = accounts[0];
                            let submissionId = App.contracts.DarXiv.deployed()
                                .then(res => res.addSubmission(submitTitle, authors, abstract_, digestUint8Str, pdfURL, imgURL))
                                .catch(reason => {
                                    console.log(reason);
                                });
                        });
                    }
                );
        };
        fetch(pdfURL, {mode: 'no-cors'})
            .then(res => res.blob())
            .then(blob => reader.readAsArrayBuffer(blob))
            .catch(reason => console.log(reason));
    }
    ,

    getSubmission:
        function (submissionId) {
            if (submissionId === 0)
                $('#paperRow').children().remove();
            // console.log('HERE');
            App.contracts.DarXiv.deployed().then(res => res.submissions(submissionId)).then(submission => {
                    // console.log('OUT');
                    var paperRow = $('#paperRow');
                    var paperTemplate = $('#paperTemplate');

                    paperTemplate.find('.panel-title').text(submission[0]);
                    paperTemplate.find('.paper-datetime').text(new Date(1000 * submission[1]).toDateString());
                    paperTemplate.find('.paper-digestUint8Str').attr("id", "check-" + submissionId.toString());
                    App.getDigestByURL(submission[3])
                        .then(res => {
                            let checkResult;
                            if (res === submission[2].toString()) {
                                checkResult = "This pdf is trustful";
                                paperRow.find("#check-" + submissionId.toString()).find("span").attr("class", "badge badge-pill badge-success");
                                paperRow.find("#check-" + submissionId.toString()).find("span").text("Passed")
                            } else {
                                checkResult = "This pdf is not consistent with the record on block chain";
                                paperRow.find("#check-" + submissionId.toString()).find("span").attr("class", "badge badge-pill badge-danger");
                                paperRow.find("#check-" + submissionId.toString()).find("span").text("Failed");
                            }
                            // console.log(submission[2] + " VS " + res);
                            paperRow.find("#check-" + submissionId.toString()).find("a").text(checkResult);
                            // console.log(paperTemplate.html())
                        })
                        .catch(reason => console.log(reason));
                    paperTemplate.find('.paper-pdfURL').attr('href', submission[3]);
                    paperTemplate.find('img').attr('src', submission[4]);
                    paperTemplate.find('.paper-submitter').text(submission[5]);
                    paperTemplate.find('.panel-authors').text(submission[6]);
                    paperTemplate.find('.paper-abstract').text(submission[7]);
                    paperTemplate.find('.btn-primary').attr("onclick", "App.setEditID(" + submissionId + ")");
                    paperRow.prepend(paperTemplate.html());
                    App.contracts.DarXiv.deployed()
                        .then(res => res.getNumberOfsubmissions())
                        .then(numSubmissions => {
                            if (submissionId < numSubmissions - 1)
                                App.getSubmission(submissionId + 1);
                        }).catch(error => {
                        console.error('Error while getting number of blog posts (including deleted):');
                        console.error(error);
                    });
                }
            )
        }

}
;

$(function () {
    $(window).load(function () {
        App.init();
    });
});
