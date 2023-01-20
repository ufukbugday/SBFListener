import { SocketMessageType } from "./socket-message-type.model";

export class SocketMessage{
    messageType: SocketMessageType
    timestamp: Date

    constructor(messageType: SocketMessageType, timestamp: Date) {
        this.messageType = messageType
        this.timestamp = timestamp;
    }
}