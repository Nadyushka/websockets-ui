import {ConnectionType} from "../types/CommonTypes";

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

    addConnection(info: ConnectionType) {
        this.connections.push(info)
    }

    removeCollection(userIndex: string) {
        const connectionInx = this.connections.findIndex(connection => connection.userIndex === userIndex)
        this.connections.splice(connectionInx, 1)
    }
}
