class Player {
    constructor(id, name) {
        this.socketId = id;
        this.name = name;
        this.points = 0;
    }

    addPoint() {
        this.points += 1;
    }
}

export default Player;