var expect = require('chai').expect;
var validateMove = require('../index.js');

describe("ValidateKing()", function () {
  it("Should allow king to move one step North", function () {
    const firstCell = { col: 4, row: 0, piece: { type: 'K', color: 'black' } };
    const secondCell = { col: 4, row: 1, piece: null };
    expect(validateMove.validateKing(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow king to move one step NorthEast", function () {
    const firstCell = { col: 4, row: 0, piece: { type: 'K', color: 'black' } };
    const secondCell = { col: 5, row: 1, piece: null };
    expect(validateMove.validateKing(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow king to move one step East", function () {
    const firstCell = { col: 4, row: 0, piece: { type: 'K', color: 'black' } };
    const secondCell = { col: 5, row: 0, piece: null };
    expect(validateMove.validateKing(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow king to move one step SouthEast", function () {
    const firstCell = { col: 4, row: 1, piece: { type: 'K', color: 'black' } };
    const secondCell = { col: 5, row: 0, piece: null };
    expect(validateMove.validateKing(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow king to move one step South", function () {
    const firstCell = { col: 4, row: 1, piece: { type: 'K', color: 'black' } };
    const secondCell = { col: 4, row: 0, piece: null };
    expect(validateMove.validateKing(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow king to move one step SouthWest", function () {
    const firstCell = { col: 4, row: 1, piece: { type: 'K', color: 'black' } };
    const secondCell = { col: 3, row: 0, piece: null };
    expect(validateMove.validateKing(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow king to move one step West", function () {
    const firstCell = { col: 4, row: 0, piece: { type: 'K', color: 'black' } };
    const secondCell = { col: 3, row: 0, piece: null };
    expect(validateMove.validateKing(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow king to move one step NorthWest", function () {
    const firstCell = { col: 4, row: 0, piece: { type: 'K', color: 'black' } };
    const secondCell = { col: 3, row: 1, piece: null };
    expect(validateMove.validateKing(firstCell, secondCell)).to.be.equal(true);
  });
});

describe("ValidateRook()", function () {
  const gameState = [
    { col: 0, row: 0, piece: null },
    { col: 1, row: 0, piece: null },
    { col: 2, row: 0, piece: null },
    { col: 3, row: 0, piece: null },
    { col: 4, row: 0, piece: null },
    { col: 5, row: 0, piece: null },
    { col: 6, row: 0, piece: null },
    { col: 7, row: 0, piece: null },
    { col: 0, row: 1, piece: null },
    { col: 1, row: 1, piece: null },
    { col: 2, row: 1, piece: null },
    { col: 3, row: 1, piece: null },
    { col: 4, row: 1, piece: null },
    { col: 5, row: 1, piece: null },
    { col: 6, row: 1, piece: null },
    { col: 7, row: 1, piece: null },
    { col: 0, row: 2, piece: null },
    { col: 1, row: 2, piece: null },
    { col: 2, row: 2, piece: null },
    { col: 3, row: 2, piece: null },
    { col: 4, row: 2, piece: null },
    { col: 5, row: 2, piece: null },
    { col: 6, row: 2, piece: null },
    { col: 7, row: 2, piece: null },
    { col: 0, row: 3, piece: null },
    { col: 1, row: 3, piece: null },
    { col: 2, row: 3, piece: null },
    { col: 3, row: 3, piece: null },
    { col: 4, row: 3, piece: null },
    { col: 5, row: 3, piece: null },
    { col: 6, row: 3, piece: null },
    { col: 7, row: 3, piece: null },
    { col: 0, row: 4, piece: null },
    { col: 1, row: 4, piece: null },
    { col: 2, row: 4, piece: null },
    { col: 3, row: 4, piece: null },
    { col: 4, row: 4, piece: null },
    { col: 5, row: 4, piece: null },
    { col: 6, row: 4, piece: null },
    { col: 7, row: 4, piece: null },
    { col: 0, row: 5, piece: null },
    { col: 1, row: 5, piece: null },
    { col: 2, row: 5, piece: { type: 'H', color: 'black' } },
    { col: 3, row: 5, piece: null },
    { col: 4, row: 5, piece: null },
    { col: 5, row: 5, piece: { type: 'R', color: 'black' } },
    { col: 6, row: 5, piece: null },
    { col: 7, row: 5, piece: null },
    { col: 0, row: 6, piece: null },
    { col: 1, row: 6, piece: null },
    { col: 2, row: 6, piece: null },
    { col: 3, row: 6, piece: null },
    { col: 4, row: 6, piece: null },
    { col: 5, row: 6, piece: null },
    { col: 6, row: 6, piece: null },
    { col: 7, row: 6, piece: null },
    { col: 0, row: 7, piece: null },
    { col: 1, row: 7, piece: null },
    { col: 2, row: 7, piece: null },
    { col: 3, row: 7, piece: null },
    { col: 4, row: 7, piece: null },
    { col: 5, row: 7, piece: null },
    { col: 6, row: 7, piece: null },
    { col: 7, row: 7, piece: null }
  ];
  it("Should allow Rook to move North", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'R', color: 'black' } };
    const secondCell = { col: 5, row: 7, piece: null };
    expect(validateMove.validateRook(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Rook to move East", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'R', color: 'black' } };
    const secondCell = { col: 7, row: 5, piece: null };
    expect(validateMove.validateRook(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Rook to move South", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'R', color: 'black' } };
    const secondCell = { col: 5, row: 3, piece: null };
    expect(validateMove.validateRook(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Rook to move West", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'R', color: 'black' } };
    const secondCell = { col: 3, row: 5, piece: null };
    expect(validateMove.validateRook(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should not allow Rook to jump over pieces", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'R', color: 'black' } };
    const secondCell = { col: 1, row: 5, piece: null };
    expect(validateMove.validateRook(firstCell, secondCell, gameState)).to.be.equal(false);
  });


});

describe("ValidateHorse()", function () {
  it("Should allow horse to move NorthEast 1", function () {
    const firstCell = { col: 5, row: 4, piece: { type: 'H', color: 'black' } };
    const secondCell = { col: 6, row: 6, piece: null };
    expect(validateMove.validateHorse(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow horse to move NorthEast 2", function () {
    const firstCell = { col: 5, row: 4, piece: { type: 'H', color: 'black' } };
    const secondCell = { col: 7, row: 5, piece: null };
    expect(validateMove.validateHorse(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow horse to move SouthEast 1", function () {
    const firstCell = { col: 5, row: 4, piece: { type: 'H', color: 'black' } };
    const secondCell = { col: 7, row: 3, piece: null };
    expect(validateMove.validateHorse(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow horse to move SouthEast 2", function () {
    const firstCell = { col: 5, row: 4, piece: { type: 'H', color: 'black' } };
    const secondCell = { col: 6, row: 2, piece: null };
    expect(validateMove.validateHorse(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow horse to move SouthWest 1", function () {
    const firstCell = { col: 5, row: 4, piece: { type: 'H', color: 'black' } };
    const secondCell = { col: 4, row: 2, piece: null };
    expect(validateMove.validateHorse(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow horse to move SouthWest 2", function () {
    const firstCell = { col: 5, row: 4, piece: { type: 'H', color: 'black' } };
    const secondCell = { col: 3, row: 3, piece: null };
    expect(validateMove.validateHorse(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow horse to move NorthWest 1", function () {
    const firstCell = { col: 5, row: 4, piece: { type: 'H', color: 'black' } };
    const secondCell = { col: 3, row: 5, piece: null };
    expect(validateMove.validateHorse(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow horse to move NorthWest 2", function () {
    const firstCell = { col: 5, row: 4, piece: { type: 'H', color: 'black' } };
    const secondCell = { col: 4, row: 6, piece: null };
    expect(validateMove.validateHorse(firstCell, secondCell)).to.be.equal(true);
  });


});

describe("ValidateBishop", function () {
  const gameState = [
    { col: 0, row: 0, piece: null },
    { col: 1, row: 0, piece: null },
    { col: 2, row: 0, piece: null },
    { col: 3, row: 0, piece: null },
    { col: 4, row: 0, piece: null },
    { col: 5, row: 0, piece: null },
    { col: 6, row: 0, piece: null },
    { col: 7, row: 0, piece: null },
    { col: 0, row: 1, piece: null },
    { col: 1, row: 1, piece: null },
    { col: 2, row: 1, piece: null },
    { col: 3, row: 1, piece: null },
    { col: 4, row: 1, piece: null },
    { col: 5, row: 1, piece: null },
    { col: 6, row: 1, piece: null },
    { col: 7, row: 1, piece: null },
    { col: 0, row: 2, piece: null },
    { col: 1, row: 2, piece: null },
    { col: 2, row: 2, piece: { type: 'H', color: 'black' }  },
    { col: 3, row: 2, piece: null },
    { col: 4, row: 2, piece: null },
    { col: 5, row: 2, piece: null },
    { col: 6, row: 2, piece: null },
    { col: 7, row: 2, piece: null },
    { col: 0, row: 3, piece: null },
    { col: 1, row: 3, piece: null },
    { col: 2, row: 3, piece: null },
    { col: 3, row: 3, piece: null },
    { col: 4, row: 3, piece: null },
    { col: 5, row: 3, piece: null },
    { col: 6, row: 3, piece: null },
    { col: 7, row: 3, piece: null },
    { col: 0, row: 4, piece: null },
    { col: 1, row: 4, piece: null },
    { col: 2, row: 4, piece: null },
    { col: 3, row: 4, piece: null },
    { col: 4, row: 4, piece: null },
    { col: 5, row: 4, piece: null },
    { col: 6, row: 4, piece: null },
    { col: 7, row: 4, piece: null },
    { col: 0, row: 5, piece: null },
    { col: 1, row: 5, piece: null },
    { col: 2, row: 5, piece: null },
    { col: 3, row: 5, piece: null },
    { col: 4, row: 5, piece: null },
    { col: 5, row: 5, piece: { type: 'B', color: 'black' } },
    { col: 6, row: 5, piece: null },
    { col: 7, row: 5, piece: null },
    { col: 0, row: 6, piece: null },
    { col: 1, row: 6, piece: null },
    { col: 2, row: 6, piece: null },
    { col: 3, row: 6, piece: null },
    { col: 4, row: 6, piece: null },
    { col: 5, row: 6, piece: null },
    { col: 6, row: 6, piece: null },
    { col: 7, row: 6, piece: null },
    { col: 0, row: 7, piece: null },
    { col: 1, row: 7, piece: null },
    { col: 2, row: 7, piece: null },
    { col: 3, row: 7, piece: null },
    { col: 4, row: 7, piece: null },
    { col: 5, row: 7, piece: null },
    { col: 6, row: 7, piece: null },
    { col: 7, row: 7, piece: null }
  ];
  it("Should allow bishop to move NorthEast", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'B', color: 'black' } };
    const secondCell = { col: 7, row: 7, piece: null };
    expect(validateMove.validateBishop(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow bishop to move SouthEast", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'B', color: 'black' } };
    const secondCell = { col: 7, row: 3, piece: null };
    expect(validateMove.validateBishop(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow bishop to move SouthWest", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'B', color: 'black' } };
    const secondCell = { col: 3, row: 3, piece: null };
    expect(validateMove.validateBishop(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow bishop to move NorthWest", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'B', color: 'black' } };
    const secondCell = { col: 3, row: 7, piece: null };
    expect(validateMove.validateBishop(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should not allow bishop to jump over pieces", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'B', color: 'black' } };
    const secondCell = { col: 1, row: 1, piece: null };
    expect(validateMove.validateBishop(firstCell, secondCell, gameState)).to.be.equal(false);
  });
});

describe("ValidateQueen()", function () {
  const gameState = [
    { col: 0, row: 0, piece: null },
    { col: 1, row: 0, piece: null },
    { col: 2, row: 0, piece: null },
    { col: 3, row: 0, piece: null },
    { col: 4, row: 0, piece: null },
    { col: 5, row: 0, piece: null },
    { col: 6, row: 0, piece: null },
    { col: 7, row: 0, piece: null },
    { col: 0, row: 1, piece: null },
    { col: 1, row: 1, piece: null },
    { col: 2, row: 1, piece: null },
    { col: 3, row: 1, piece: null },
    { col: 4, row: 1, piece: null },
    { col: 5, row: 1, piece: null },
    { col: 6, row: 1, piece: null },
    { col: 7, row: 1, piece: null },
    { col: 0, row: 2, piece: null },
    { col: 1, row: 2, piece: null },
    { col: 2, row: 2, piece: { type: 'H', color: 'black' } },
    { col: 3, row: 2, piece: null },
    { col: 4, row: 2, piece: null },
    { col: 5, row: 2, piece: null },
    { col: 6, row: 2, piece: null },
    { col: 7, row: 2, piece: null },
    { col: 0, row: 3, piece: null },
    { col: 1, row: 3, piece: null },
    { col: 2, row: 3, piece: null },
    { col: 3, row: 3, piece: null },
    { col: 4, row: 3, piece: null },
    { col: 5, row: 3, piece: null },
    { col: 6, row: 3, piece: null },
    { col: 7, row: 3, piece: null },
    { col: 0, row: 4, piece: null },
    { col: 1, row: 4, piece: null },
    { col: 2, row: 4, piece: null },
    { col: 3, row: 4, piece: null },
    { col: 4, row: 4, piece: null },
    { col: 5, row: 4, piece: null },
    { col: 6, row: 4, piece: null },
    { col: 7, row: 4, piece: null },
    { col: 0, row: 5, piece: null },
    { col: 1, row: 5, piece: null },
    { col: 2, row: 5, piece: null },
    { col: 3, row: 5, piece: null },
    { col: 4, row: 5, piece: null },
    { col: 5, row: 5, piece: { type: 'Q', color: 'black' } },
    { col: 6, row: 5, piece: null },
    { col: 7, row: 5, piece: null },
    { col: 0, row: 6, piece: null },
    { col: 1, row: 6, piece: null },
    { col: 2, row: 6, piece: null },
    { col: 3, row: 6, piece: null },
    { col: 4, row: 6, piece: null },
    { col: 5, row: 6, piece: null },
    { col: 6, row: 6, piece: null },
    { col: 7, row: 6, piece: null },
    { col: 0, row: 7, piece: null },
    { col: 1, row: 7, piece: null },
    { col: 2, row: 7, piece: null },
    { col: 3, row: 7, piece: null },
    { col: 4, row: 7, piece: null },
    { col: 5, row: 7, piece: null },
    { col: 6, row: 7, piece: null },
    { col: 7, row: 7, piece: null }
  ];

  it("Should allow Queen to move North", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 5, row: 7, piece: null };
    expect(validateMove.validateQueen(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Queen to move NorthEast", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 7, row: 7, piece: null };
    expect(validateMove.validateQueen(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Queen to move East", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 7, row: 5, piece: null };
    expect(validateMove.validateQueen(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Queen to move SouthEast", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 7, row: 3, piece: null };
    expect(validateMove.validateQueen(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Queen to move South", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 5, row: 3, piece: null };
    expect(validateMove.validateQueen(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Queen to move SouthWest", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 3, row: 3, piece: null };
    expect(validateMove.validateQueen(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Queen to move West", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 3, row: 5, piece: null };
    expect(validateMove.validateQueen(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should allow Queen to move NorthWest", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 3, row: 7, piece: null };
    expect(validateMove.validateQueen(firstCell, secondCell, gameState)).to.be.equal(true);
  });

  it("Should not allow Queen to jump over pieces", function () {
    const firstCell = { col: 5, row: 5, piece: { type: 'Q', color: 'black' } };
    const secondCell = { col: 1, row: 1, piece: null };
    expect(validateMove.validateBishop(firstCell, secondCell, gameState)).to.be.equal(false);
  });
  
});

describe("ValidatePawn()", function () {
  it("Should allow Pawn to make one step at start position", function () {
    const firstCell = { col: 0, row: 1, piece: { type: 'P', color: 'black' } };
    const secondCell = { col: 0, row: 2, piece: null };
    expect(validateMove.validatePawn(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow Pawn to make two steps at start position", function () {
    const firstCell = { col: 0, row: 1, piece: { type: 'P', color: 'black' } };
    const secondCell = { col: 0, row: 3, piece: null };
    expect(validateMove.validatePawn(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow Pawn to make one step at non-start position", function () {
    const firstCell = { col: 0, row: 2, piece: { type: 'P', color: 'black' } };
    const secondCell = { col: 0, row: 3, piece: null };
    expect(validateMove.validatePawn(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should allow Pawn to move diagonally during capture", function () {
    const firstCell = { col: 0, row: 1, piece: { type: 'P', color: 'black' } };
    const secondCell = { col: 1, row: 2, piece: { type: 'P', color: 'white' } };
    expect(validateMove.validatePawn(firstCell, secondCell)).to.be.equal(true);
  });

  it("Should not allow Pawn move backwards", function () {
    const firstCell = { col: 0, row: 1, piece: { type: 'P', color: 'black' } };
    const secondCell = { col: 0, row: 0, piece: null };
    expect(validateMove.validatePawn(firstCell, secondCell)).to.be.equal(false);
  });

  it("Should not allow Pawn to make two step at non-start position", function () {
    const firstCell = { col: 2, row: 2, piece: { type: 'P', color: 'black' } };
    const secondCell = { col: 2, row: 4, piece: null };
    expect(validateMove.validatePawn(firstCell, secondCell)).to.be.equal(false);
  });

  it("Should not allow Pawn to move diagonally when not capture", function () {
    const firstCell = { col: 0, row: 1, piece: { type: 'P', color: 'black' } };
    const secondCell = { col: 1, row: 2, piece: null };
    expect(validateMove.validatePawn(firstCell, secondCell)).to.be.equal(false);
  });
});

describe("ValidateMove()", function () {
  const gameState = [
    { col: 0, row: 0, piece: null },
    { col: 1, row: 0, piece: null },
    { col: 2, row: 0, piece: null },
    { col: 3, row: 0, piece: null },
    { col: 4, row: 0, piece: null },
    { col: 5, row: 0, piece: null },
    { col: 6, row: 0, piece: null },
    { col: 7, row: 0, piece: null },
    { col: 0, row: 1, piece: null },
    { col: 1, row: 1, piece: null },
    { col: 2, row: 1, piece: null },
    { col: 3, row: 1, piece: null },
    { col: 4, row: 1, piece: null },
    { col: 5, row: 1, piece: null },
    { col: 6, row: 1, piece: null },
    { col: 7, row: 1, piece: null },
    { col: 0, row: 2, piece: null },
    { col: 1, row: 2, piece: null },
    { col: 2, row: 2, piece: null },
    { col: 3, row: 2, piece: null },
    { col: 4, row: 2, piece: null },
    { col: 5, row: 2, piece: null },
    { col: 6, row: 2, piece: null },
    { col: 7, row: 2, piece: null },
    { col: 0, row: 3, piece: null },
    { col: 1, row: 3, piece: null },
    { col: 2, row: 3, piece: null },
    { col: 3, row: 3, piece: null },
    { col: 4, row: 3, piece: null },
    { col: 5, row: 3, piece: null },
    { col: 6, row: 3, piece: null },
    { col: 7, row: 3, piece: null },
    { col: 0, row: 4, piece: null },
    { col: 1, row: 4, piece: null },
    { col: 2, row: 4, piece: null },
    { col: 3, row: 4, piece: null },
    { col: 4, row: 4, piece: null },
    { col: 5, row: 4, piece: null },
    { col: 6, row: 4, piece: null },
    { col: 7, row: 4, piece: null },
    { col: 0, row: 5, piece: null },
    { col: 1, row: 5, piece: null },
    { col: 2, row: 5, piece: { type: 'H', color: 'black' } },
    { col: 3, row: 5, piece: null },
    { col: 4, row: 5, piece: null },
    { col: 5, row: 5, piece: { type: 'R', color: 'black' } },
    { col: 6, row: 5, piece: null },
    { col: 7, row: 5, piece: null },
    { col: 0, row: 6, piece: null },
    { col: 1, row: 6, piece: null },
    { col: 2, row: 6, piece: null },
    { col: 3, row: 6, piece: null },
    { col: 4, row: 6, piece: null },
    { col: 5, row: 6, piece: null },
    { col: 6, row: 6, piece: null },
    { col: 7, row: 6, piece: null },
    { col: 0, row: 7, piece: null },
    { col: 1, row: 7, piece: null },
    { col: 2, row: 7, piece: null },
    { col: 3, row: 7, piece: null },
    { col: 4, row: 7, piece: null },
    { col: 5, row: 7, piece: { type: 'R', color: 'white' }  },
    { col: 6, row: 7, piece: null },
    { col: 7, row: 7, piece: null }
  ];
  const player = 'black';

  it("Should not allow a move from empty cell", function () {
    const firstCell = { col: 0, row: 5, piece: null };
    const secondCell = { col: 0, row: 6, piece: null };
    expect(validateMove.validateMove(firstCell, secondCell, gameState, player)).to.be.equal(false);
  });

  it("Should not allow a move to the same cell", function () {
    const firstCell = { col: 0, row: 5, piece: { type: 'R', color: 'black' } };
    const secondCell = { col: 0, row: 5, piece: { type: 'H', color: 'black' } };
    expect(validateMove.validateMove(firstCell, secondCell, gameState, player)).to.be.equal(false);
  });

  it("Should not allow a move to a same color piece", function () {
    const firstCell = { col: 0, row: 5, piece: { type: 'R', color: 'black' } };
    const secondCell = { col: 0, row: 6, piece: { type: 'H', color: 'black' } };
    expect(validateMove.validateMove(firstCell, secondCell, gameState, player)).to.be.equal(false);
  });

  it("Should not allow a player to move opponenets piece", function () {
    const firstCell = { col: 5, row: 7, piece: { type: 'R', color: 'white' } };
    const secondCell = { col: 0, row: 7, piece: null };
    expect(validateMove.validateMove(firstCell, secondCell, gameState, player)).to.be.equal(false);
  });
});