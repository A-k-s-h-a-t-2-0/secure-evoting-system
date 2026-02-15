// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    mapping(uint => uint) public votes;
    mapping(address => bool) public hasVoted;

    function castVote(uint candidateId) external {
        require(!hasVoted[msg.sender], "Already voted");
        votes[candidateId]++;
        hasVoted[msg.sender] = true;
    }

    function getVoteCount(uint candidateId) external view returns(uint) {
        return votes[candidateId];
    }
}
