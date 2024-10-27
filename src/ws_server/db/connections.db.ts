import {ConnectionType} from "../types/CommonTypes";
import {WebSocket} from "ws";

export class ConnectionsDb {
    public static instance: ConnectionsDb;

    public static getInstance() {
        if (!ConnectionsDb.instance) {
            ConnectionsDb.instance = new ConnectionsDb();
        }
        return ConnectionsDb.instance;
    }

    private connections: ConnectionType[]  = []

    getConnections():ConnectionType[] {
        return this.connections
    }

    getConnection(clientIndex: string | number): WebSocket {
        return this.connections.find(connection => connection.userIndex === clientIndex)!.ws
    }

    addConnection(info: ConnectionType) {
        this.connections.push(info)
    }

    removeCollection(userIndex: string) {
        const connectionInx = this.connections.findIndex(connection => connection.userIndex === userIndex)
        this.connections.splice(connectionInx, 1)
    }
}
