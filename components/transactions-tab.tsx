import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TransactionsTab() {
  const transactions = [
    {
      id: 1,
      date: "2023-07-01 14:30",
      type: "Deposit",
      amount: "1000 USDT",
      address: "0x1234...5678",
      hash: "0xabcd...efgh",
    },
    {
      id: 2,
      date: "2023-06-30 09:15",
      type: "Withdrawal",
      amount: "500 SOL",
      address: "0x8765...4321",
      hash: "0xijkl...mnop",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Transaction Hash</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.type}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.address}</TableCell>
            <TableCell>{transaction.hash}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

