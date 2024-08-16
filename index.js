const twilio = require('twilio');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const accountSid = 'AC93c8e3988760c91074959ee1e13861a7';
const authToken = 'b2840db6b6e46193b15b968249a954b4';
const client = new twilio(accountSid, authToken);

const twilioPhoneNumber = '+12563028114';
const yourPhoneNumber = '+919664309440';

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ivr', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();

    twiml.play('https://1drv.ms/u/s!AssNWNmUSYNtjv9VSb0TQm5cQ8_YQQ?e=ubsLY3');
    twiml.gather({
        numDigits: 1,
        action: '/gather',
        method: 'POST'
    });

    res.type('text/xml');
    res.send(twiml.toString());
});

app.post('/gather', (req, res) => {
    const digitPressed = req.body.Digits;
    console.log('Digit pressed:', digitPressed);
    const twiml = new twilio.twiml.VoiceResponse();

    if (digitPressed == '1') {
        client.messages.create({
            body: 'Here is your personalized interview link: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test',
            from: twilioPhoneNumber,
            to: yourPhoneNumber
        }).then(message => console.log(message.sid));

        twiml.say('The interview link has been sent to your phone.');
    } else {
        twiml.say('You did not press 1. Goodbye!');
    }

    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
});

const makeCall = () => {
    client.calls.create({
        url: 'https://0b50-2409-4052-99c-e8cd-b10d-26c2-b100-3715.ngrok-free.app/ivr',  
        to: yourPhoneNumber,
        from: twilioPhoneNumber
    }).then(call => console.log(call.sid)).catch(err => console.error(err));
};

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    makeCall();
});

