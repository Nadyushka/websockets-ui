import {ConnectionsDb} from "../db/connections.db";
import {WinnersDb} from "../db/winners.db";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";

const connectionDb = ConnectionsDb.getInstance()
const winnersDb = WinnersDb.getInstance()

export const updateWinners = () => {
    const winners = winnersDb.getWinners()
    const connection = connectionDb.getConnections()

    const message = prepareJsonResponse(
        MessageTypeEnum.UpdateWinners,
        JSON.stringify(winners)
        )

    connection.forEach(connection => {
        connection.ws.send(message)
    })
}
