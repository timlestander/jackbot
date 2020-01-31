"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MAX_NUMBERS = 42;
const PORT = 3000;
const app = express_1.default();
app.post('/eurojackpot', (req, res) => {
    return res.send({
        ok: "true",
        message: generateResponse(7)
    });
});
function generateResponse(amount) {
    const selectedNumbers = [];
    do {
        const nextNumber = Math.ceil(Math.random() * MAX_NUMBERS) + 1;
        if (selectedNumbers.indexOf(nextNumber) === -1) {
            selectedNumbers.push(nextNumber);
        }
    } while (selectedNumbers.length < amount);
    return `Probably the winning numbers: ${selectedNumbers.join(" - ")}`;
}
app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Example app listening on port ${PORT}!`);
});
//# sourceMappingURL=index.js.map