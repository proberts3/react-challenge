import React, { ChangeEvent, useMemo, useState } from "react"
import { account } from "../Types/Account"
import { Button, Card, CardContent, Grid, Paper, TextField } from "@mui/material";

type AccountDashboardProps = {
  account: account;
  signOut: () => Promise<void>;
}

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [account, setAccount] = useState(props.account);

  // unary negation, amount is negative in credit accounts
  const depositMax = useMemo(() => (account.type === 'credit' && -account.amount < 1000) ? -account.amount : 1000, [account.amount, account.type]);
  const invalidDeposit = useMemo(() => depositAmount > depositMax, [depositMax, depositAmount]);

  const widthdrawalMax = useMemo(() => {
    const dailyWidthdrawalLimit = 400 - account.todaysWidthdrawals;
    const fundsRemaining = account.type === 'credit'
      ? account.creditLimit + account.amount // amount will be negative for credit accounts
      : account.amount;

    if (dailyWidthdrawalLimit < 200 && dailyWidthdrawalLimit < fundsRemaining) {
      return dailyWidthdrawalLimit;
    }

    if (fundsRemaining < 200) return fundsRemaining;

    return 200;
  }, [account.amount, account.creditLimit, account.todaysWidthdrawals, account.type]);

  const invalidWidthdrawal = useMemo(() =>  withdrawAmount > widthdrawalMax || withdrawAmount % 5 !== 0, [widthdrawalMax, withdrawAmount]);

  const handleSetDeposit = (newAmount: number) => {
    if (typeof newAmount !== 'number') return;
    if (newAmount < 0) setDepositAmount(0);

    setDepositAmount(newAmount);
  }

  const handleWidthdrawalAmount = (newAmount: number) => {
    if (newAmount < 0) setWithdrawAmount(0);
    if (newAmount > account.amount) setWithdrawAmount(account.amount);

    setWithdrawAmount(newAmount)
  }

  const { signOut } = props;

  const depositFunds = async () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: depositAmount })
    }
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/deposit`, requestOptions);
    const data = await response.json();
    setAccount({
      accountNumber: data.account_number,
      name: data.name,
      amount: data.amount,
      type: data.type,
      todaysWidthdrawals: data.todays_widthdrawals,
      creditLimit: data.credit_limit
    });
  }

  const withdrawFunds = async () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: withdrawAmount })
    }
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/withdraw`, requestOptions);
    const data = await response.json();
    setAccount({
      accountNumber: data.account_number,
      name: data.name,
      amount: data.amount,
      type: data.type,
      todaysWidthdrawals: data.todays_widthdrawals,
      creditLimit: data.credit_limit
    });
  }

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={signOut}>Sign Out</Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      {account.type === 'credit' && <h3>Credit Limit: ${account.creditLimit}</h3>}
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12} sm={6}>
          <Card className="deposit-card">
            <CardContent>
              <h3>Deposit</h3>
              <TextField
                error={invalidDeposit}
                fullWidth
                helperText={invalidDeposit && 'Invalid Input'}
                label="Deposit Amount"
                inputProps={{
                  inputMode: 'numeric',
                  max: depositMax,
                  min: 0,
                  pattern: '[0-9]*',
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleSetDeposit(+e.target.value)}
                type="number"
                variant="outlined"
              />
              <Button
                disabled={invalidDeposit || depositAmount === 0}
                onClick={depositFunds}
                sx={{
                  margin: 'auto',
                  marginTop: 2
                }}
                variant="contained"
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card className="withdraw-card">
            <CardContent>
              <h3>Withdraw</h3>
              <TextField
                error={invalidWidthdrawal}
                fullWidth
                helperText={invalidWidthdrawal && 'Invalid Input'}
                inputProps={{
                  inputMode: 'numeric',
                  max: widthdrawalMax,
                  min: 0,
                  pattern: '[0-9]*',
                  step: 5
                }}
                label="Withdraw Amount"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleWidthdrawalAmount(+e.target.value)}
                type="number"
                variant="outlined"
              />
              <Button
                disabled={invalidWidthdrawal || withdrawAmount === 0}
                onClick={withdrawFunds}
                sx={{
                  margin: 'auto',
                  marginTop: 2
                }}
                variant="contained"
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>

  )
}