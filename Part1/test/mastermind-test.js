//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Super mastermind variation test", function () {
  this.timeout(100000000);

  it("super mastermind guesses correctly", async () => {
    const circuit = await wasm_tester(
      "contracts/circuits/MastermindVariation.circom"
    );
    await circuit.loadConstraints();

    const INPUT = {
      pubGuessA: "1",
      pubGuessB: "2",
      pubGuessC: "3",
      pubGuessD: "4",
      pubGuessE: "5",
      pubNumHit: "5",
      pubNumBlow: "0",
      pubSolnHash:
        "16793699232576617650261403608752202678179645531396572754462570582194266146922",

      privSolnA: "1",
      privSolnB: "2",
      privSolnC: "3",
      privSolnD: "4",
      privSolnE: "5",
      privSalt: "922934239484",
    };

    const witness = await circuit.calculateWitness(INPUT, true);

    console.log(Fr.e(witness[0]));
    console.log(Fr.e(witness[1]));
    //console.log(witness);

    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
    assert(Fr.eq(Fr.e(witness[1]), Scalar.fromString(INPUT["pubSolnHash"])));
  });
});
