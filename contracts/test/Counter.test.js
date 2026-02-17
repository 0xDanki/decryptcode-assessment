const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let counter;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should start with count of 0", async function () {
      expect(await counter.getCount()).to.equal(0);
    });
  });

  describe("Increment", function () {
    it("Should increment count by 1", async function () {
      await counter.increment();
      expect(await counter.getCount()).to.equal(1);
    });

    it("Should increment multiple times correctly", async function () {
      await counter.increment();
      await counter.increment();
      await counter.increment();
      expect(await counter.getCount()).to.equal(3);
    });

    it("Should emit CounterIncremented event with correct value", async function () {
      await expect(counter.increment())
        .to.emit(counter, "CounterIncremented")
        .withArgs(1);
    });

    it("Should allow any address to increment", async function () {
      await counter.connect(addr1).increment();
      expect(await counter.getCount()).to.equal(1);
    });
  });

  describe("Decrement", function () {
    it("Should decrement count by 1", async function () {
      await counter.increment();
      await counter.increment();
      await counter.decrement();
      expect(await counter.getCount()).to.equal(1);
    });

    it("Should emit CounterDecremented event with correct value", async function () {
      await counter.increment();
      await expect(counter.decrement())
        .to.emit(counter, "CounterDecremented")
        .withArgs(0);
    });

    it("Should revert when decrementing from 0", async function () {
      await expect(counter.decrement()).to.be.revertedWith("Counter: underflow");
    });

    it("Should revert when trying to go below 0 after increments", async function () {
      await counter.increment();
      await counter.decrement();
      await expect(counter.decrement()).to.be.revertedWith("Counter: underflow");
    });

    it("Should allow any address to decrement", async function () {
      await counter.increment();
      await counter.connect(addr1).decrement();
      expect(await counter.getCount()).to.equal(0);
    });
  });

  describe("GetCount", function () {
    it("Should return correct count after multiple operations", async function () {
      await counter.increment();
      await counter.increment();
      await counter.increment();
      await counter.decrement();
      expect(await counter.getCount()).to.equal(2);
    });

    it("Should be callable by any address", async function () {
      await counter.increment();
      expect(await counter.connect(addr1).getCount()).to.equal(1);
    });
  });

  describe("Complex scenarios", function () {
    it("Should handle increment/decrement sequence correctly", async function () {
      await counter.increment(); // 1
      await counter.increment(); // 2
      await counter.decrement(); // 1
      await counter.increment(); // 2
      await counter.increment(); // 3
      await counter.decrement(); // 2
      await counter.decrement(); // 1
      expect(await counter.getCount()).to.equal(1);
    });

    it("Should emit correct events in sequence", async function () {
      await expect(counter.increment())
        .to.emit(counter, "CounterIncremented")
        .withArgs(1);
      
      await expect(counter.increment())
        .to.emit(counter, "CounterIncremented")
        .withArgs(2);
      
      await expect(counter.decrement())
        .to.emit(counter, "CounterDecremented")
        .withArgs(1);
    });
  });
});
