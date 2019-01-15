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
        uint256 returnedId = darxiv.addSubmission("Low-Power Neuromorphic Hardware for Signal Processing Applications",
            "Bipin Rajendran, Abu Sebastian, Michael Schmuker, Narayan Srinivasa, Evangelos Eleftheriou",
            "Machine learning has emerged as the dominant tool for implementing complex cognitive tasks that require supervised, unsupervised, and reinforcement learning. While the resulting machines have demonstrated in some cases even super-human performance, their energy consumption has often proved to be prohibitive in the absence of costly super-computers. Most state-of-the-art machine learning solutions are based on memory-less models of neurons. This is unlike the neurons in the human brain, which encode and process information using temporal information in spike events. The different computing principles underlying biological neurons and how they combine together to efficiently process information is believed to be a key factor behind their superior efficiency compared to current machine learning systems. Inspired by the time-encoding mechanism used by the brain, third generation spiking neural networks (SNNs) are being studied for building a new class of information processing engines. Modern computing systems based on the von Neumann architecture, however, are ill-suited for efficiently implementing SNNs, since their performance is limited by the need to constantly shuttle data between physically separated logic and memory units. Hence, novel computational architectures that address the von Neumann bottleneck are necessary in order to build systems that can implement SNNs with low energy budgets. In this paper, we review some of the architectural and system level design aspects involved in developing a new class of brain-inspired information processing engines that mimic the time-based information encoding and processing aspects of the brain.",
            "149,211,255,239,89,249,223,134,104,131,73,196,145,68,98,174,177,93,158,141,194,1,17,31,28,212,226,110,6,85,182,245",
            "https://jiangwenpl.github.io/files/multi-pose.pdf", "http://www.arxiv-sanity.com/static/thumbs/1901.03690v1.pdf.jpg");
    }

    function testUsercanDelte()public{
        testUserCanSubmit();
        darxiv.deleteSubmission(0);
    }

    function testUsercanEdit()public{
            uint256 returnedId = darxiv.addSubmission("Low-Power Neuromorphic Hardware for Signal Processing Applications",
            "Bipin Rajendran, Abu Sebastian, Michael Schmuker, Narayan Srinivasa, Evangelos Eleftheriou",
            "Machine learning has emerged as the dominant tool for implementing complex cognitive tasks that require supervised, unsupervised, and reinforcement learning. While the resulting machines have demonstrated in some cases even super-human performance, their energy consumption has often proved to be prohibitive in the absence of costly super-computers. Most state-of-the-art machine learning solutions are based on memory-less models of neurons. This is unlike the neurons in the human brain, which encode and process information using temporal information in spike events. The different computing principles underlying biological neurons and how they combine together to efficiently process information is believed to be a key factor behind their superior efficiency compared to current machine learning systems. Inspired by the time-encoding mechanism used by the brain, third generation spiking neural networks (SNNs) are being studied for building a new class of information processing engines. Modern computing systems based on the von Neumann architecture, however, are ill-suited for efficiently implementing SNNs, since their performance is limited by the need to constantly shuttle data between physically separated logic and memory units. Hence, novel computational architectures that address the von Neumann bottleneck are necessary in order to build systems that can implement SNNs with low energy budgets. In this paper, we review some of the architectural and system level design aspects involved in developing a new class of brain-inspired information processing engines that mimic the time-based information encoding and processing aspects of the brain.",
            "149,211,255,239,89,249,223,134,104,131,73,196,145,68,98,174,177,93,158,141,194,1,17,31,28,212,226,110,6,85,182,245",
            "https://jiangwenpl.github.io/files/multi-pose.pdf", "http://www.arxiv-sanity.com/static/thumbs/1901.03690v1.pdf.jpg");
        darxiv.editSubmission(returnedId, "Low-Power Neuromorphic Hardware for Signal Processing Applications",
            "Bipin Rajendran, Abu Sebastian, Michael Schmuker, Narayan Srinivasa, Evangelos Eleftheriou",
            "Machine learning has emerged as the dominant tool for implementing complex cognitive tasks that require supervised, unsupervised, and reinforcement learning. While the resulting machines have demonstrated in some cases even super-human performance, their energy consumption has often proved to be prohibitive in the absence of costly super-computers. Most state-of-the-art machine learning solutions are based on memory-less models of neurons. This is unlike the neurons in the human brain, which encode and process information using temporal information in spike events. The different computing principles underlying biological neurons and how they combine together to efficiently process information is believed to be a key factor behind their superior efficiency compared to current machine learning systems. Inspired by the time-encoding mechanism used by the brain, third generation spiking neural networks (SNNs) are being studied for building a new class of information processing engines. Modern computing systems based on the von Neumann architecture, however, are ill-suited for efficiently implementing SNNs, since their performance is limited by the need to constantly shuttle data between physically separated logic and memory units. Hence, novel computational architectures that address the von Neumann bottleneck are necessary in order to build systems that can implement SNNs with low energy budgets. In this paper, we review some of the architectural and system level design aspects involved in developing a new class of brain-inspired information processing engines that mimic the time-based information encoding and processing aspects of the brain.",
            "https://jiangwenpl.github.io/files/multi-pose.pdf", "http://www.arxiv-sanity.com/static/thumbs/1901.03690v1.pdf.jpg");
    }

    function testUsercanNumberDeleted()public{
        darxiv.getNumberOfsubmissionsDeleted();
    }
    function testUsercanNumber()public{
        darxiv.getNumberOfsubmissions();
    }

}