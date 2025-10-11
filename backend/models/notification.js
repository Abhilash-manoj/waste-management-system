// SendNotification.js
import nodemailer from "nodemailer";
import  { sendEmail } from "../services/emialServices.js";

export class SendNotification {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail", // can be changed
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    static async sendRejectionMail(to, userName) {
        const subject = "Application Rejected";
        const text = `Hello ${userName},\n\nWe regret to inform you that your Request has been rejected.\n\nRegards,\nTeam`;
        await sendEmail(to, subject, text);
    }

    static async sendAcceptedMail(to, userName, details) {
        const subject = "Application Accepted";
        const text = `Hello ${userName},\n\n Your request has been accepted by ${details.workerName} and will come on ${details.selectedDate}.To contact the worker, please reach out at ${details.workerContact}.\n\nRegards,\nTeam`;
        await sendEmail(to, subject, text);
    }

    static async sendTaskMail(to, userName) {
        const subject = "Task Assigned";
        const text = `Hello ${userName},\n\n You have been assigned a new task.\n\nRegards,\nTeam`;
        await sendEmail(to, subject, text);
    }

    static async sendCompletionMail(to, userName, details) {
        const subject = "Request Completed";
        const text = `Hello ${userName},\n\nYour waste request with RequestId "${details.requestId}" has been successfully completed by ${details.workerName}.\n\nThank you for your efforts!\n\nRegards,\nTeam`;
        await sendEmail(to, subject, text);
    }
}
