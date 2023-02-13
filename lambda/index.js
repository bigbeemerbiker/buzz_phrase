/* *
 * This BUZZ PHRASE GENERATOR demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 *
 * "alexa-layouts" is an APL responsive layouts package that includes components and templates and can be imported in JSON .. (includes AlexaHeadline)
 *  .. see https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-layouts-overview.html#import-the-alexa-layouts-package
 *
 * ITS INVOCATION NAME IS 
 * "BUZZ PHRASE" 
 * */
const Alexa = require('ask-sdk-core');
const Util = require('./util.js');
const BuzzAPLdoc = require('./BuzzPhraseAPL.json');

const adj1 = [
    'holistic',
    'augmented',
    'dedicated',
    'digital',
    'virtual',
    'empowering',
    'multi-agency',
    'predictive',
    'refocused',
    'results-driven',
    'ballpark'
    ];
    
const adj2 = [
    'collaborative',
    'shared',
    'smart',
    'differentiated',
    'integrated',
    'cloud',
    'dynamic',
    'cross-platform',
    'customer-centric',
    'hyper-local'
    ];
    
const noun = [
    'transformation',
    'model',
    'synergy',
    'intervention',
    'monitoring',
    'project',
    'response',
    'management',
    'paradigm',
    'touchpoint'
    ];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = `Welcome to Buzz-Phrase. 
            You speak any three-digit number and I will speak a three-word buzz phrase for
            you to use in your next report or presentation, slipping it past your manager or editor. 
            Or interrupt me now with something like, Alexa, four seven seven.
              <break time="0.5s" />
            Now now, <prosody volume="loud">DON'T</prosody> chicken out. 
            Speak your three-digit number when I stop talking, 
            for example, two zero three. 
            Otherwise, say something anytime using the style: Alexa, ask Buzz Phrase to use two zero three. `;
    
     console.log("CONSOLE_LOG: JUST B4 TEST FOR APL SUPPORT ON DEVICE ");
      
    // test for APL support    
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        console.log("CONSOLE_LOG: APL is supported? = ", Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL'] );
        handlerInput.responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        document: BuzzAPLdoc,
        datasources: {  // for BuzzAPLdoc .. only one: stuff
            stuff: {
                backgroundImage: {
                    url: "",
                    colorOverlay: false
                }, 
                backgroundVideo: {
                    url: Util.getS3PreSignedUrl("Media/buzzingBee.mp4")
                }, 
                headerTitle: "Buzz Phrase",
                logoUrl: Util.getS3PreSignedUrl("Media/Bee-108x108.png"),
                textContent: {
                    primaryText: "Buzz Phrase",
                    secondaryText: "This skill turns any 3-digit number into a buzz phrase",
                    hintText: "eg say \"203\" or say \"Alexa, ask Buzz Phrase to use 203\""
                }
            }
        }
    })
    } // end of directive added when APL support present
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Now, speak a three-digit number. ')
            .getResponse();
    }
};

const BuzzNumberIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BuzzNumberIntent';
    },
    handle(handlerInput) {
        let responseBuilder = handlerInput.responseBuilder;
        var speakOutput = ' ';
        
        //speakOutput += `Welcome to the handler for Buzz Number Intent. `;
       
        var digit1, digit2, digit3, digits123;
        
        digits123 = handlerInput.requestEnvelope.request.intent.slots.three_digit_number.value;
        console.log('CONSOLE_LOG: digits123 = ', digits123);
        
        // emergency action if digits123 is not a number -- use random number between 0 and 999
        if(isNaN(digits123)) digits123 = Math.floor(Math.random() * (999 + 1));
        
          digits123 = digits123%1000; // remainder, so 1024 --> 24 and 6 --> 6
          digit1 = Math.floor(digits123/100);  // eg 254 --> 2 and 6 --> 0
          digit2 = Math.floor(digits123/10) - digit1*10;  // eg 254 --> 5 and 6 --> 0
          digit3 = digits123 - digit1*100 - digit2*10; // eg 254 --> 4 and 6 --> 6
          console.log ("CONSOLE_LOG: digits123, digit1, digit2, digit3 = ", digits123, digit1, digit2, digit3);
        
          // speakOutput += `${digit1} and  ${digit2} and ${digit3}. `;
          
          /***********************/
           // test for APL support    
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        console.log("CONSOLE_LOG: APL is supported? = ", Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL'] );
        handlerInput.responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        document: BuzzAPLdoc,
        datasources: {  // for BuzzAPLdoc .. only one: stuff
            stuff: {
                backgroundImage: {
                    url: "",
                    colorOverlay: false
                }, 
                backgroundVideo: {
                    url: Util.getS3PreSignedUrl("Media/buzzingBee.mp4")
                },
                 headerTitle: "Buzz Phrase",
                logoUrl: Util.getS3PreSignedUrl("Media/Bee-108x108.png"),
                textContent: {
                    primaryText: adj1[digit1] + '  ' + adj2[digit2] + '  ' + noun[digit3],
                    secondaryText: "is the phrase you must use in your report/presentation",
                    hintText:  "DON'T CHICKEN OUT!!"
                }
            }
        }
    })
    } // end of directive added when APL support present
       
           /***********************/
        
        speakOutput += `Okay. The buzz phrase you must use is. `;
        const phrase = adj1[digit1] + '\r\n ' + adj2[digit2] + '\r\n ' + noun[digit3];
        speakOutput += phrase;
        //speakOutput += adj1[digit1] + ' ' + adj2[digit2] + ' ' + noun[digit3];
        speakOutput += '. That is. ' + adj1[digit1] + ', ' + adj2[digit2] + ', ' + noun[digit3];

        return responseBuilder
            .speak(speakOutput)
            .withSimpleCard("The BUZZ PHRASE you must use is", phrase)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Try saying, Alexa, followed by a three-digit number.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye from the Buzz Phrase Skill. ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I couldn\'t follow that. Try saying, Alexa, followed by a three-digit number.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        BuzzNumberIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();