export class WinnersDb {
    public static instance: WinnersDb;

    public static getInstance() {
        if (!WinnersDb.instance) {
            WinnersDb.instance = new WinnersDb();
        }
        return WinnersDb.instance;
    }

    private winners: { name: string ,wins: number }[]  = []

    getWinners() {
        return this.winners
    }

    addWinner(name: string) {
        const userInWinnersList = this.winners.find(winner => winner.name === name)
        if (userInWinnersList) {
            userInWinnersList.wins = userInWinnersList.wins + 1
        } else {
            const winnerToAdd = {
                name,
                wins: 1
            }

            this.winners.push(winnerToAdd)
        }

        return this.winners
    }
}
