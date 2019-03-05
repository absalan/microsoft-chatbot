// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityTypes, TurnContext } from 'botbuilder';

export class MyBot {
    public qnaServices;

    constructor(qnaServices) {
        this.qnaServices = qnaServices;
    }
    /**
     * Use onTurn to handle an incoming activity, received from a user, process it, and reply as needed
     *
     * @param {TurnContext} context on turn context object.
     */
    public onTurn = async (turnContext: TurnContext) => {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types
        if (turnContext.activity.type === ActivityTypes.Message) {

            if (turnContext.activity.attachments) {
                await turnContext.sendActivity(`File: "${turnContext.activity.attachments[0].name}" has been received but we don't do anything with it right now.`);
            } else {

                for (let i = 0; i < this.qnaServices.length; i++) {
                    // Perform a call to the QnA Maker service to retrieve matching Question and Answer pairs.
                    const qnaResults = await this.qnaServices[i].getAnswers(turnContext);

                    // If an answer was received from QnA Maker, send the answer back to the user and exit.
                    if (qnaResults[0]) {
                        await turnContext.sendActivity(qnaResults[0].answer);
                        return;
                    }
                }

                await turnContext.sendActivity('No QnA Maker answers were found.');
            }
        } else {
            // Generic handler for all other activity types.
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }

}
