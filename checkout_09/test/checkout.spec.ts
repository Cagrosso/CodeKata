import { expect } from "chai";
import { Checkout, ItemRule } from "../app/checkout";

describe('Back to Checkout', () => {
  describe("itemRule", () => {
    it('should return correct price when getTotal is called', () => {
      const itemRule = new ItemRule("A", 5, { unitCount: 2, discountPrice: 9 });
      expect(itemRule.getPricePerItemCount(3)).to.equal(14);
    });

    it('should use the special price when conditions are met', () => {
      const itemRule = new ItemRule("A", 1, { unitCount: 3, discountPrice: 2 });
      expect(itemRule.getPricePerItemCount(3)).to.equal(2);
    });

    it('should use the special price when conditions are met and the normal price for additional items', () => {
      const itemRule = new ItemRule("A", 1, { unitCount: 3, discountPrice: 2 });
      expect(itemRule.getPricePerItemCount(5)).to.equal(4);
    });

    it('should use the special price for each set of matching conditions', () => {
      const itemRule = new ItemRule("A", 1, { unitCount: 3, discountPrice: 2 });
      expect(itemRule.getPricePerItemCount(6)).to.equal(4);
    });

    it('should not use the special price when SpecialPrice.unitCount is not met', () => {
      const itemRule = new ItemRule("A", 5, { unitCount: 2, discountPrice: 9 });
      expect(itemRule.getPricePerItemCount(1)).to.equal(5);
    })
  });

  describe("checkout", () => {
    const price = (cartItems: string, rules: ItemRule[] = [
      new ItemRule("A", 1, { unitCount: 4, discountPrice: 3 }),
      new ItemRule("B", 2, {unitCount: 3, discountPrice: 2}),
    ]): number => {
      const checkout = new Checkout(rules);
      cartItems.split('').forEach(item => checkout.scan(item));

      return checkout.total;
    }
      
    it('should add items to cart when scanned', () => {
      const checkout = new Checkout([new ItemRule("A", 0)]);

      checkout.scan("A");
      checkout.scan("A");
      checkout.scan("A");
      expect(checkout.cart.get("A")).to.eql({ count: 3 });
    });

    it('should add items of different type to cart when scanned', () => {
      const checkout = new Checkout([new ItemRule("A", 0), new ItemRule("B", 0)]);
      checkout.scan("A");
      checkout.scan("B");
      checkout.scan("A");
      checkout.scan("B");
      expect(checkout.cart.get("A")).to.eql({ count: 2 });
      expect(checkout.cart.get("B")).to.eql({ count: 2 });
    });

    it('should return the correct total for a shopping cart with no special prices', () => {
      expect(price("AAA")).to.equal(3);
    });

    it('should return the correct total for 2 different items', () => {
      expect(price("AABB")).to.equal(6);
    });

    it('should return the correct total for a shopping cart with special prices', () => {
      expect(price("AAAA")).to.equal(3);
    });

    it('should return the correct total for a shopping cart with multiple items and with special prices', () => {
      expect(price("ABABAB")).to.equal(5);
    });
  });
});

