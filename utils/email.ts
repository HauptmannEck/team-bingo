import mail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    mail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendEmail = async (to: string, subject: string, text: string) => {
    const msg: mail.MailDataRequired = {
        to, // Change to your recipient
        from: 'happybandittech@gmail.com', // Change to your verified sender
        subject,
        text,
    };
    return mail
        .send(msg)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};


