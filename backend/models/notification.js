export default class NotificationService {
    sendEmail(to, subject, message) {
        console.log(`Email sent to ${to}: ${subject} - ${message}`);
    }

    sendConfirmation(to, requestId) {
        console.log(`Confirmation sent for request ${requestId} to ${to}`);
    }
}
