import mail from '@sendgrid/mail';
import { MailContent } from '@sendgrid/helpers/classes/mail';
import serverLogger from './logServer';

if ( process.env.SENDGRID_API_KEY ) {
    mail.setApiKey( process.env.SENDGRID_API_KEY );
}

type Content = { text: string } | { html: string } | { templateId: string } | { content: MailContent[] & { 0: MailContent } };

export const sendEmail = async ( to: string, subject: string, content: Content ) => {
    const msg: mail.MailDataRequired = {
        to, // Change to your recipient
        from: 'happybandittech@gmail.com', // Change to your verified sender
        subject,
        ...content,
    };
    return mail
        .send( msg )
        .then( () => {
            console.log( 'Email sent' );
        } )
        .catch( ( error ) => {
            console.error( error );
            serverLogger.error( error );
        } );
};


