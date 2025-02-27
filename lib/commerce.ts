interface ChargeRequest {
  name: string;
  description: string;
  pricing_type: string;
  local_price: {
    amount: string;
    currency: string;
  };
}

export async function createCharge(
  wallet: any,
  args: {
    name: string;
    description: string;
    amount: string;
    currency: string;
    pricing_type: "fixed_price" | "no_price";
  },

): Promise<string> {
  const params: ChargeRequest = {
    name: args.name,
    description: args.description,
    pricing_type: args.pricing_type,
    local_price: {
      amount: args.amount,
      currency: args.currency,
    },
  };

  const response = await fetch(process.env.COINBASE_COMMERCE_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CC-Api-Key": process.env.COINBASE_COMMERCE_KEY || "",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to create charge: \${response.statusText}`);
  }

  const data = await response.json();
  return `Successfully created charge:
    Name: \${data.data.name}
    Description: \${data.data.description}
    Amount: \${data.data.pricing.local.amount} \${data.data.pricing.local.currency}
    Hosted URL: \${data.data.hosted_url}`;
}