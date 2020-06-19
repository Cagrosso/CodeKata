export interface SpecialPrice {
  unitCount: number;
  discountPrice: number;
}

export interface cartItem {
  name: string;
  itemRule: ItemRule;
}

export class ItemRule {
  name: string;
  unitPrice: number;
  specialPrice?: SpecialPrice;

  constructor(name: string, unitPrice: number, specialPrice?: SpecialPrice) {
    this.name = name;
    this.unitPrice = unitPrice;
    this.specialPrice = specialPrice
  }

  getPricePerItemCount = (itemCount: number): number => {
    let total = 0;

    if (this.specialPrice) {
      total += this.specialPrice.discountPrice * Math.floor(itemCount / this.specialPrice.unitCount)
      itemCount = itemCount % this.specialPrice.unitCount;
    }

    return total += (itemCount * this.unitPrice);
  }
}

export class Checkout {
  total: number = 0;
  itemRules: ItemRule[];
  cart: Map<string, { count: number }> = new Map();

  constructor(itemRules: ItemRule[] = [new ItemRule("", 0)]) {
    this.itemRules = itemRules;
  }

  splitAndSortInput = (input: string): string[] => {
    return input.split('').sort();
  }

  findItemRule = (itemName: string): ItemRule => {
    const itemRule = this.itemRules.find(itemRule => itemRule.name === itemName)
    if (!itemRule) {
      throw new Error(`No Pricing found for item '${itemName}'`)
    }
    return itemRule;
  }

  updateTotal = () => {
    let newTotal = 0;
    this.cart.forEach((value, itemName) => {
      newTotal += this.findItemRule(itemName).getPricePerItemCount(value.count);
    });

    this.total = newTotal;
  }

  scan = (itemName: string) => {
    const mapValue = this.cart.get(itemName);

    if (mapValue !== undefined) {
      mapValue.count++;
      this.cart.set(itemName, mapValue)
    } else {
      this.cart.set(itemName, { count: 1 });
    }

    this.updateTotal();
  }
}