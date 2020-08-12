import CertifierProcess from './certifier-process';
import ClaimDocument from './claim-document';
import BlockchainClaim from './blockchain-claim';
import Question from './question';
import Message from './message';
import Call from './call';

export class CertifierService {
	// Certifier Process
	newProcess = async data => {
		return CertifierProcess.create(data);
	};

	editProcess = data => {
		return CertifierProcess.update(data);
	};

	deleteProcess = id => {
		return CertifierProcess.delete(id);
	};

	loadAllProcesses = walletId => {
		return CertifierProcess.findAll(walletId);
	};

	loadOneProcess = id => {
		return CertifierProcess.findById(id);
	};

	// Claim Document
	newClaimDocument = async data => {
		return ClaimDocument.create(data);
	};

	deleteClaimDocument = id => {
		return ClaimDocument.delete(id);
	};

	loadClaimDocuments = walletId => {
		return ClaimDocument.findAll(walletId);
	};

	loadClaimDocument = id => {
		return ClaimDocument.findById(id);
	};

	// Blockchain Claims
	newBlockchainClaim = async data => {
		return BlockchainClaim.create(data);
	};

	deleteBlockchainClaim = id => {
		return BlockchainClaim.delete(id);
	};

	loadBlockchainClaims = walletId => {
		return BlockchainClaim.findAll(walletId);
	};

	loadBlockchainClaim = id => {
		return BlockchainClaim.findById(id);
	};

	// Questions
	newQuestion = async data => {
		return Question.create(data);
	};

	editQuestion = data => {
		return Question.update(data);
	};

	deleteQuestion = id => {
		return Question.delete(id);
	};

	loadAllQuestions = walletId => {
		return Question.findAll(walletId);
	};

	loadOneQuestion = id => {
		return Question.findById(id);
	};

	// Messages
	newMessage = async data => {
		return Message.create(data);
	};

	editMessage = data => {
		return Message.update(data);
	};

	deleteMessage = id => {
		return Message.delete(id);
	};

	loadAllMessages = walletId => {
		return Message.findAll(walletId);
	};

	loadOneMessage = id => {
		return Message.findById(id);
	};

	// Calls
	newCall = async data => {
		return Call.create(data);
	};

	editCall = data => {
		return Call.update(data);
	};

	deleteCall = id => {
		return Call.delete(id);
	};

	loadAllCalls = walletId => {
		return Call.findAll(walletId);
	};

	loadOneCall = id => {
		return Call.findById(id);
	};
}

export default CertifierService;
